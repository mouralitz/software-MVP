# ArteCraft - Projeto Integrado (Frontend + Backend MVP)

Este repositório contém o projeto integrado da plataforma ArteCraft, combinando o frontend visual fornecido (`agile-mvp-frontend`) com um backend Node.js/Express desenvolvido para suportar as funcionalidades essenciais do Mínimo Produto Viável (MVP) conforme as especificações MoSCoW (cadastro e listagem).

## Estrutura do Projeto (Monorepo)

O projeto está organizado como um monorepo simples:

```
artecraft-integrated/
├── frontend/         # Código do frontend (React/Vite/TypeScript)
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ... (outros ficheiros de configuração do frontend)
├── backend/          # Código do backend (Node.js/Express/MongoDB)
│   ├── api/
│   ├── .env
│   ├── index.js
│   ├── package.json
│   └── ... (outros ficheiros do backend)
└── README.md         # Este ficheiro
```

## Estado Atual da Integração

*   **Backend:** O backend está completo em termos de funcionalidades MVP:
    *   Registo e Login de Utilizadores (Clientes e Artesãos).
    *   Criação de Produtos (apenas por artesãos autenticados).
    *   Listagem pública de Produtos (com dados do artesão populados).
*   **Frontend:**
    *   **Listagem de Produtos:** O componente `frontend/src/components/FeaturedProducts.tsx` foi **modificado** para buscar e exibir dinamicamente os produtos da API do backend (`GET /api/products`).
    *   **Funcionalidades Pendentes no Frontend:** A análise do código frontend revelou que os componentes e formulários necessários para as seguintes funcionalidades **não estão implementados**:
        *   Registo de Utilizador.
        *   Login de Utilizador.
        *   Cadastro de Produto.
    *   **Interface Estática:** Grande parte da interface restante (Navbar, Sidebar, etc.) ainda opera com lógica estática ou sem interação com o backend.

**Conclusão da Integração:** A listagem de produtos está integrada. Para que o site seja 100% funcional conforme o MVP, é necessário **desenvolver os componentes/páginas/formulários em falta no frontend** e conectá-los aos endpoints correspondentes da API do backend.

## Tecnologias Utilizadas

*   **Frontend:** React, Vite, TypeScript, Tailwind CSS, Shadcn/ui (componentes).
*   **Backend:** Node.js, Express, MongoDB, Mongoose, bcrypt, JWT, dotenv, cors.

## Endpoints da API Backend (MVP)

(O frontend precisa chamar estes endpoints)

*   **Utilizadores (`/api/users`)**
    *   `POST /register`: Regista um novo utilizador.
    *   `POST /login`: Autentica um utilizador.
*   **Produtos (`/api/products`)**
    *   `POST /`: Cria um novo produto (Requer token JWT de artesão).
    *   `GET /`: Lista todos os produtos (Usado pelo `FeaturedProducts.tsx`).

*(Consulte o README dentro da pasta `backend/` para detalhes completos dos endpoints e modelos de dados)*

## Como Configurar e Executar Localmente

1.  **Pré-requisitos:**
    *   Node.js (v14+) e npm.
    *   MongoDB instalado e a correr localmente (ou instância acessível).
2.  **Clonar/Descarregar:** Obtenha o código deste projeto integrado.
3.  **Configurar Backend:**
    *   Navegue até à pasta `backend/`:
        ```bash
        cd artecraft-integrated/backend
        ```
    *   Instale as dependências:
        ```bash
        npm install
        ```
    *   Crie o ficheiro `.env` (conforme instruções no `backend/README.md`), certificando-se que `MONGO_URI` aponta para a sua instância MongoDB e `JWT_SECRET` está definido.
4.  **Configurar Frontend:**
    *   Navegue até à pasta `frontend/`:
        ```bash
        cd ../frontend 
        # ou cd artecraft-integrated/frontend a partir da raiz
        ```
    *   Instale as dependências:
        ```bash
        npm install
        ```
    *   **(Opcional/Recomendado)** Crie um ficheiro `.env` na raiz do frontend (`frontend/.env`) para definir a URL da API:
        ```dotenv
        REACT_APP_API_URL=http://localhost:5000/api
        ```
        (Se não criar, o código usará `http://localhost:5000/api` como padrão).
5.  **Iniciar os Servidores:**
    *   **Terminal 1 (Backend):**
        ```bash
        cd artecraft-integrated/backend
        npm run dev # Ou npm start
        ```
        (Verifique se a conexão com MongoDB foi bem-sucedida).
    *   **Terminal 2 (Frontend):**
        ```bash
        cd artecraft-integrated/frontend
        npm run dev
        ```
6.  **Aceder à Aplicação:** Abra o seu navegador e aceda ao URL fornecido pelo Vite (geralmente `http://localhost:5173` ou similar).

## Próximos Passos para Funcionalidade Completa (MVP)

1.  **Desenvolver Componentes Frontend:** Criar os componentes/páginas/formulários em React para:
    *   Registo de Utilizador.
    *   Login de Utilizador (e gestão do token JWT).
    *   Formulário de Cadastro de Produto (acessível apenas a artesãos logados).
2.  **Integrar Frontend com API:** Conectar estes novos componentes aos endpoints correspondentes da API backend (`POST /api/users/register`, `POST /api/users/login`, `POST /api/products`).
3.  **Testes Integrados:** Testar os fluxos completos de ponta a ponta.

## Validação Realizada no Ambiente de Desenvolvimento

*   A estrutura monorepo foi criada.
*   O backend foi implementado e inicia (sem erros de sintaxe).
*   O frontend foi modificado para buscar produtos dinamicamente da API.
*   **Limitação:** Testes funcionais completos (registo, login, cadastro) não foram possíveis devido à ausência dos componentes frontend e da instância MongoDB no ambiente de desenvolvimento.

