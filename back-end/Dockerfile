FROM node:20-alpine

WORKDIR /workspace

# Copiar arquivos de configuração do monorepo
COPY package*.json ./
COPY tsconfig.base.json ./
COPY nx.json ./

# Instalar todas as dependências (incluindo devDependencies para o Nx)
RUN npm install

# Copiar todo o código do monorepo
COPY . .

EXPOSE 3000

# Comando padrão (pode ser sobrescrito pelo docker-compose)
CMD ["npx", "nx", "serve", "back-end", "--host=0.0.0.0"]
