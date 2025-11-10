# Contexto Técnico do Projeto - MVP Clientes

## 📋 Stack Técnica Completa

### Monorepo
- **Nx.dev** (obrigatório)
  - Workspace com apps separados (front-end, back-end)
  - Pipelines independentes para build e testes
  - Comandos: `nx serve`, `nx build`, `nx test`

### Back-End
- **NestJS** (framework)
  - Arquitetura modular
  - Decorators e dependency injection
- **TypeORM** (ORM)
  - Migrations
  - Entities com decorators
  - Repository pattern
- **PostgreSQL** (banco de dados)
  - Versão 14+
  - Rodando em container Docker
- **JWT** (autenticação)
  - @nestjs/jwt
  - Passport strategy
  - Guards para proteção de rotas
- **class-validator** ou **Zod** (validação)
  - DTOs validados
  - Pipes de validação
- **Swagger/OpenAPI** (documentação - obrigatório)
  - @nestjs/swagger
  - Decorators para documentação
  - Disponível em `/docs`
- **Winston** ou **Pino** (logs estruturados)
  - Formato JSON
  - Níveis: error, warn, info, debug
- **Prometheus client** (métricas - obrigatório)
  - Endpoint `/metrics`
  - Formato Prometheus exposition
- **Docker + docker-compose**
  - Dockerfile otimizado
  - docker-compose.yml isolado
- **dotenv** (variáveis de ambiente)
  - .env
  - .env.example

### Front-End
- **React 18+**
- **Vite** (build tool)
- **TypeScript** (strict mode)
- **React Router** v6+ (roteamento)
- **React Hook Form** ou **Formik** (formulários)
  - Validação com Zod ou Yup
- **TanStack Query** (React Query) ou **SWR** (gerenciamento de estado servidor)
- **Zustand**, **Redux Toolkit** ou **Context API** (estado global)
- **Axios** (HTTP client)
- **Tailwind CSS** ou **Material-UI** ou **Ant Design** (UI)
- **Recharts** ou **Chart.js** (gráficos dashboard)
- **Vitest** (testes unitários)
- **Testing Library** (@testing-library/react)
- **Playwright** ou **Cypress** (E2E - diferencial)
- **Docker + docker-compose**
  - Nginx para servir build de produção

### DevOps & Qualidade
- **ESLint**
  - Configuração compartilhada no monorepo
  - Rules para TS, React, NestJS
- **Prettier**
  - Formatação consistente
- **Husky** (opcional)
  - Pre-commit hooks
- **Commitizen** ou **Conventional Commits**
  - Padrão semântico: feat, fix, chore, docs
- **GitHub Actions**
  - Workflow para backend (build, test, lint)
  - Workflow para frontend (build, test, lint)
  - Cache de dependências
- **Docker**
  - Multi-stage builds
  - .dockerignore
- **Redis** (opcional - diferencial)
  - Cache de sessões ou dados

### Observabilidade (Diferencial)
- **OpenTelemetry** ou **AWS X-Ray**
  - Distributed tracing
  - Spans e traces
- **Prometheus + Grafana** (local)
  - Dashboards de métricas

## 🏗️ Estrutura de Pastas Detalhada

