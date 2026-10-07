// frontend/app/login/page.tsx
"use client"

import Link from "next/link"
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, Sparkles, Loader2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authService } from "@/services/auth.service"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { recarregarUsuario } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState<string | null>(null)
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setErro(null)
    setCarregando(true)

    try {
      await authService.login({ email, senha })
      await recarregarUsuario()
      router.push("/")
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErro(err.message)
      } else {
        setErro("Credenciais inválidas ou erro no servidor.")
      }
    } finally {
      setCarregando(false)
    }
  }

  return (
    <main className="grid min-h-screen bg-[#fbf7f1] lg:grid-cols-2">
      <section className="hidden bg-[#4b2e25] p-10 text-white lg:flex lg:flex-col lg:justify-between lg:p-14">
        <Link href="/landing" className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-2xl bg-[#d28a4d]">
            <Sparkles />
          </span>
          <span className="text-lg font-bold">
            Padaria<span className="text-[#e5a66e]">Gest</span>
          </span>
        </Link>
        <div className="max-w-md">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#e5a66e]">
            Bom ter você de volta
          </p>
          <h1 className="text-5xl font-bold leading-tight">
            Sua padaria, no ritmo certo.
          </h1>
          <p className="mt-6 leading-7 text-[#dcbda5]">
            Acesse seu painel para acompanhar o que acontece na produção, no estoque e nas vendas.
          </p>
        </div>
        <p className="text-sm text-[#dcbda5]">
          Gestão que acompanha seu crescimento.
        </p>
      </section>

      <section className="flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <Link
            href="/landing"
            className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-[#8b4f36] lg:hidden"
          >
            <ArrowLeft data-icon="inline-start" /> Voltar para início
          </Link>
          <div className="mb-8">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-[#f3e5d7] text-[#8b4f36] lg:hidden">
              <Sparkles />
            </span>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-[#34231d]">
              Acesse sua conta
            </h2>
            <p className="mt-2 text-sm text-[#70594e]">
              Entre para continuar gerenciando sua padaria.
            </p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            {erro && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {erro}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-[#4b2e25]">
                E-mail
              </Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#a98775]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="voce@padaria.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl border-[#e2cdbb] bg-white pl-10 focus-visible:ring-[#8b4f36]"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[#4b2e25]">
                  Senha
                </Label>
                <Link
                  href="/recuperar-senha"
                  className="text-xs font-semibold text-[#8b4f36] hover:underline"
                >
                  Esqueci minha senha
                </Link>
              </div>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#a98775]" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  className="h-12 rounded-xl border-[#e2cdbb] bg-white pl-10 pr-11 focus-visible:ring-[#8b4f36]"
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a98775] hover:text-[#8b4f36]"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={carregando}
              className="mt-2 h-12 rounded-xl bg-[#8b4f36] text-white hover:bg-[#6f3c2a]"
            >
              {carregando ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Entrando...
                </>
              ) : (
                "Entrar no sistema"
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-[#70594e]">
            Ainda não tem acesso?{" "}
            <span className="font-semibold text-[#8b4f36]">
              Fale com o administrador
            </span>
          </p>
        </div>
      </section>
    </main>
  )
}