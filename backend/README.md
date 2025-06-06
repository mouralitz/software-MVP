# ArteCraft Backend API (MVP)

Este é o backend para a plataforma ArteCraft, desenvolvido com foco no Mínimo Produto Viável (MVP) conforme as especificações MoSCoW definidas (cadastro e listagem).

## Contexto

O backend foi criado para suportar as funcionalidades essenciais observadas no frontend `https://softwaremvp.vercel.app/` (e no código fornecido em `agile-mvp-frontend.zip`), permitindo o registo e login de utilizadores (clientes e artesãos) e o cadastro e listagem de produtos artesanais.

**Nota Importante sobre o Frontend:** A análise do código frontend fornecido (`agile-mvp-frontend.zip`) revelou que, na sua versão atual, ele utiliza **dados estáticos (hardcoded)** para exibir informações como produtos e categorias. **Não foram encontradas chamadas reais a esta API backend** (ex: `fetch`, `axios`). Portanto, para que o frontend funcione dinamicamente com este backend, será necessário **modificar o código frontend** para realizar as chamadas aos endpoints descritos abaixo.

## Tecnologias Utilizadas

*   **Node.js:** Ambiente de execução JavaScript.
*   **Express:** Framework web para Node.js.
*   **MongoDB:** Base de dados NoSQL para armazenamento de dados.
*   **Mongoose:** ODM (Object Data Modeling) para MongoDB e Node.js.
*   **bcrypt:** Biblioteca para hashing de senhas.
*   **jsonwebtoken (JWT):** Para criação e verificação de tokens de autenticação.
*   **dotenv:** Para gestão de variáveis de ambiente.
*   **cors:** Para habilitar Cross-Origin Resource Sharing.

## Estrutura do Projeto

```
artecraft-backend/
├── api/
│   ├── config/       # Configuração (ex: db.js)
│   ├── controllers/  # Lógica de negócio (user.controller.js, product.controller.js)
│   ├── middleware/   # Middlewares (ex: auth.middleware.js)
│   ├── models/       # Schemas Mongoose (User.js, Product.js)
│   └── routes/       # Definição das rotas da API (user.route.js, product.route.js)
├── .env              # Ficheiro para variáveis de ambiente (NÃO versionar)
├── index.js          # Ponto de entrada da aplicação Express
├── package.json      # Metadados do projeto e dependências
└── README.md         # Este ficheiro
```

## Funcionalidades Implementadas (MVP)

*   **Autenticação:**
    *   Registo de novos utilizadores (clientes ou artesãos).
    *   Login de utilizadores existentes com retorno de token JWT.
*   **Produtos:**
    *   Criação de novos produtos (apenas por utilizadores autenticados como artesãos).
    *   Listagem pública de todos os produtos.

## Endpoints da API (MVP) - Para Integração com Frontend

Estes são os endpoints que o frontend precisará chamar:

*   **Utilizadores (`/api/users`)**
    *   `POST /register`: Regista um novo utilizador.
        *   Body: `{ "username": "string", "email": "string", "password": "string", "isArtisan": boolean (opcional) }`
    *   `POST /login`: Autentica um utilizador.
        *   Body: `{ "username": "string", "password": "string" }`
        *   Resposta: `{ "token": "jwt_token", "userId": "...", "username": "...", "isArtisan": boolean }`
*   **Produtos (`/api/products`)**
    *   `POST /`: Cria um novo produto (Requer token JWT de artesão).
        *   Header: `Authorization: Bearer <token>`
        *   Body: `{ "name": "string", "description": "string", "price": number, "category": "string", "imageUrl": "string" }`
    *   `GET /`: Lista todos os produtos (Acesso público).
        *   Resposta: Array de objetos de produto `[{ _id: "...", name: "...", price: ..., artisan: "...", ... }]`

## Como Configurar e Executar Localmente

