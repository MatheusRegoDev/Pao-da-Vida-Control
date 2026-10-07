// ==========================================
// ENUMS DO BACKEND
// ==========================================

export type UnidadeMedida =
  | "UNIDADE"
  | "KG"
  | "L"
  | "ML"
  | "FATIA"
  | "DUZIA"
  | "CAIXA"
  | "BANDEJA"

export const UNIDADE_LABELS: Record<UnidadeMedida, string> = {
  UNIDADE: "Unidade (unid)",
  KG: "Quilograma (kg)",
  L: "Litro (L)",
  ML: "Mililitro (mL)",
  FATIA: "Fatia",
  DUZIA: "Dúzia",
  CAIXA: "Caixa",
  BANDEJA: "Bandeja",
}

export type CargoUsuario =
  | "ADMINISTRADOR"
  | "GERENTE"
  | "OPERADOR"
  | "VENDEDOR"

export const CARGO_LABELS: Record<CargoUsuario, string> = {
  ADMINISTRADOR: "Administrador",
  GERENTE: "Gerente",
  OPERADOR: "Operador",
  VENDEDOR: "Vendedor",
}

export type SetorUsuario =
  | "GESTAO"
  | "PRODUCAO"
  | "CONFEITARIA"
  | "VENDAS"
  | "FINANCEIRO"
  | "ESTOQUE"

export const SETOR_LABELS: Record<SetorUsuario, string> = {
  GESTAO: "Gestão",
  PRODUCAO: "Produção",
  CONFEITARIA: "Confeitaria",
  VENDAS: "Vendas",
  FINANCEIRO: "Financeiro",
  ESTOQUE: "Estoque",
}

// ==========================================
// PAGINAÇÃO SPRING DATA (Page<T>)
// ==========================================

export type Page<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  number: number // índice da página (começa em 0 no Spring)
  size: number
  first: boolean
  last: boolean
  empty: boolean
}

// ==========================================
// AUTH DTOs
// ==========================================

export type LoginRequestDto = {
  email: string
  senha: string
}

export type TokenResponseDto = {
  token: string
  expiresIn: number
}

export type UsuarioLogadoResposeDto = {
  id: string // UUID em string
  nome: string
  email: string
  cargoUsuario: CargoUsuario
}

// ==========================================
// PRODUTOS
// ==========================================

export type ProdutoResponseDto = {
  id: number
  nome: string
  categoriaId: number
  categoriaNome: string
  unidade: UnidadeMedida
  preco: number
  estoque: number
  estoqueMinimo: number
  dataCriacao: string // Instant em formato ISO
}

export type ProdutoRequestDto = {
  nome: string
  categoriaId: number
  unidade: UnidadeMedida
  preco: number
  estoque: number
  estoqueMinimo: number
}

export type ProdutoEstatisticaDto = {
  totalProdutos: number
  categoriasAtivas: number
  valorTotalEstoque: number
  estoqueCritico: number
}

// ==========================================
// CATEGORIAS
// ==========================================

export type CategoriaResponseDto = {
  id: number
  nome: string
  descricao: string
  totalProdutos: number
  possuiProdutos: boolean
  dataCriacao: string
}

export type CategoriaRequestDto = {
  nome: string
  descricao: string
}

export type CategoriaEstatisticaDto = {
  totalCategorias: number
  totalProdutos: number
  maiorCategoria: string
  ultimaCategoriaAdicionada: string
}

// ==========================================
// ENTRADAS
// ==========================================

export type EntradaResponseDto = {
  id: number
  produtoId: number
  produtoNome: string
  quantidade: number
  responsavelId: string
  responsavelNome: string
  observacao: string
  dataCriacao: string
}

export type EntradaRequestDto = {
  produtoId: number
  quantidade: number
  observacao?: string
}

export type EntradaEstatisticaDto = {
  unidadesHoje: number
  registrosHoje: number
  unidadesNoMes: number
  totalRegistros: number
}

// ==========================================
// SAÍDAS
// ==========================================

export type SaidaResponseDto = {
  id: number
  produtoId: number
  produtoNome: string
  quantidade: number
  valorUnitario: number
  valorTotal: number
  responsavelNome: string
  observacao: string
  dataCriacao: string
}

export type SaidaRequestDto = {
  produtoId: number
  quantidade: number
  observacao?: string
}

export type SaidaEstatisticaDto = {
  receitaHoje: number
  unidadesVendidasHoje: number
  receitaMes: number
  ticketMedio: number
  totalVendas: number
}

// ==========================================
// USUÁRIOS
// ==========================================

export type UsuarioResponseDto = {
  id: string
  nome: string
  email: string
  cargoUsuario: CargoUsuario
  setor: SetorUsuario
  status: boolean // true = ativo, false = inativo
  ultimoAcesso: string | null
  dataCriacao: string
}

export type UsuariosRequestDto = {
  nome: string
  email: string
  senha: string
  cargoUsuario: CargoUsuario
  setor: SetorUsuario
  status: boolean
}

export type UsuarioUpdateDto = {
  nome: string
  email: string
  cargoUsuario: CargoUsuario
  setor: SetorUsuario
  status: boolean
}

export type UsuarioRedefinirSenhaDto = {
  novaSenha: string
}

export type UsuarioRequestNovoStatus = {
  novoStatus: boolean
}

export type UsuarioEstatisticaDto = {
  totalUsuarios: number
  usuariosAtivos: number
  usuariosInativos: number
  administradores: number
}

// ==========================================
// DASHBOARD & RELATÓRIOS
// ==========================================

export type ResumoDto = {
  totalProdutos: number
  estoqueTotal: number
  producaoHoje: number
  vendasHoje: number
  receitaHoje: number
  estoqueCritico: number
}

export type EstoqueTotalDto = {
  totalUnidades: number
}

export type RelatorioResumoDto = {
  producaoPeriodo: number
  vendaPeriodo: number
  receitaPeriodo: number
  aproveitamentoPercentual: number
}

export type PeriodoRelatorio = "DIARIO" | "SEMANAL" | "MENSAL"

export type ProducaoVendasPontoDto = {
  label: string
  producao: number
  vendas: number
}

export type ReceitaPontoDto = {
  label: string
  receita: number
}

export type RelatorioGraficoDto = {
  producaoVendas: ProducaoVendasPontoDto[]
  receita: ReceitaPontoDto[]
}

export type CategoriaVendaDto = {
  categoria: string
  quantidade: number
  percentual: number
}

export type TopProdutosDto = {
  produto: string
  categoria: string
  vendas: number
  receita: number
}