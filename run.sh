#!/usr/bin/env bash
# ============================================================
#  run.sh — sobe/gerencia o projeto Pão da Vida Control inteiro
#
#  Uso:
#    ./run.sh              (igual a "./run.sh up")
#    ./run.sh status
#    ./run.sh logs [serviço]
#    ./run.sh build
#    ./run.sh restart
#    ./run.sh down
#    ./run.sh dev
#    ./run.sh clean
#    ./run.sh help
# ============================================================
set -euo pipefail

# --- cores (desativadas quando não é terminal) ---------------
if [ -t 1 ]; then
  C_RESET=$'\033[0m'; C_BOLD=$'\033[1m'
  C_GREEN=$'\033[32m'; C_YELLOW=$'\033[33m'; C_RED=$'\033[31m'
  C_BLUE=$'\033[34m'; C_CYAN=$'\033[36m'
else
  C_RESET=""; C_BOLD=""; C_GREEN=""; C_YELLOW=""; C_RED=""; C_BLUE=""; C_CYAN=""
fi

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

APP_URL="http://localhost:3000"
API_URL="http://localhost:8080"
SERVICOS=(postgres backend frontend)

info()  { printf '%s\n' "${C_BLUE}➜${C_RESET} $*"; }
ok()    { printf '%s\n' "${C_GREEN}✔${C_RESET} $*"; }
warn()  { printf '%s\n' "${C_YELLOW}⚠${C_RESET} $*"; }
erro()  { printf '%s\n' "${C_RED}✘${C_RESET} $*" >&2; }

# ------------------------------------------------------------
# Pré-requisitos
# ------------------------------------------------------------
verificar_docker() {
  if ! command -v docker >/dev/null 2>&1; then
    erro "Docker não encontrado. Instale: https://docs.docker.com/get-docker/"
    exit 1
  fi
  if ! docker compose version >/dev/null 2>&1; then
    erro "Docker Compose v2 não encontrado (plugin 'docker compose')."
    exit 1
  fi

  local contexto
  contexto="$(docker context show 2>/dev/null || echo "?")"
  if [ "$contexto" != "default" ]; then
    warn "Contexto Docker ativo: '$contexto' (esperado: 'default')."
    warn "Se aparecer erro de porta em uso, rode: docker context use default"
  fi
}

verificar_env() {
  if [ ! -f .env ]; then
    warn ".env não encontrado — copiando do .env.example"
    cp .env.example .env
    erro "Preencha as variáveis em $DIR/.env (banco, JWT e admin) e rode de novo."
    exit 1
  fi
  if grep -qE '^(JWT_KEY|ADMIN_PASS|POSTGRESDB_PASS)=$' .env; then
    warn "Existem variáveis vazias no .env — verifique JWT_KEY, ADMIN_PASS e POSTGRESDB_PASS."
  fi
}

# ------------------------------------------------------------
# Espera todos os serviços ficarem 'healthy'
# ------------------------------------------------------------
esperar_healthy() {
  local timeout="${1:-180}" t=0
  info "Aguardando os serviços ficarem prontos (máx. ${timeout}s)..."
  while [ "$t" -lt "$timeout" ]; do
    local todos_sim=1
    for s in "${SERVICOS[@]}"; do
      if [ "$(estado_de "$s")" != "healthy" ]; then
        todos_sim=0
      fi
    done
    if [ "$todos_sim" -eq 1 ]; then
    if [ "$t" -gt 0 ]; then printf '\n'; fi  # finaliza a linha de progresso (\r)
    ok "Todos os serviços estão healthy."
    return 0
    fi
    sleep 5
    t=$((t + 5))
    printf '  ...%ss  postgres=%s backend=%s frontend=%s\r' "$t" \
      "$(estado_de postgres)" "$(estado_de backend)" "$(estado_de frontend)"
  done
  printf '\n'
  warn "Tempo esgotado. Veja os logs: ./run.sh logs"
  return 1
}

estado_de() {
  # $1 = nome do SERVIÇO no docker-compose (postgres, backend, frontend)
  local cid
  cid="$(docker compose ps -q "$1" 2>/dev/null | head -n1)"
  if [ -z "$cid" ]; then
    echo "ausente"
  else
    docker inspect --format '{{.State.Health.Status}}' "$cid" 2>/dev/null || echo "iniciando"
  fi
}

# ------------------------------------------------------------
# Comandos
# ------------------------------------------------------------
cmd_up() {
  verificar_env
  info "Subindo banco + backend + frontend..."
  docker compose up -d --build
  esperar_healthy 240 || true
  resumo
}

cmd_build() {
  info "Reconstruindo as imagens..."
  docker compose build
  ok "Imagens reconstruídas."
}

cmd_down() {
  info "Parando os serviços (o volume do banco é mantido)..."
  docker compose down
  ok "Stack parada. Dados do banco preservados."
}

