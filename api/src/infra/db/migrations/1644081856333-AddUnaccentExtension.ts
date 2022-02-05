import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddUnaccentExtension1644081856333 implements MigrationInterface {
  public async up (qr: QueryRunner): Promise<void> {
    await qr.query('CREATE EXTENSION IF NOT EXISTS "unaccent";')
  }

  public async down (qr: QueryRunner): Promise<void> {
    await qr.query('DROP EXTENSION IF EXISTS "unaccent";')
  }
}