1.  **Pré-requisitos:**
    *   Node.js (v14 ou superior) e npm instalados.
    *   MongoDB instalado e a correr localmente (ou uma instância acessível, ex: MongoDB Atlas).
2.  **Clonar/Descarregar:** Obtenha o código deste projeto.
3.  **Instalar Dependências:** Navegue até à pasta `artecraft-backend` no terminal e execute:
    ```bash
    npm install
    ```
4.  **Configurar Variáveis de Ambiente:**
    *   Crie um ficheiro chamado `.env` na raiz do projeto (`artecraft-backend/.env`).
    *   Adicione as seguintes variáveis, ajustando `MONGO_URI` conforme a sua configuração do MongoDB e definindo um `JWT_SECRET` seguro:
        ```dotenv
        # Exemplo para MongoDB local padrão
        MONGO_URI=mongodb://localhost:27017/artecraft_mvp

        # Exemplo para MongoDB Atlas (substitua com a sua connection string)
        # MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/artecraft_mvp?retryWrites=true&w=majority

        # Segredo para JWT (use um valor longo e aleatório em produção)
        JWT_SECRET=coloque_aqui_um_segredo_jwt_muito_seguro

        # Porta para o servidor (opcional, default é 5000)
        PORT=5000
        ```
5.  **Iniciar o Servidor:**
    *   Para desenvolvimento (com reinício automático via nodemon):
        ```bash
        npm run dev
        ```
    *   Para produção:
        ```bash
        npm start
        ```
    O servidor estará a correr em `http://localhost:5000` (ou na porta definida em `.env`).

## Instruções para Integração com o Frontend

Como mencionado, o frontend (`agile-mvp-frontend`) precisa ser modificado para interagir com esta API.

1.  **Configurar URL Base da API:** Defina a URL base do backend (ex: `http://localhost:5000/api`) numa variável de ambiente ou constante no frontend.
2.  **Listagem de Produtos:** No componente `FeaturedProducts.tsx` (ou onde a listagem dinâmica for implementada), utilize `fetch` ou `axios` para chamar `GET /api/products`. Mapeie a resposta (array de produtos) para os `ProductCard`s.
3.  **Autenticação:**
    *   Crie formulários de Registo e Login no frontend.
    *   Ao submeter o formulário de registo, chame `POST /api/users/register` com os dados do utilizador.
    *   Ao submeter o formulário de login, chame `POST /api/users/login`. Guarde o `token` recebido (ex: em `localStorage` ou estado global) para chamadas autenticadas.
4.  **Cadastro de Produto:**
    *   Crie um formulário para cadastro de produtos (acessível apenas a artesãos logados).
    *   Ao submeter, chame `POST /api/products`, incluindo o `token` JWT no cabeçalho `Authorization: Bearer <token>`.

## Validação Realizada no Ambiente de Desenvolvimento

*   O código foi implementado seguindo as definições do MVP.
*   O servidor Node.js/Express inicia corretamente (`npm start` executa e mostra "Server running on port...").
*   **Limitação:** Não foi possível realizar testes funcionais completos dos endpoints neste ambiente, pois não havia uma instância MongoDB disponível para conexão. A mensagem `MongoDB Connection Error: connect ECONNREFUSED` foi observada durante a tentativa de arranque, o que é esperado na ausência da base de dados. **É crucial que execute os testes no seu ambiente local com MongoDB configurado.**

## Próximos Passos (Fora do MVP)

*   Implementar endpoints para obter detalhes de um produto (`GET /api/products/:id`).
*   Implementar endpoints para atualizar (`PUT /api/products/:id`) e apagar (`DELETE /api/products/:id`) produtos (com verificação de permissão do artesão).
*   Adicionar filtros à listagem de produtos (`GET /api/products?category=...`).
*   Implementar funcionalidades de perfil de utilizador/artesão.
*   Adicionar testes automatizados.
*   Melhorar a gestão de erros e validações.

