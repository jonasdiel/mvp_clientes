# Front-end - MVP Clientes

Interface web em React com Vite e TypeScript para gestão de clientes.

## 🛠️ Tecnologias

- **React 18** - Biblioteca UI
- **Vite** - Build tool e dev server
- **TypeScript** - Tipagem estática
- **React Router** - Roteamento
- **Vitest** - Framework de testes
- **Docker** - Containerização

## 📋 Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 20+ (para desenvolvimento local sem Docker)

## 🚀 Execução com Docker

### 1. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` conforme necessário, especialmente a URL da API.

### 2. Iniciar o serviço

```bash
# Iniciar o front-end
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar o serviço
docker-compose down
```

### 3. Acessar a aplicação

- **Front-end**: http://localhost:4200

## 🔧 Desenvolvimento Local (sem Docker)

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

### 3. Executar a aplicação

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview
```

## 📦 Scripts Disponíveis

```bash
npm run dev            # Inicia servidor de desenvolvimento
npm run build          # Build para produção
npm run preview        # Preview do build de produção
npm run test           # Executar testes com Vitest
npm run test:ui        # Executar testes com UI
npm run lint           # Verificar código com ESLint
```

## 🧪 Testes

```bash
# Executar todos os testes
npm run test

# Modo watch
npm run test:watch

# Coverage
npm run test:coverage

# UI interativa
npm run test:ui
```

## 📁 Estrutura do Projeto

```
front-end/
├── src/
│   ├── app/              # Componentes principais
│   ├── assets/           # Imagens, fontes, etc
│   ├── styles.css        # Estilos globais
│   └── main.tsx          # Entry point
├── public/               # Arquivos estáticos
├── index.html            # HTML base
├── docker-compose.yml    # Configuração Docker
├── Dockerfile            # Build da imagem
├── vite.config.ts        # Configuração Vite
├── .env.example          # Exemplo de variáveis de ambiente
└── README.md             # Esta documentação
```

## 🎨 Estrutura de Componentes (Sugerida)

```
src/
├── app/
│   ├── components/       # Componentes reutilizáveis
│   ├── pages/            # Páginas/views
│   ├── services/         # Chamadas à API
│   ├── hooks/            # Custom hooks
│   ├── contexts/         # Contexts do React
│   ├── types/            # Tipos TypeScript
│   └── utils/            # Funções utilitárias
```

## 🔌 Integração com API

A URL da API é configurada via variável de ambiente `VITE_API_URL`:

```typescript
// Exemplo de uso
const API_URL = import.meta.env.VITE_API_URL;

fetch(`${API_URL}/clientes`)
  .then(response => response.json())
  .then(data => console.log(data));
```

## 🌐 Variáveis de Ambiente

Todas as variáveis de ambiente devem ter o prefixo `VITE_` para serem acessíveis no código:

```env
VITE_API_URL=http://localhost:3000
VITE_ENABLE_MOCK_API=false
```

Acesso no código:

```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

## 🐛 Debug

Para debugar no navegador, use o React DevTools:
- [Chrome Extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Firefox Extension](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

## 📱 Build para Produção

```bash
# Build
npm run build

# O build estará em dist/
# Para testar localmente:
npm run preview
```

## 🚀 Deploy

O build gera arquivos estáticos na pasta `dist/` que podem ser servidos por qualquer servidor web (Nginx, Apache, etc).

### Exemplo com Nginx:

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    root /caminho/para/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
