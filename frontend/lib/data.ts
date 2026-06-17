export type Category = {
  id: number
  nome: string
  descricao: string
  totalProdutos: number
  criadoEm: string
}

export type Product = {
  id: number
  nome: string
  categoriaId: number
  categoriaNome: string
  unidade: string
  precoVenda: number
  estoque: number
  estoqueMinimo: number
  criadoEm: string
}

export type StockEntry = {
  id: number
  produtoId: number
  produtoNome: string
  quantidade: number
  data: string
  observacao: string
  responsavel: string
}

export type StockExit = {
  id: number
  produtoId: number
  produtoNome: string
  quantidade: number
  valorUnitario: number
  valorTotal: number
  data: string
  observacao: string
  responsavel: string
}

export const categories: Category[] = [
  { id: 1, nome: 'Pães', descricao: 'Pães artesanais e tradicionais', totalProdutos: 8, criadoEm: '2024-01-10' },
  { id: 2, nome: 'Bolos', descricao: 'Bolos decorados e simples', totalProdutos: 5, criadoEm: '2024-01-10' },
  { id: 3, nome: 'Salgados', descricao: 'Salgados assados e fritos', totalProdutos: 12, criadoEm: '2024-01-15' },
  { id: 4, nome: 'Doces', descricao: 'Doces e confeitaria fina', totalProdutos: 7, criadoEm: '2024-01-20' },
  { id: 5, nome: 'Biscoitos', descricao: 'Biscoitos e cookies artesanais', totalProdutos: 6, criadoEm: '2024-02-01' },
  { id: 6, nome: 'Tortas', descricao: 'Tortas doces e salgadas', totalProdutos: 4, criadoEm: '2024-02-05' },
]

export const products: Product[] = [
  { id: 1, nome: 'Pão Francês', categoriaId: 1, categoriaNome: 'Pães', unidade: 'unid', precoVenda: 0.75, estoque: 120, estoqueMinimo: 50, criadoEm: '2024-01-10' },
  { id: 2, nome: 'Pão de Forma', categoriaId: 1, categoriaNome: 'Pães', unidade: 'unid', precoVenda: 8.90, estoque: 18, estoqueMinimo: 10, criadoEm: '2024-01-10' },
  { id: 3, nome: 'Pão de Queijo', categoriaId: 1, categoriaNome: 'Pães', unidade: 'unid', precoVenda: 2.50, estoque: 45, estoqueMinimo: 30, criadoEm: '2024-01-12' },
  { id: 4, nome: 'Croissant', categoriaId: 1, categoriaNome: 'Pães', unidade: 'unid', precoVenda: 5.50, estoque: 8, estoqueMinimo: 15, criadoEm: '2024-01-15' },
  { id: 5, nome: 'Bolo de Cenoura', categoriaId: 2, categoriaNome: 'Bolos', unidade: 'fatia', precoVenda: 6.00, estoque: 24, estoqueMinimo: 10, criadoEm: '2024-01-10' },
  { id: 6, nome: 'Bolo de Chocolate', categoriaId: 2, categoriaNome: 'Bolos', unidade: 'fatia', precoVenda: 7.00, estoque: 32, estoqueMinimo: 10, criadoEm: '2024-01-10' },
  { id: 7, nome: 'Coxinha', categoriaId: 3, categoriaNome: 'Salgados', unidade: 'unid', precoVenda: 4.50, estoque: 60, estoqueMinimo: 40, criadoEm: '2024-01-15' },
  { id: 8, nome: 'Esfiha', categoriaId: 3, categoriaNome: 'Salgados', unidade: 'unid', precoVenda: 3.50, estoque: 5, estoqueMinimo: 20, criadoEm: '2024-01-15' },
  { id: 9, nome: 'Pastel de Forno', categoriaId: 3, categoriaNome: 'Salgados', unidade: 'unid', precoVenda: 4.00, estoque: 38, estoqueMinimo: 20, criadoEm: '2024-01-20' },
  { id: 10, nome: 'Brigadeiro', categoriaId: 4, categoriaNome: 'Doces', unidade: 'unid', precoVenda: 2.50, estoque: 80, estoqueMinimo: 30, criadoEm: '2024-01-20' },
  { id: 11, nome: 'Cookie de Baunilha', categoriaId: 5, categoriaNome: 'Biscoitos', unidade: 'unid', precoVenda: 3.00, estoque: 55, estoqueMinimo: 20, criadoEm: '2024-02-01' },
  { id: 12, nome: 'Torta de Limão', categoriaId: 6, categoriaNome: 'Tortas', unidade: 'fatia', precoVenda: 8.50, estoque: 12, estoqueMinimo: 8, criadoEm: '2024-02-05' },
]

