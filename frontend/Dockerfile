# syntax=docker/dockerfile:1

# ============================================================
# ESTÁGIO 1 (builder): instala dependências e gera o build
# ============================================================
FROM node:24-alpine AS builder

WORKDIR /app

# Mesma versão do pnpm usada no desenvolvimento local (lockfile v9)
RUN npm install -g pnpm@12.9.1

# Copia primeiro só o manifesto de dependências → camada de cache:
# enquanto o lockfile não mudar, o `pnpm install` não roda de novo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Agora sim, copia o código e builda
COPY . .

# A URL da API é embutida no bundle na hora do BUILD do Next.js,
# por isso é ARG (e não ENV de runtime)
ARG NEXT_PUBLIC_API_URL=http://localhost:8080
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm build

# ============================================================
# ESTÁGIO 2 (runner): imagem final enxuta, só com o necessário
# ============================================================
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Usuário sem privilégios de root para rodar o servidor
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# "output: 'standalone'" no next.config.mjs gera .next/standalone
# com apenas as dependências usadas (node_modules podado)
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
