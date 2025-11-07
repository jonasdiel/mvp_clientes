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

EXPOSE 4200

# Executar o app front-end usando Nx
CMD ["npx", "nx", "serve", "front-end", "--host", "0.0.0.0", "--port", "4200"]
