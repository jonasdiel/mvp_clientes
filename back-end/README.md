# Back-end - MVP Clientes

API NestJS com TypeORM e PostgreSQL para gestão de clientes.

## 🛠️ Tecnologias

- **NestJS** - Framework Node.js
- **TypeORM** - ORM para PostgreSQL
- **PostgreSQL 16** - Banco de dados
- **Docker** - Containerização

## 📋 Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 20+ (para desenvolvimento local sem Docker)

## 🚀 Execução com Docker

### 1. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` conforme necessário.

### 2. Iniciar os serviços

```bash
# Iniciar todos os serviços (PostgreSQL + Back-end)
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar os serviços
docker-compose down

# Parar e remover volumes (limpa o banco de dados)
docker-compose down -v
```

### 3. Acessar a aplicação

- **API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health (quando implementado)

## 🔧 Desenvolvimento Local (sem Docker)

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar banco de dados

Certifique-se de ter um PostgreSQL rodando localmente ou inicie apenas o container do banco:

```bash
docker-compose up -d postgres
```

### 3. Executar a aplicação

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## 📦 Scripts Disponíveis

```bash
npm run start          # Iniciar aplicação
npm run start:dev      # Modo desenvolvimento (watch)
npm run start:prod     # Modo produção
npm run build          # Build da aplicação
npm run test           # Executar testes
npm run test:watch     # Testes em modo watch
npm run test:cov       # Coverage dos testes
npm run lint           # Verificar código
```

## 🗄️ Banco de Dados

O PostgreSQL é configurado automaticamente via Docker Compose:

- **Host**: localhost (ou `postgres` dentro do container)
- **Porta**: 5432
- **Database**: mvp_clientes
- **Usuário**: postgres
- **Senha**: postgres (alterar em produção)

### Migrations

```bash
# Gerar migration
npm run typeorm migration:generate -- -n NomeDaMigration

# Executar migrations
npm run typeorm migration:run

# Reverter migration
npm run typeorm migration:revert
```

## 🔐 Autenticação

A API utiliza JWT para autenticação. Configure a variável `JWT_SECRET` no arquivo `.env`.

## 📝 Estrutura do Projeto

```
back-end/
├── src/
│   ├── app/              # Módulo principal
│   ├── main.ts           # Entry point
│   └── assets/           # Arquivos estáticos
├── docker-compose.yml    # Configuração Docker
├── Dockerfile            # Build da imagem
├── .env.example          # Exemplo de variáveis de ambiente
└── README.md             # Esta documentação
```

## 🐛 Debug

Para debugar a aplicação no VSCode, use a configuração de launch já incluída no workspace.

## 📄 Documentação da API

A documentação Swagger estará disponível em:
- http://localhost:3000/api (quando implementado)
