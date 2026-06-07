
# Pão da Vida Control

> Sistema de Controle de Estoque e Vendas

---

![Logo](<img width="600" height="480" alt="logo-pão-da-vida-control" src="https://github.com/user-attachments/assets/35a1ec83-ca02-42b8-a7ce-c42284c0bd1a" />)

---
## Visão geral


O **Pão da vida Control** é um sistema web de gestão de estoque para padarias. O sistema permite cadastrar categorias e produtos, registrar a produção diária como entradas de estoque e as vendas como saídas, mantendo o saldo atualizado em tempo real. Um painel central exibe os principais indicadores do dia — unidades produzidas, vendidas, produtos ativos e alertas de estoque crítico — além de um gráfico e o ranking dos itens mais produzidos. A seção de relatórios oferece visões de produção e vendas agrupadas por dia, por mês e por categoria.

---
## Status do Projeto

![Badge em Desenvolvimento](https://img.shields.io/badge/Status-Em%20Desenvolvimento-orange?style=for-the-badge)
![Badge Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot%203.x-brightgreen?style=for-the-badge)

Atualmente, o **Pão da Vida Control** encontra-se na fase de **desenvolvimento das regras de negócio centrais e integração dos fluxos**. A arquitetura da API e o modelo de dados (entidades, mapeamento relacional e controle de acesso RBAC) já foram totalmente estruturados. 

---
## Funcionalidades do Sistema

### Painel
- Indicadores do dia: unidades produzidas, unidades vendidas, produtos ativos e itens com estoque crítico.
- Gráfico de produção vs. vendas dos últimos 14 dias.
- Ranking dos produtos mais produzidos no dia.
- Feed das últimas movimentações com sinal positivo (entrada) e negativo (saída).

### Categorias
- Cadastro, edição e remoção de categorias.
- Visualização da quantidade de produtos por categoria.

### Produtos
- Cadastro, edição e remoção de produtos.
- Busca por nome e filtro por categoria.
- Alerta visual quando o estoque está abaixo do mínimo definido.

### Entradas — Produção
- Registro de itens produzidos com incremento automático do estoque.
- Histórico de entradas com data, produto, quantidade e observação.
- Totalizadores: quantidade registrada, número de lançamentos e produção do dia.

### Saídas — Vendas
- Registro de vendas com decremento automático do estoque.
- Validação de saldo antes de confirmar a saída.
- Histórico de saídas com os mesmos totalizadores da tela de entradas.

### Relatórios
- Produção diária e vendas por dia em gráfico de barras.
- Produção e vendas por mês em gráfico de linha.
- Distribuição do estoque por categoria em gráfico de rosca.


## Tecnologias e Stack Utilizada

### Backend
- **Java 21** — versão LTS com suporte a records, sealed classes e virtual threads.
- **Spring Boot 3.x** — framework principal para criação da API REST.
-  **Spring Security & JWT (Json Web Token):** Mecanismos para autenticação de usuários e controle de acesso baseado em perfis.
- **Spring Data JPA + Hibernate** — mapeamento objeto-relacional e acesso ao banco de dados.
- **Spring Validation** — validação dos dados de entrada nas requisições.
- **PostgreSQL** — banco de dados relacional em produção.
- **H2** — banco em memória para ambiente de desenvolvimento e testes.
- **Lombok** — redução de boilerplate nas entidades e DTOs.

### Frontend
- **React** — biblioteca para construção da interface.
- **TypeScript** — tipagem estática no frontend.
- **Tailwind CSS** — estilização utilitária dos componentes.
- **Recharts** — gráficos de barras, linha e rosca nos relatórios.
- **Lovable** — plataforma utilizada para geração e prototipação da interface.

### Ferramentas
- **Maven** — gerenciamento de dependências e build do projeto.
- **Git** — controle de versão.
- **Conventional Commits** — padronização das mensagens de commit.
- **Docker:** Utilizado para a conteinerização e isolamento do ambiente de banco de dados e serviços locais, facilitando o deploy.

## Autor

- [@MatheusRegoDev](https://www.github.com/MatheusRegoDev)

