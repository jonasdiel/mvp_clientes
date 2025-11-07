FROM node:20-alpine

WORKDIR /workspace

# Copiar package.json da raiz do monorepo
COPY ../package*.json ./
COPY ../tsconfig.base.json ./
COPY ../nx.json ./

# Instalar dependências
RUN npm install

# Copiar todo o workspace
COPY .. .

EXPOSE 3000

# Executar o app back-end usando Nx
CMD ["npx", "nx", "serve", "back-end"]