export const stockEntries: StockEntry[] = [
  { id: 1, produtoId: 1, produtoNome: 'Pão Francês', quantidade: 200, data: '2024-06-16T06:30:00', observacao: 'Produção matinal', responsavel: 'Carlos Silva' },
  { id: 2, produtoId: 3, produtoNome: 'Pão de Queijo', quantidade: 80, data: '2024-06-16T07:00:00', observacao: 'Produção matinal', responsavel: 'Carlos Silva' },
  { id: 3, produtoId: 7, produtoNome: 'Coxinha', quantidade: 120, data: '2024-06-16T07:30:00', observacao: 'Produção do dia', responsavel: 'Ana Lima' },
  { id: 4, produtoId: 5, produtoNome: 'Bolo de Cenoura', quantidade: 40, data: '2024-06-15T08:00:00', observacao: 'Produção vespertina', responsavel: 'Ana Lima' },
  { id: 5, produtoId: 10, produtoNome: 'Brigadeiro', quantidade: 100, data: '2024-06-15T09:00:00', observacao: 'Confeitaria', responsavel: 'Maria Santos' },
  { id: 6, produtoId: 6, produtoNome: 'Bolo de Chocolate', quantidade: 48, data: '2024-06-14T08:30:00', observacao: 'Produção semanal', responsavel: 'Ana Lima' },
  { id: 7, produtoId: 2, produtoNome: 'Pão de Forma', quantidade: 30, data: '2024-06-14T06:45:00', observacao: 'Produção matinal', responsavel: 'Carlos Silva' },
  { id: 8, produtoId: 11, produtoNome: 'Cookie de Baunilha', quantidade: 60, data: '2024-06-13T10:00:00', observacao: 'Confeitaria', responsavel: 'Maria Santos' },
]

export const stockExits: StockExit[] = [
  { id: 1, produtoId: 1, produtoNome: 'Pão Francês', quantidade: 80, valorUnitario: 0.75, valorTotal: 60.00, data: '2024-06-16T08:00:00', observacao: 'Venda balcão', responsavel: 'João Pereira' },
  { id: 2, produtoId: 7, produtoNome: 'Coxinha', quantidade: 60, valorUnitario: 4.50, valorTotal: 270.00, data: '2024-06-16T08:30:00', observacao: 'Venda balcão', responsavel: 'João Pereira' },
  { id: 3, produtoId: 3, produtoNome: 'Pão de Queijo', quantidade: 35, valorUnitario: 2.50, valorTotal: 87.50, data: '2024-06-16T09:00:00', observacao: 'Venda balcão', responsavel: 'Luísa Andrade' },
  { id: 4, produtoId: 5, produtoNome: 'Bolo de Cenoura', quantidade: 16, valorUnitario: 6.00, valorTotal: 96.00, data: '2024-06-15T10:00:00', observacao: 'Venda balcão', responsavel: 'Luísa Andrade' },
  { id: 5, produtoId: 10, produtoNome: 'Brigadeiro', quantidade: 20, valorUnitario: 2.50, valorTotal: 50.00, data: '2024-06-15T11:00:00', observacao: 'Venda balcão', responsavel: 'João Pereira' },
  { id: 6, produtoId: 6, produtoNome: 'Bolo de Chocolate', quantidade: 16, valorUnitario: 7.00, valorTotal: 112.00, data: '2024-06-14T09:30:00', observacao: 'Encomenda', responsavel: 'Luísa Andrade' },
  { id: 7, produtoId: 11, produtoNome: 'Cookie de Baunilha', quantidade: 5, valorUnitario: 3.00, valorTotal: 15.00, data: '2024-06-13T14:00:00', observacao: 'Venda balcão', responsavel: 'João Pereira' },
  { id: 8, produtoId: 2, produtoNome: 'Pão de Forma', quantidade: 12, valorUnitario: 8.90, valorTotal: 106.80, data: '2024-06-13T10:30:00', observacao: 'Venda balcão', responsavel: 'Luísa Andrade' },
]

