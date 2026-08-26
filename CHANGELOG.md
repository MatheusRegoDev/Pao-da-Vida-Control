# Changelog

Todas as mudanças notáveis no projeto **Pão da Vida Control** serão documentadas neste arquivo.

O formato é baseado no [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [0.2.0] - 2026-08-24

### Adicionado
- **Backend (Produtos):** Adicionado o fluxo de entradas de produtos.
- **Backend (Segurança):** Configurações de segurança implementadas com Spring Security, incluindo Token Provider, suporte para JWT e OAuth2.
- **Backend (Testes):** Adicionados testes unitários do `UsuarioRepository` e `UsuarioService`.
- **Backend (Categorias):** Implementação completa da entidade de Categoria.
- **Backend (Exceções):** Adicionado o tratamento de exceções.
- **Fullstack:** Adicionado o frontend e modelagem backend completa.
- **Setup:** Modelagem e configuração inicial do projeto.
- **Documentação (Core):** Adicionada a documentação geral do projeto.
- **Documentação do Modelo de Domínio:** Criação do arquivo [diagrama-classe.md](docs/diagrama-classe.md) detalhando todas as entidades centrais do sistema (`Usuario`, `Categoria`, `Produto`, `Movimento`), seus atributos, métodos e regras de relacionamentos/associações.
- **Diagramas de Classes:**
  - Versão em texto dinâmico usando o formato **Mermaid** diretamente no arquivo markdown.
  - Imagem visual renderizada anexada no arquivo [diagrama-classe.png](docs/diagrama-classe.png).
- **Configurações de Workspace:**
  - Arquivo `.gitignore` pré-configurado para projetos Java/Spring Boot e React/Node.
  - Arquivo `.vscode/settings.json` para parametrização do ambiente de desenvolvimento.

### Corrigido
- **Backend:** Aplicadas correções no Backend.

---

## [0.1.0] - 2026-06-15

### Adicionado
- **Setup Inicial:** Inicialização do repositório Git.
- **Documentação Geral:** Arquivo [README.md](README.md) contendo a visão geral do sistema, status do projeto, stack de tecnologias (Java 21, Spring Boot, Spring Security, JWT, React, TypeScript, Tailwind CSS) e as funcionalidades previstas.
- **Licenciamento:** Arquivo `LICENSE` com os termos de licença MIT.
