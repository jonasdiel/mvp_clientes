# Back-End - MVP Clientes.

API RESTful desenvolvida com NestJS, TypeORM e PostgreSQL para gerenciamento de clientes com autenticação JWT, auditoria completa e observabilidade.

## 🛠️ Tecnologias

| Tecnologia      | Versão | Descrição                     |
| --------------- | ------ | ----------------------------- |
| **NestJS**      | 11.0.0 | Framework Node.js progressivo |
| **TypeORM**     | 0.3.27 | ORM para TypeScript           |
| **PostgreSQL**  | 16     | Banco de dados relacional     |
| **Passport.js** | 10.0.4 | Autenticação                  |
| **JWT**         | 10.2.0 | JSON Web Tokens               |
| **Pino**        | 9.6.0  | Logger estruturado            |
| **Prometheus**  | 15.1.3 | Métricas                      |
| **Swagger**     | 8.0.11 | Documentação API              |
| **Jest**        | 29.7.0 | Framework de testes           |

## ✨ Funcionalidades

- ✅ **Autenticação JWT** com Passport.js
- ✅ **CRUD de Clientes** com soft delete
- ✅ **Auditoria Completa** (CREATE, READ, UPDATE, DELETE, LOGIN)
- ✅ **Métricas Prometheus** (HTTP requests, duração, operações)
- ✅ **Logs Estruturados** com Pino (formato JSON)
- ✅ **Health Checks** (Database + Memory)
- ✅ **Documentação Swagger/OpenAPI**
- ✅ **Validação de DTOs** com class-validator
- ✅ **Testes Unitários** com Jest

## 🚀 Execução

### Docker (Recomendado)

```bash
# Iniciar API + PostgreSQL
docker compose up -d

# Executar migrations
docker compose exec back-end npx nx run back-end:migration:run

# Ver logs
docker compose logs -f

# Parar serviços
docker compose down
```

**Acessar**:

- API: http://localhost:3000
- Docs: http://localhost:3000/docs
- Health: http://localhost:3000/api/healthz
- Metrics: http://localhost:3000/api/metrics

### Desenvolvimento Local

```bash
# Iniciar apenas PostgreSQL
docker compose up -d db

# Na raiz do monorepo
npx nx serve back-end
```

## 🗄️ Migrations

```bash
# Executar migrations
npx nx run back-end:migration:run

# Reverter última migration
npx nx run back-end:migration:revert

# Status das migrations
npx nx run back-end:migration:show
```

**Migrations existentes**:

1. `CreateClientsTable` - Tabela de clientes
2. `CreateAuditsTable` - Tabela de auditoria

> **Nota**: Em modo desenvolvimento (`NODE_ENV=development`), o seed é executado automaticamente ao iniciar a aplicação, criando um usuário administrador padrão. Consulte o README.md principal para credenciais de acesso.

## 📡 API Endpoints

### Base URL

```
http://localhost:3000/api
```

### Documentação Swagger

```
http://localhost:3000/docs
```

### Autenticação

- `POST /api/auth/login` - Login com email/senha

### Clientes (JWT requerido)

- `POST /api/clients` - Criar cliente
- `GET /api/clients` - Listar clientes (paginado)
- `GET /api/clients/:id` - Obter cliente
- `PUT /api/clients/:id` - Atualizar cliente
- `DELETE /api/clients/:id` - Excluir cliente (soft delete)

**Query Parameters** (`GET /api/clients`):

- `page` - Página atual (default: 1)
- `limit` - Itens por página (default: 10)
- `search` - Busca por nome, email ou CPF
- `orderBy` - Campo para ordenação
- `order` - Direção (ASC|DESC)

### Sistema

- `GET /api/healthz` - Health check
- `GET /api/metrics` - Métricas Prometheus

### Auditoria (JWT requerido)

- `GET /api/audits` - Listar logs de auditoria

## 🧪 Testes

```bash
# Executar testes
npx nx test back-end

# Com coverage
npx nx test back-end --coverage

# Watch mode
npx nx test back-end --watch
```

## 📂 Estrutura

```
back-end/
├── src/
│   ├── app/
│   │   ├── auth/              # Autenticação JWT
│   │   │   ├── dto/          # Data Transfer Objects
│   │   │   ├── guards/       # Guards de autenticação
│   │   │   └── strategies/   # Estratégias Passport
│   │   ├── clients/           # Gerenciamento de clientes
│   │   │   ├── dto/          # DTOs de cliente
│   │   │   └── entities/     # Entidade Client
│   │   ├── common/            # Utilitários compartilhados
│   │   │   └── middleware/   # Middlewares HTTP
│   │   ├── database/          # Configuração TypeORM
│   │   ├── entities/          # Entidades globais
│   │   ├── health/            # Health checks
│   │   └── metrics/           # Métricas Prometheus
│   ├── audits/                # Sistema de auditoria
│   │   ├── decorators/       # Decorators de auditoria
│   │   ├── entities/         # Entidade Audit
│   │   └── interceptors/     # Interceptor de auditoria
│   ├── config/                # Configurações da aplicação
│   ├── migrations/            # Migrations TypeORM
│   ├── assets/                # Arquivos estáticos
│   └── main.ts                # Entry point
├── test/                      # Testes E2E
├── docker-compose.yml         # Docker Compose
├── Dockerfile                 # Imagem Docker
└── README.md                  # Este arquivo
```

## 📊 Observabilidade

### Logs (Pino)

Logs estruturados em JSON com dados sensíveis redactados.

**Configuração**: `src/config/logger.config.ts`

### Métricas (Prometheus)

- `http_requests_total` - Total de requisições
- `http_request_duration_seconds` - Duração
- `clients_created_total` - Clientes criados
- `clients_deleted_total` - Clientes excluídos

**Endpoint**: http://localhost:3000/api/metrics

### Health Checks

Monitora Database, Memory Heap e Memory RSS.

**Endpoint**: http://localhost:3000/api/healthz

### Auditoria

Sistema automático via `AuditInterceptor` que registra:

- Ações: LOGIN, CREATE, READ, UPDATE, DELETE
- Usuário, IP, User Agent
- Alterações realizadas

## 🌐 Variáveis de Ambiente

Arquivo `.env`:

```env
NODE_ENV=development
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=mvp_clientes
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=24h
LOG_LEVEL=info
```

## 📄 Comandos Úteis

```bash
# Desenvolvimento
npx nx serve back-end

# Build
npx nx build back-end

# Testes
npx nx test back-end

# Lint
npx nx lint back-end

# Migrations
npx nx run back-end:migration:run
npx nx run back-end:migration:revert
npx nx run back-end:migration:show
```

## 🔐 Segurança

- ✅ JWT com tokens assinados (HS256)
- ✅ Senhas hashadas com Bcrypt
- ✅ Validação de DTOs
- ✅ Soft delete
- ✅ Logs redactados
- ✅ TypeORM com prepared statements
- ✅ CORS configurado
