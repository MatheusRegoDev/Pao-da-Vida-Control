# Arquitetura do Sistema - Pão da Vida Control

Este documento detalha a arquitetura do projeto **Pão da Vida Control**, abordando a estrutura do frontend, backend e o fluxo de dados.

---

## 1. Visão Geral

O sistema segue uma arquitetura cliente-servidor tradicional e moderna, focada em fornecer uma experiência de usuário responsiva e dados consolidados em tempo real. A arquitetura é dividida em:
- **Frontend (SPA/SSR):** Interface web desenvolvida em React utilizando o framework Next.js.
- **Backend (API REST):** Aplicação em Java com Spring Boot que fornece as regras de negócio e endpoints seguros.
- **Banco de Dados:** Banco relacional (PostgreSQL em produção e H2 para ambiente de desenvolvimento).

---

## 2. Arquitetura do Frontend

O frontend foi construído priorizando componentização, tipagem rigorosa e estilização utilitária.

### 2.1. Stack Tecnológica
- **Next.js (React):** Framework para roteamento (App Router), renderização otimizada e estruturação de páginas.
- **TypeScript:** Utilizado para tipagem estática e segurança do código, garantindo que o fluxo de dados do backend seja corretamente interpretado (modelos definidos na pasta `lib`).
- **Tailwind CSS:** Framework utilitário de CSS que permite uma estilização rápida, responsiva e padronizada.
- **shadcn/ui & Base UI:** Coleções de componentes de interface focados em acessibilidade, que foram incorporados e ajustados ao design do projeto.
- **Recharts:** Biblioteca baseada em React para a plotagem dos gráficos nos dashboards de relatórios e indicativos.

### 2.2. Estrutura de Diretórios
- `/app`: Diretório principal do Next.js App Router, contendo páginas e layouts organizados por módulo (ex: `/categorias`, `/produtos`, `/entradas`, `/saidas`, `/relatorios`, `/usuarios`).
- `/components`: Componentes reutilizáveis de interface (botões, modais, cabeçalhos, formulários de cadastro).
- `/lib`: Utilitários, funções de formatação e definição dos tipos, modelos de dados e dados "mockados" temporários (`data.ts`).
- `/hooks`: Custom hooks do React para abstrair lógicas de componente (se aplicável).

### 2.3. Fluxo de Dados no Client-side
Atualmente em fase de prototipação, a aplicação se apoia em um repositório central temporário de dados simulados (mocks) situados na `lib/data.ts`. Quando integrado, o frontend efetuará chamadas HTTP (usando `fetch` nativo ou bibliotecas como Axios) aos endpoints da API do Spring Boot.

---

## 3. Arquitetura do Backend (API)

O backend do Pão da Vida Control está sendo desenvolvido segundo os preceitos da Arquitetura em Camadas (Layered Architecture).

### 3.1. Stack Tecnológica
- **Java 21:** Versão LTS da linguagem.
- **Spring Boot 3.x:** Base robusta e produtiva do ecossistema Spring para construção da API RESTful.
- **Spring Security & JWT (Json Web Token):** Mecanismos encarregados pela segurança, autenticação de usuários e controle de acesso baseado nas roles (cargos) configuradas (`Administrador`, `Gerente`, etc).
- **Spring Data JPA (Hibernate):** Responsável por abstrair e simplificar a comunicação com o banco de dados.

### 3.2. Estrutura em Camadas
1. **Controllers (Apresentação API):** Recebem as requisições HTTP do frontend, expõem as rotas REST, processam as requisições interpretando payloads com `DTOs` e retornam respostas e status HTTP pertinentes.
2. **Services (Regras de Negócio):** Onde reside a lógica central do sistema (ex: checar se há saldo de estoque suficiente para permitir uma venda/saída).
3. **Repositories (Acesso a Dados):** Interfaces Spring Data encarregadas de persistir ou extrair informações de entidades no PostgreSQL.
4. **Entities (Domínio):** Modelos anotados (ex: `@Entity`) representando diretamente as tabelas do banco de dados (refletindo classes como `Produto`, `Entrada`, `Saida` e `Usuario`).

---

## 4. Banco de Dados e Modelo de Domínio

A base de dados é inteiramente relacional. O sistema separa rigorosamente as **Entradas** (produção) das **Saídas** (vendas) em entidades e tabelas independentes para evitar conflitos, gerar histórico auditável e garantir precisão nos relatórios. O estoque atual de cada `Produto` é atualizado na medida em que esses registros de fluxo acontecem.

*(Para o detalhamento das tabelas e do modelo lógico de banco, consulte o [Diagrama de Classes](docs/diagrama-classe.md))*

---

## 5. Deploy e Infraestrutura

Para facilitação e garantia de uniformidade dos ambientes (desenvolvimento vs produção):
- **Docker & Docker Compose:** Todo o serviço de API e o banco de dados estão roteirizados em containers Docker. Isso possibilita rodar o ambiente com apenas um comando.
- O Frontend Next.js está otimizado e preparado para ser alocado em CDNs globais com escalabilidade serverless como a plataforma **Vercel**.
- A API Spring Boot residirá em uma cloud (ex: AWS, Railway, Render) operando continuamente para prover a ponte com a base de dados PostgreSQL.
