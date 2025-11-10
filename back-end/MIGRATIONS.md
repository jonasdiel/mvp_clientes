# Guia de Migrations - Back-End

## Configuração

As migrations do TypeORM estão configuradas para rodar através do Nx com os seguintes comandos.

### Arquivo de Configuração

O arquivo de configuração do TypeORM DataSource está localizado em:

- `back-end/src/config/typeorm.config.ts`

Este arquivo é usado pelo CLI do TypeORM para executar as migrations.

## Comandos Disponíveis

### Executar Migrations Pendentes

```bash
npx nx migration:run back-end
```

Este comando executa todas as migrations que ainda não foram aplicadas ao banco de dados.

### Reverter Última Migration

```bash
npx nx migration:revert back-end
```

Este comando reverte a última migration executada.

### Mostrar Status das Migrations

```bash
npx nx migration:show back-end
```

Este comando mostra quais migrations foram executadas e quais estão pendentes.

### Gerar Nova Migration

```bash
npx nx migration:generate back-end
```

Este comando gera uma nova migration baseada nas alterações detectadas nas entities.

## Variáveis de Ambiente

As migrations utilizam as seguintes variáveis de ambiente (definidas no arquivo `.env`):

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=mvp_clientes
```

## Estrutura de Arquivos

- **Migrations**: `back-end/src/migrations/`
- **Entities**: `back-end/src/app/**/*.entity.ts`
- **Configuração**: `back-end/src/config/typeorm.config.ts`

## Como Funciona

1. O Nx executa o comando configurado em `back-end/project.json`
2. O comando chama o script npm `typeorm` que usa o `typeorm-ts-node-commonjs`
3. O TypeORM CLI carrega a configuração do `DataSource` de `typeorm.config.ts`
4. As migrations são executadas usando o padrão de glob: `back-end/src/migrations/*.{ts,js}`

## Exemplo de Migration

```typescript
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateClientsTable1736446800000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'clients',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          // ... outras colunas
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('clients');
  }
}
```

## Troubleshooting

### Erro: "Cannot find configuration for task back-end:typeorm"

Certifique-se de que os targets estão configurados corretamente em `back-end/project.json`:

```json
{
  "targets": {
    "migration:run": {
      "executor": "nx:run-commands",
      "options": {
        "command": "npm run typeorm migration:run -- -d back-end/src/config/typeorm.config.ts"
      }
    }
  }
}
```

### Erro: "Database does not exist"

Certifique-se de que o banco de dados existe:

```bash
docker exec mvp-clientes-postgres psql -U postgres -c "CREATE DATABASE mvp_clientes;"
```

### Erro: "No migrations are pending"

Verifique se há migrations no diretório `back-end/src/migrations/` e se o padrão de glob está correto.