export const dailyProduction = [
  { dia: '10/06', producao: 320, vendas: 280 },
  { dia: '11/06', producao: 410, vendas: 370 },
  { dia: '12/06', producao: 290, vendas: 260 },
  { dia: '13/06', producao: 480, vendas: 420 },
  { dia: '14/06', producao: 350, vendas: 310 },
  { dia: '15/06', producao: 440, vendas: 395 },
  { dia: '16/06', producao: 400, vendas: 143 },
]

export const monthlyProduction = [
  { mes: 'Jan', producao: 8900, vendas: 7800 },
  { mes: 'Fev', producao: 9200, vendas: 8500 },
  { mes: 'Mar', producao: 10100, vendas: 9300 },
  { mes: 'Abr', producao: 9800, vendas: 8900 },
  { mes: 'Mai', producao: 11200, vendas: 10200 },
  { mes: 'Jun', producao: 9100, vendas: 8200 },
]

export const revenueDailyData = [
  { dia: '10/06', receita: 720.50 },
  { dia: '11/06', receita: 890.00 },
  { dia: '12/06', receita: 540.00 },
  { dia: '13/06', receita: 1020.00 },
  { dia: '14/06', receita: 780.00 },
  { dia: '15/06', receita: 920.00 },
  { dia: '16/06', receita: 597.30 },
]

export const categoryDistribution = [
  { categoria: 'Pães', quantidade: 450 },
  { categoria: 'Salgados', quantidade: 280 },
  { categoria: 'Bolos', quantidade: 190 },
  { categoria: 'Doces', quantidade: 120 },
  { categoria: 'Biscoitos', quantidade: 85 },
  { categoria: 'Tortas', quantidade: 55 },
]

export type UserRole = 'Administrador' | 'Gerente' | 'Operador' | 'Vendedor'
export type UserStatus = 'Ativo' | 'Inativo'

export type User = {
  id: number
  nome: string
  email: string
  cargo: UserRole
  setor: string
  status: UserStatus
  ultimoAcesso: string
  criadoEm: string
  avatar: string
}

export const users: User[] = [
  {
    id: 1,
    nome: 'Carlos Silva',
    email: 'carlos.silva@padaria.com',
    cargo: 'Administrador',
    setor: 'Gestão',
    status: 'Ativo',
    ultimoAcesso: '2024-06-16T08:45:00',
    criadoEm: '2024-01-10',
    avatar: 'CS',
  },
  {
    id: 2,
    nome: 'Ana Lima',
    email: 'ana.lima@padaria.com',
    cargo: 'Gerente',
    setor: 'Produção',
    status: 'Ativo',
    ultimoAcesso: '2024-06-16T07:30:00',
    criadoEm: '2024-01-10',
    avatar: 'AL',
  },
  {
    id: 3,
    nome: 'Maria Santos',
    email: 'maria.santos@padaria.com',
    cargo: 'Operador',
    setor: 'Confeitaria',
    status: 'Ativo',
    ultimoAcesso: '2024-06-15T16:20:00',
    criadoEm: '2024-01-20',
    avatar: 'MS',
  },
  {
    id: 4,
    nome: 'João Pereira',
    email: 'joao.pereira@padaria.com',
    cargo: 'Vendedor',
    setor: 'Vendas',
    status: 'Ativo',
    ultimoAcesso: '2024-06-16T09:10:00',
    criadoEm: '2024-02-01',
    avatar: 'JP',
  },
  {
    id: 5,
    nome: 'Luísa Andrade',
    email: 'luisa.andrade@padaria.com',
    cargo: 'Vendedor',
    setor: 'Vendas',
    status: 'Ativo',
    ultimoAcesso: '2024-06-16T08:00:00',
    criadoEm: '2024-02-05',
    avatar: 'LA',
  },
  {
    id: 6,
    nome: 'Roberto Costa',
    email: 'roberto.costa@padaria.com',
    cargo: 'Operador',
    setor: 'Produção',
    status: 'Inativo',
    ultimoAcesso: '2024-05-30T11:00:00',
    criadoEm: '2024-03-01',
    avatar: 'RC',
  },
]
