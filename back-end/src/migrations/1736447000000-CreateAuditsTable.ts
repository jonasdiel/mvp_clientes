import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateAuditsTable1736447000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "audit_action_enum" AS ENUM ('LOGIN', 'CREATE', 'READ', 'UPDATE', 'DELETE')
    `);

    await queryRunner.createTable(
      new Table({
        name: 'audits',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'userId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'tableName',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'action',
            type: 'audit_action_enum',
          },
          {
            name: 'recordId',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'previousData',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'newData',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'ipAddress',
            type: 'varchar',
            length: '45',
            isNullable: true,
          },
          {
            name: 'userAgent',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'audits',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );

    // Create indexes for better query performance
    await queryRunner.query(`
      CREATE INDEX "IDX_audits_userId" ON "audits" ("userId")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_audits_tableName" ON "audits" ("tableName")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_audits_action" ON "audits" ("action")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_audits_recordId" ON "audits" ("recordId")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_audits_createdAt" ON "audits" ("createdAt")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_audits_createdAt"`);
    await queryRunner.query(`DROP INDEX "IDX_audits_recordId"`);
    await queryRunner.query(`DROP INDEX "IDX_audits_action"`);
    await queryRunner.query(`DROP INDEX "IDX_audits_tableName"`);
    await queryRunner.query(`DROP INDEX "IDX_audits_userId"`);

    const table = await queryRunner.getTable('audits');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('userId') !== -1,
    );
    await queryRunner.dropForeignKey('audits', foreignKey);

    await queryRunner.dropTable('audits');
    await queryRunner.query(`DROP TYPE "audit_action_enum"`);
  }
}