cmd_restart() {
  cmd_down
  cmd_up
}

cmd_status() {
  printf '%s\n' "${C_BOLD}Status dos serviços${C_RESET}"
  docker compose ps --format "table {{.Name}}\t{{.Status}}\t{{.Ports}}" || true
  printf '\n%s\n' "${C_BOLD}Health${C_RESET}"
  for s in "${SERVICOS[@]}"; do
    printf '  %-9s %s\n' "$s" "$(estado_de "$s")"
  done
}

cmd_logs() {
  docker compose logs -f --tail=200 "$@"
}

cmd_clean() {
  printf '%s\n' "${C_YELLOW}Isso vai APAGAR os containers e TODOS OS DADOS do banco.${C_RESET}"
  read -r -p "Digite 'sim' para confirmar: " resposta
  if [ "$resposta" = "sim" ]; then
    docker compose down -v
    ok "Stack e volume do banco removidos."
  else
    info "Cancelado."
  fi
}

# Modo desenvolvimento: só o banco vai pro Docker; backend e frontend
# rodam na máquina com hot-reload (recompila a cada salvamento).
cmd_dev() {
  verificar_env
  info "Subindo apenas o banco (postgres)..."
  docker compose up -d postgres

  command -v java  >/dev/null 2>&1 || { erro "Java 21 não encontrado no PATH."; exit 1; }
  command -v pnpm  >/dev/null 2>&1 || { erro "pnpm não encontrado (npm i -g pnpm)."; exit 1; }

  info "Iniciando backend (./mvnw spring-boot:run)..."
  ( cd backend/PaoDaVidaApplication && ./mvnw spring-boot:run ) &
  PID_BACK=$!

  info "Iniciando frontend (pnpm dev)..."
  ( cd frontend && pnpm dev ) &
  PID_FRONT=$!

  # Encerra os dois filhos quando você der Ctrl+C
  trap 'info "Encerrando..."; kill "$PID_BACK" "$PID_FRONT" 2>/dev/null || true; exit 0' INT TERM

  echo
  ok "Backend: $API_URL/swagger-ui.html"
  ok "Frontend: $APP_URL"
  info "Logs abaixo (Ctrl+C para encerrar tudo):"
  wait
}

resumo() {
  printf '\n%s\n' "${C_BOLD}${C_GREEN}Stack pronta!${C_RESET}"
  printf '  %-9s %s\n' "App"      "$APP_URL"
  printf '  %-9s %s\n' "API"      "$API_URL/swagger-ui.html"
  printf '  %-9s %s\n' "Status"   "./run.sh status"
  printf '  %-9s %s\n' "Logs"     "./run.sh logs [postgres|backend|frontend]"
  printf '  %-9s %s\n' "Parar"    "./run.sh down"
  printf '\n%s\n' "Credenciais do admin: variáveis ADMIN_EMAIL / ADMIN_PASS do .env"
}

cmd_help() {
  cat <<EOF
${C_BOLD}run.sh${C_RESET} — Pão da Vida Control

  ${C_CYAN}./run.sh${C_RESET}            Sobe tudo (banco + backend + frontend) e espera ficar healthy
  ./run.sh ${C_CYAN}status${C_RESET}      Mostra portas e saúde de cada serviço
  ./run.sh ${C_CYAN}logs${C_RESET} [sv]    Logs em tempo real (ex.: ./run.sh logs backend)
  ./run.sh ${C_CYAN}build${C_RESET}        Reconstrói as imagens Docker
  ./run.sh ${C_CYAN}restart${C_RESET}      Para e sobe de novo
  ./run.sh ${C_CYAN}down${C_RESET}         Para tudo (mantém os dados do banco)
  ./run.sh ${C_CYAN}dev${C_RESET}          Modo dev: só o banco no Docker; backend/frontend na máquina
  ./run.sh ${C_CYAN}clean${C_RESET}        APAGA containers e dados do banco (pede confirmação)
  ./run.sh ${C_CYAN}help${C_RESET}         Esta ajuda
EOF
}

# ------------------------------------------------------------
# main
# ------------------------------------------------------------
comando="${1:-up}"
shift || true

case "$comando" in
  up)      verificar_docker; cmd_up ;;
  build)   verificar_docker; cmd_build ;;
  down)    verificar_docker; cmd_down ;;
  restart) verificar_docker; cmd_restart ;;
  status)  verificar_docker; cmd_status ;;
  logs)    verificar_docker; cmd_logs "$@" ;;
  dev)     verificar_docker; cmd_dev ;;
  clean)   verificar_docker; cmd_clean ;;
  help|-h|--help) cmd_help ;;
  *) erro "Comando desconhecido: '$comando'"; cmd_help; exit 1 ;;
esac