```
/
├── .github/
│   └── workflows/
│       ├── backend.yml
│       └── frontend.yml
├── apps/
│   ├── back-end/
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── config/
│   │   │   │   ├── database.config.ts
│   │   │   │   ├── jwt.config.ts
│   │   │   │   └── logger.config.ts
│   │   │   ├── common/
│   │   │   │   ├── decorators/
│   │   │   │   ├── filters/
│   │   │   │   ├── guards/
│   │   │   │   ├── interceptors/
│   │   │   │   └── pipes/
│   │   │   ├── auth/
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── dto/
│   │   │   │   ├── strategies/
│   │   │   │   └── guards/
│   │   │   ├── clients/
│   │   │   │   ├── clients.module.ts
│   │   │   │   ├── clients.controller.ts
│   │   │   │   ├── clients.service.ts
│   │   │   │   ├── clients.repository.ts
│   │   │   │   ├── entities/
│   │   │   │   │   └── client.entity.ts
│   │   │   │   └── dto/
│   │   │   ├── metrics/
│   │   │   │   ├── metrics.module.ts
│   │   │   │   ├── metrics.controller.ts
│   │   │   │   └── metrics.service.ts
│   │   │   └── health/
│   │   │       ├── health.module.ts
│   │   │       └── health.controller.ts
│   │   ├── migrations/
│   │   ├── test/
│   │   ├── .env.example
│   │   ├── docker-compose.yml
│   │   ├── Dockerfile
│   │   ├── README.md
│   │   └── project.json
│   └── front-end/
│       ├── src/
│       │   ├── main.tsx
│       │   ├── App.tsx
│       │   ├── app/
│       │   │   ├── routes.tsx
│       │   │   └── layouts/
│       │   ├── features/
│       │   │   ├── auth/
│       │   │   │   ├── components/
│       │   │   │   ├── hooks/
│       │   │   │   ├── services/
│       │   │   │   └── pages/
│       │   │   │       └── LoginPage.tsx
│       │   │   ├── clients/
│       │   │   │   ├── components/
│       │   │   │   ├── hooks/
│       │   │   │   ├── services/
│       │   │   │   ├── types/
│       │   │   │   └── pages/
│       │   │   │       ├── ClientsListPage.tsx
│       │   │   │       ├── ClientCreatePage.tsx
│       │   │   │       ├── ClientEditPage.tsx
│       │   │   │       └── ClientDetailPage.tsx
│       │   │   └── dashboard/
│       │   │       ├── components/
│       │   │       ├── hooks/
│       │   │       ├── services/
│       │   │       └── pages/
│       │   │           └── DashboardPage.tsx
│       │   ├── shared/
│       │   │   ├── components/
│       │   │   ├── hooks/
│       │   │   ├── utils/
│       │   │   ├── services/
│       │   │   │   └── api.ts
│       │   │   ├── types/
│       │   │   └── store/
│       │   └── assets/
│       ├── public/
│       ├── test/
│       ├── .env.example
│       ├── docker-compose.yml
│       ├── Dockerfile
│       ├── nginx.conf
│       ├── vitest.config.ts
│       ├── README.md
│       └── project.json
├── nx.json
├── package.json
├── tsconfig.base.json
└── README.md
```

## 📡 Endpoints da API (Back-End)

### Autenticação
- `POST /api/auth/login`
  - Body: `{ email: string, password: string }`
  - Response: `{ access_token: string, user: {...} }`

### Clientes (Todos protegidos com JWT)
- `POST /api/clients`
  - Body: `CreateClientDto`
  - Response: `Client`
- `GET /api/clients`
  - Query: `?page=1&limit=10&search=&orderBy=createdAt&order=DESC`
  - Response: `{ data: Client[], total: number, page: number, limit: number }`
- `GET /api/clients/:id`
  - Response: `Client` (incrementa contador de views)
- `PUT /api/clients/:id`
  - Body: `UpdateClientDto`
  - Response: `Client`
- `DELETE /api/clients/:id`
  - Response: `{ deleted: boolean }` (soft delete)

### Sistema
- `GET /api/healthz`
  - Response: `{ status: 'ok', database: 'ok', timestamp: ISO }`
- `GET /api/metrics`
  - Response: Prometheus format (text/plain)
- `GET /docs`
  - Swagger UI

## 🗄️ Modelo de Dados

### User (para autenticação)
```typescript
{
  id: UUID
  email: string (unique)
  password: string (hashed)
  name: string
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Client
```typescript
{
  id: UUID
  name: string
  email: string
  phone: string
  cpf: string (unique)
  address: string (opcional)
  viewCount: number (default: 0)
  deletedAt: DateTime (nullable) // soft delete
  createdAt: DateTime
  updatedAt: DateTime
}
```

## 🎨 Fluxos de Tela (Front-End)

### 1. Login (`/login`)
- Formulário: email + senha
- Validação client-side
- Armazena token JWT (localStorage/sessionStorage)
- Redirect para `/dashboard`

### 2. Dashboard (`/dashboard`)
- Cards com totais:
  - Total de clientes
  - Clientes criados hoje
  - Clientes mais visualizados
- Gráfico de clientes criados (últimos 7 dias)
- Lista dos 5 últimos clientes cadastrados
- Menu de navegação

### 3. Lista de Clientes (`/clients`)
- Tabela com: nome, email, telefone, data de criação
- Paginação
- Busca por nome/email
- Botões: Criar, Editar, Excluir, Ver detalhes
- Ordenação por colunas

### 4. Criar Cliente (`/clients/new`)
- Formulário: nome, email, telefone, CPF, endereço
- Validação (email válido, CPF válido)
- Máscara para telefone e CPF
- Botões: Salvar, Cancelar

### 5. Editar Cliente (`/clients/:id/edit`)
- Mesmo formulário do criar, pré-preenchido
- Botões: Salvar, Cancelar

### 6. Detalhes do Cliente (`/clients/:id`)
- Exibe todos os dados do cliente
- Mostra contador de visualizações
- Botões: Editar, Excluir, Voltar

## ✅ Testes

### Back-End (Jest)
- **Unitários**:
  - Services: `clients.service.spec.ts`, `auth.service.spec.ts`
  - Controllers: testes de rotas
  - Guards, Pipes, Interceptors
- **Integração** (diferencial):
  - E2E com supertest
  - Teste de endpoints completos
  - Banco de dados de teste

### Front-End (Vitest + Testing Library)
- **Unitários**:
  - Componentes: renderização, props, eventos
  - Hooks customizados
  - Utils e helpers
- **Integração**:
  - Fluxos de formulários
  - Mock de API calls
- **E2E** (Playwright/Cypress - diferencial):
  - Fluxo completo de login
  - CRUD de clientes end-to-end

## 🐳 Docker

### Back-End docker-compose.yml
```yaml
services:
  api:
    build: .
    ports: ["3000:3000"]
    env_file: .env
    depends_on: [db]

  db:
    image: postgres:14
    environment:
      POSTGRES_DB: mvp_clientes
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports: ["5432:5432"]
    volumes: [postgres_data:/var/lib/postgresql/data]
