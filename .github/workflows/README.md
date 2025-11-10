# CI/CD Workflows - MVP Clientes

Este diretório contém os workflows do GitHub Actions para CI/CD do projeto MVP Clientes.

## 📋 Workflows Disponíveis

### 1. Backend CI/CD ([backend.yml](./backend.yml))

Pipeline completo para o back-end (NestJS).

**Triggers:**

- Push para branches `main` e `develop`
- Pull requests para `main` e `develop`
- Apenas quando há mudanças em:
  - `back-end/**`
  - Arquivos de configuração raiz (`package.json`, `nx.json`, etc.)

**Steps:**

1. **Checkout** do código
2. **Setup Node.js** (v20.x) com cache npm
3. **Instalação** de dependências com `npm ci`
4. **Prettier Check** - Valida formatação do código
5. **Lint** - Executa ESLint no back-end
6. **Testes** - Executa testes unitários com cobertura
7. **Build** - Compila o projeto para produção
8. **Upload de Artefatos** - Coverage e build

**Serviços:**

- PostgreSQL 14 (container) para testes

**Variáveis de Ambiente:**

```yaml
DATABASE_HOST: localhost
DATABASE_PORT: 5432
DATABASE_USER: postgres
DATABASE_PASSWORD: postgres
DATABASE_NAME: mvp_clientes_test
JWT_SECRET: test-secret-key-for-ci
JWT_EXPIRES_IN: 24h
```

---

### 2. Frontend CI/CD ([frontend.yml](./frontend.yml))

Pipeline completo para o front-end (React + Vite).

**Triggers:**

- Push para branches `main` e `develop`
- Pull requests para `main` e `develop`
- Apenas quando há mudanças em:
  - `front-end/**`
  - Arquivos de configuração raiz

**Steps:**

1. **Checkout** do código
2. **Setup Node.js** (v20.x) com cache npm
3. **Instalação** de dependências com `npm ci`
4. **Prettier Check** - Valida formatação do código
5. **Lint** - Executa ESLint no front-end
6. **Testes** - Executa testes unitários com cobertura (Vitest)
7. **Build** - Compila o projeto para produção (Vite)
8. **Upload de Artefatos** - Coverage e build

**Variáveis de Ambiente:**

```yaml
VITE_API_URL: http://localhost:3000
```

---

## 🚀 Comandos Locais

### Formatação com Prettier

```bash
# Formatar todos os arquivos
npm run format

# Apenas verificar formatação (não altera arquivos)
npm run format:check
```

### Lint

```bash
# Lint apenas backend
nx lint back-end

# Lint apenas frontend
nx lint front-end

# Lint em todos os projetos
npm run lint:all
```

### Testes

```bash
# Testes apenas backend
nx test back-end

# Testes apenas frontend
nx test front-end

# Testes em todos os projetos
npm run test:all
```

### Build

```bash
# Build apenas backend
nx build back-end

# Build apenas frontend
nx build front-end

# Build em todos os projetos
npm run build:all
```

---

## 🔧 Configurações

### Nx Affected Commands

Os workflows utilizam a ação `nrwl/nx-set-shas` para otimizar builds:

- Executa apenas comandos para projetos afetados por mudanças
- Reduz tempo de execução em monorepos grandes

### Cache de Dependências

- GitHub Actions cache é habilitado para `node_modules`
- Acelera builds subsequentes

### Artefatos

Os seguintes artefatos são salvos por 7 dias:

- Coverage reports (backend e frontend)
- Build artifacts (dist folders)

---

## 📊 Status Badges

Adicione ao README principal:

```markdown
![Backend CI/CD](https://github.com/seu-usuario/mvp-clientes/actions/workflows/backend.yml/badge.svg)
![Frontend CI/CD](https://github.com/seu-usuario/mvp-clientes/actions/workflows/frontend.yml/badge.svg)
```

---

## 🐛 Troubleshooting

### Testes falhando no CI mas passando localmente

- Verifique variáveis de ambiente no workflow
- Confirme que o PostgreSQL container está saudável
- Revise diferenças entre ambiente local e CI (timezone, locales, etc.)

### Prettier check falhando

```bash
# Execute localmente antes de commitar:
npm run format
```

### Lint errors

```bash
# Execute localmente antes de commitar:
nx lint back-end
nx lint front-end
```

---

## 🔄 Próximos Passos (Opcional)

- [ ] Adicionar deploy automático (AWS, Vercel, etc.)
- [ ] Implementar testes E2E (Playwright/Cypress)
- [ ] Adicionar análise de segurança (Snyk, Dependabot)
- [ ] Configurar Docker build e push para registry
- [ ] Implementar semantic release para versionamento automático
