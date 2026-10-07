const BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"
).replace(/\/+$/, "");

export const TOKEN_STORAGE_KEY = "@PaoDaVida:token";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ErrorBody = {
  mensagem?: string;
  message?: string;
  error?: string;
};

function extrairMensagem(body: ErrorBody | null): string | null {
  if (!body) return null;
  if (typeof body.mensagem === "string" && body.mensagem) return body.mensagem;
  if (typeof body.message === "string" && body.message) return body.message;
  if (typeof body.error === "string" && body.error) return body.error;
  return null;
}

async function lerErro(response: Response): Promise<{ mensagem: string; detalhes: unknown }> {
  try {
    const corpo = (await response.json()) as ErrorBody;
    return {
      mensagem: extrairMensagem(corpo) ?? `Erro HTTP ${response.status}`,
      detalhes: corpo,
    };
  } catch {
    return { mensagem: `Erro HTTP ${response.status}`, detalhes: null };
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem(TOKEN_STORAGE_KEY) : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const url = `${BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return null as T;
  }

  if (response.status === 401) {
    const { mensagem, detalhes } = await lerErro(response);

    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      const naTelaDeLogin = window.location.pathname === "/login";
      if (!naTelaDeLogin) {
        window.location.href = "/login";
      }
      if (naTelaDeLogin) {
        throw new ApiError(401, mensagem, detalhes);
      }
    }
    throw new ApiError(401, "Sessão expirada. Faça login novamente.", detalhes);
  }

  if (!response.ok) {
    const { mensagem, detalhes } = await lerErro(response);
    throw new ApiError(response.status, mensagem, detalhes);
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

export default apiFetch;
