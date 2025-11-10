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
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'salary',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'company_value',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'view_count',
            type: 'int',
            default: 0,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
            default: null,
          },
        ],
      }),
      true,
    );

    // Create index for soft delete queries
    await queryRunner.query(
      `CREATE INDEX "idx_clients_deleted_at" ON "clients" ("deleted_at")`,
    );

    // Create index for name search
    await queryRunner.query(
      `CREATE INDEX "idx_clients_name" ON "clients" ("name")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "idx_clients_name"`);
    await queryRunner.query(`DROP INDEX "idx_clients_deleted_at"`);
    await queryRunner.dropTable('clients');
  }
}
