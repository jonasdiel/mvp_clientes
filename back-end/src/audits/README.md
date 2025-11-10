# Sistema de Auditoria

## Visão Geral

O sistema de auditoria registra automaticamente todas as ações importantes realizadas pelos usuários no sistema, incluindo:
- **LOGIN**: Autenticação de usuários
- **CREATE**: Criação de novos registros
- **READ**: Visualização de registros (quando incrementa viewCount)
- **UPDATE**: Atualização de registros existentes
- **DELETE**: Exclusão de registros (soft delete)

## Estrutura do Banco de Dados

### Tabela `audits`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único do registro de auditoria |
| userId | UUID (nullable) | ID do usuário que realizou a ação |
| tableName | VARCHAR(100) | Nome da tabela afetada |
| action | ENUM | Tipo de ação (LOGIN, CREATE, READ, UPDATE, DELETE) |
| recordId | UUID (nullable) | ID do registro afetado |
| previousData | JSONB (nullable) | Dados anteriores (para UPDATE e DELETE) |
| newData | JSONB (nullable) | Dados novos (para CREATE e UPDATE) |
| ipAddress | VARCHAR(45) (nullable) | Endereço IP do usuário |
| userAgent | VARCHAR(255) (nullable) | User agent do navegador |
| createdAt | TIMESTAMP | Data e hora da ação |

### Índices

Para melhorar o desempenho das consultas, foram criados índices em:
- `userId`
- `tableName`
- `action`
- `recordId`
- `createdAt`

## Arquitetura

### Componentes

1. **Audit Entity** (`entities/audit.entity.ts`)
   - Define a estrutura da tabela de auditoria
   - Relacionamento com a entidade User

2. **Audits Service** (`audits.service.ts`)
   - Métodos para criar registros de auditoria
   - Métodos específicos para cada tipo de ação (logLogin, logCreate, logRead, logUpdate, logDelete)
   - Métodos para consultar registros de auditoria com filtros avançados

3. **Audits Controller** (`audits.controller.ts`)
   - Endpoints para consultar registros de auditoria
   - Protegido com JWT Guard
   - Documentado com Swagger

4. **Audit Decorator** (`decorators/audit.decorator.ts`)
   - Decorator customizado para marcar métodos que devem ser auditados
   - (Opcional - preparado para uso futuro)

5. **Audit Interceptor** (`interceptors/audit.interceptor.ts`)
   - Interceptor que pode ser usado para auditoria automática via decorators
   - (Opcional - preparado para uso futuro)

## Uso

### Integração com Services

A auditoria está integrada nos seguintes services:

#### AuthService
```typescript
// Login
await this.auditsService.logLogin(user.id, ipAddress, userAgent);
```

#### ClientsService
```typescript
// Create
await this.auditsService.logCreate(userId, 'clients', client.id, client, ipAddress, userAgent);

// Read (quando incrementa visualização)
await this.auditsService.logRead(userId, 'clients', id, ipAddress, userAgent);

// Update
await this.auditsService.logUpdate(userId, 'clients', id, previousData, updatedData, ipAddress, userAgent);

// Delete
await this.auditsService.logDelete(userId, 'clients', id, previousData, ipAddress, userAgent);
```

### API Endpoints

#### Listar Auditorias
```http
GET /api/audits?page=1&limit=10&userId=xxx&tableName=clients&action=CREATE
```

**Query Parameters:**
- `page`: Número da página (default: 1)
- `limit`: Itens por página (default: 10)
- `userId`: Filtrar por usuário
- `tableName`: Filtrar por tabela
- `action`: Filtrar por ação (LOGIN, CREATE, READ, UPDATE, DELETE)
- `recordId`: Filtrar por ID do registro
- `startDate`: Data inicial (ISO 8601)
- `endDate`: Data final (ISO 8601)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "user": {
        "id": "uuid",
        "name": "Admin User",
        "email": "admin@example.com"
      },
      "tableName": "clients",
      "action": "CREATE",
      "recordId": "uuid",
      "previousData": null,
      "newData": {
        "id": "uuid",
        "name": "João Silva",
        "email": "joao@example.com",
        ...
      },
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "createdAt": "2025-01-09T10:30:00.000Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10
}
```

#### Buscar Auditoria por ID
```http
GET /api/audits/:id
```

#### Buscar Histórico de um Registro
```http
GET /api/audits/record/:tableName/:recordId
```

Exemplo: `GET /api/audits/record/clients/550e8400-e29b-41d4-a716-446655440000`

Retorna todo o histórico de alterações de um cliente específico.

#### Buscar Ações de um Usuário
```http
GET /api/audits/user/:userId?limit=50
```

Retorna as últimas ações realizadas por um usuário específico.

## Segurança

### Dados Sensíveis

O sistema automaticamente remove campos sensíveis antes de salvar no audit:
- `password`
- `token`
- `secret`

### Autenticação

Todos os endpoints de consulta de auditoria são protegidos com JWT Guard, garantindo que apenas usuários autenticados possam acessar os logs.

## Exemplos de Uso

### Rastrear Mudanças em um Cliente

```bash
# Buscar histórico completo de um cliente
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/audits/record/clients/550e8400-e29b-41d4-a716-446655440000
```

### Auditar Ações de um Usuário

```bash
# Buscar todas as ações de um usuário
curl -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/audits/user/660e8400-e29b-41d4-a716-446655440000
```

### Monitorar Logins

```bash
# Buscar todos os logins
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3000/api/audits?action=LOGIN&limit=20"
```

### Analisar Mudanças em um Período

```bash
# Buscar todas as alterações de clientes em um período
curl -H "Authorization: Bearer <token>" \
  "http://localhost:3000/api/audits?tableName=clients&action=UPDATE&startDate=2025-01-01&endDate=2025-01-31"
```

## Boas Práticas

1. **Tratamento de Erros**: Todos os métodos de auditoria usam try-catch para não quebrar a aplicação caso ocorra erro no log

2. **Performance**: Índices criados para otimizar consultas frequentes

3. **Async/Await**: Operações de auditoria são assíncronas e não bloqueiam o fluxo principal

4. **Dados Completos**: Para UPDATE e DELETE, salvamos os dados anteriores para permitir recuperação

5. **Metadados**: IP e User Agent são capturados para fornecer contexto adicional

## Expansões Futuras

- Implementar retenção de dados (arquivamento de auditorias antigas)
- Dashboard de análise de auditoria
- Alertas para ações suspeitas
- Export de auditorias em diferentes formatos (CSV, Excel, PDF)
- Integração com ferramentas de SIEM
