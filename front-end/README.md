# Front-End - MVP Clientes

Interface web moderna desenvolvida com React 19, Vite e TypeScript para gerenciamento de clientes com autenticação, formulários validados e interface responsiva.

## 🛠️ Tecnologias

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **React** | 19.0.0 | Biblioteca UI |
| **Vite** | 7.0.0 | Build tool e dev server |
| **TypeScript** | 5.9.3 | Superset tipado do JavaScript |
| **React Router** | 6.29.0 | Roteamento SPA |
| **React Hook Form** | 7.66.0 | Gerenciamento de formulários |
| **Zod** | 4.1.12 | Validação de schemas |
| **Zustand** | 5.0.8 | Gerenciamento de estado |
| **Axios** | 1.6.0 | Cliente HTTP |
| **Tailwind CSS** | 3.4.3 | Framework CSS utility-first |
| **Radix UI** | - | Componentes acessíveis |
| **Vitest** | 3.0.5 | Framework de testes |

## ✨ Funcionalidades

- ✅ **Autenticação JWT** com proteção de rotas
- ✅ **Dashboard Administrativo** com métricas e estatísticas
- ✅ **CRUD de Clientes** completo com paginação, busca e filtros
- ✅ **Validação de Formulários** com Zod e React Hook Form
- ✅ **Interface Responsiva** com Tailwind CSS
- ✅ **Componentes Acessíveis** com Radix UI
- ✅ **Testes Unitários** com Vitest

## 🚀 Execução

### Docker (Recomendado)

```bash
# Iniciar serviço
docker compose up -d

# Ver logs
docker compose logs -f

# Parar serviço
docker compose down
```

**Acessar**: http://localhost:4200

### Desenvolvimento Local

```bash
# Na raiz do monorepo
npx nx serve front-end
```

**Acessar**: http://localhost:4200

## 🗺️ Rotas

### Públicas
- `/` - Redireciona para `/login`
- `/login` - Página de autenticação
  - Usuários autenticados são redirecionados para `/dashboard`

### Protegidas (JWT)
- `/dashboard` - Dashboard administrativo com métricas e estatísticas
- `/clients` - Lista de clientes com paginação, busca e filtros
- `/clients/:id` - Detalhes do cliente (incrementa contador de visualizações)
- `*` - Rotas não encontradas redirecionam para `/login`

> **Proteção de Rotas**: Todas as rotas protegidas verificam a presença do token JWT. Usuários não autenticados são redirecionados para `/login`.

## 🧪 Testes

```bash
# Executar testes
npx nx test front-end

# Com coverage
npx nx test front-end --coverage

# Watch mode
npx nx test front-end --watch
```

## 📂 Estrutura

```
front-end/
├── src/
│   ├── app/                           # Rotas e configuração
│   │   └── app.tsx                    # Router com rotas públicas e protegidas
│   ├── components/
│   │   └── ui/                        # Componentes UI (shadcn/ui + Radix)
│   ├── features/
│   │   ├── auth/                      # Autenticação
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.tsx      # Página de login
│   │   │   │   └── LoginForm.tsx      # Formulário de login
│   │   │   └── services/
│   │   │       └── auth.service.ts    # Serviço de autenticação JWT
│   │   ├── clients/                   # Módulo de clientes
│   │   │   ├── components/
│   │   │   │   ├── ClientForm.tsx     # Formulário de criação/edição
│   │   │   │   └── ClientModal.tsx    # Modal para operações
│   │   │   ├── pages/
│   │   │   │   ├── ClientsListPage.tsx    # Lista com paginação
│   │   │   │   └── ClientDetailPage.tsx   # Detalhes do cliente
│   │   │   ├── schemas/
│   │   │   │   └── client.schema.ts   # Validação Zod
│   │   │   └── services/
│   │   │       └── clients.service.ts # Serviço de API de clientes
│   │   └── dashboard/                 # Dashboard administrativo
│   │       ├── pages/
│   │       │   └── DashboardPage.tsx  # Métricas e estatísticas
│   │       └── services/
│   │           └── dashboard.service.ts
│   ├── shared/
│   │   ├── services/
│   │   │   └── api.ts                 # Configuração Axios + interceptors
│   │   ├── store/
│   │   │   └── auth.store.ts          # Store Zustand para auth
│   │   ├── types/
│   │   │   └── client.types.ts        # Interfaces TypeScript
│   │   └── utils/
│   │       ├── currency.ts            # Formatação de moeda
│   │       └── logger.ts              # Logger estruturado
│   ├── lib/
│   │   └── utils.ts                   # Utilitários gerais
│   └── main.tsx                       # Entry point
├── docker-compose.yml                 # Compose para produção (Nginx)
├── Dockerfile                         # Multi-stage build
├── nginx.conf                         # Configuração Nginx
└── README.md
```

## 🔌 Integração com API

Configurado via Axios em `src/shared/services/api.ts` com:
- Base URL: `VITE_API_URL`
- Interceptor JWT automático
- Tratamento de erros

## 🌐 Variáveis de Ambiente

Arquivo `.env`:

```env
VITE_API_URL=http://localhost:3000
VITE_LOG_LEVEL=info
```

## 📄 Comandos Úteis

```bash
# Desenvolvimento
npx nx serve front-end

# Build
npx nx build front-end

# Testes
npx nx test front-end

# Lint
npx nx lint front-end
```