```

### Front-End docker-compose.yml
```yaml
services:
  web:
    build: .
    ports: ["5173:80"]
    env_file: .env
```

## 🔐 Variáveis de Ambiente

### Back-End (.env.example)
```
NODE_ENV=development
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=mvp_clientes
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h
```

### Front-End (.env.example)
```
VITE_API_URL=http://localhost:3000
```

## 📊 Observabilidade - Implementação

### Logs Estruturados (JSON)
```json
{
  "level": "info",
  "timestamp": "2025-01-07T10:30:00.000Z",
  "context": "ClientsService",
  "message": "Client created",
  "clientId": "uuid",
  "userId": "uuid"
}
```

### Métricas Prometheus
- `http_requests_total{method, route, status}`
- `http_request_duration_seconds{method, route}`
- `clients_total`
- `clients_created_total`
- `clients_deleted_total`

### Healthcheck Response
```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "memory": { "status": "up", "used": "50MB" }
  },
  "timestamp": "2025-01-07T10:30:00.000Z"
}
```

## 🚀 CI/CD - GitHub Actions

### Backend Workflow
```yaml
- name: Install dependencies
- name: Lint
- name: Test
- name: Build
- name: Docker build (opcional)
```

### Frontend Workflow
```yaml
- name: Install dependencies
- name: Lint
- name: Test
- name: Build
- name: Docker build (opcional)
```

## 🎯 Checklist de Comandos Nx

### Desenvolvimento
```bash
# Instalar dependências
npm install

# Servir backend
nx serve back-end

# Servir frontend
nx serve front-end

# Build backend
nx build back-end

# Build frontend
nx build front-end

# Testes backend
nx test back-end

# Testes frontend
nx test front-end

# Lint backend
nx lint back-end

# Lint frontend
nx lint front-end

# Rodar todos os testes
nx run-many --target=test --all

# Gerar migration (backend)
nx migration:generate back-end

# Rodar migrations
nx migration:run back-end

# Reverter última migration
nx migration:revert back-end

# Mostrar status das migrations
nx migration:show back-end
```

### Docker
```bash
# Backend + DB
cd apps/back-end
docker-compose up -d

# Frontend
cd apps/front-end
docker-compose up -d
```

## 🏆 Diferenciais a Implementar

1. **Redis** para cache de sessões ou queries frequentes
2. **OpenTelemetry** para distributed tracing
3. **Testes E2E** completos (Playwright)
4. **Deploy AWS** com:
   - ECS/Fargate para containers
   - RDS para PostgreSQL
   - CloudWatch para logs/métricas
   - ALB para load balancing
   - CloudFront + S3 para frontend
5. **Rate Limiting** com @nestjs/throttler
6. **Helmet** para segurança HTTP headers
7. **Compressão** de respostas HTTP
8. **CORS** configurado adequadamente

## 📝 Ordem de Implementação Sugerida

1. Setup monorepo Nx
2. Backend: estrutura + TypeORM + PostgreSQL
3. Backend: autenticação JWT
4. Backend: CRUD clientes + soft delete
5. Backend: Swagger + healthcheck + metrics
6. Backend: logs estruturados
7. Backend: testes unitários
8. Frontend: estrutura + rotas + auth
9. Frontend: páginas CRUD clientes
10. Frontend: dashboard com gráfico
11. Frontend: testes unitários
12. Docker compose para ambos
13. CI/CD GitHub Actions
14. README com diagramas
15. Diferenciais (Redis, E2E, deploy)
