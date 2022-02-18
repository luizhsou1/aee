import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateTablesDeficiencyAndUserAndUserToken1644971211079 implements MigrationInterface {
    name = 'CreateTablesDeficiencyAndUserAndUserToken1644971211079'

    public async up (queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('CREATE TABLE "deficiency" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, CONSTRAINT "pk_deficiency" PRIMARY KEY ("id"))')
      await queryRunner.query('CREATE TYPE "public"."user_token_type_enum" AS ENUM(\'RECOVER_PASSWORD_TOKEN\', \'REFRESH_TOKEN\')')
      await queryRunner.query('CREATE TABLE "user_token" ("token" text NOT NULL, "type" "public"."user_token_type_enum" NOT NULL, "expiration_date" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "pk_user_token" PRIMARY KEY ("token"))')
      await queryRunner.query('CREATE TYPE "public"."user_role_enum" AS ENUM(\'ADMIN\', \'COORDINATOR\', \'TEACHER\')')
      await queryRunner.query('CREATE TABLE "user" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "email" text NOT NULL, "password" text NOT NULL, "name" text NOT NULL, "role" "public"."user_role_enum" NOT NULL, CONSTRAINT "uq_user_email" UNIQUE ("email"), CONSTRAINT "pk_user" PRIMARY KEY ("id"))')
      await queryRunner.query('ALTER TABLE "user_token" ADD CONSTRAINT "fk_user_token_userId" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION')
    }

    public async down (queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query('ALTER TABLE "user_token" DROP CONSTRAINT "fk_user_token_userId"')
      await queryRunner.query('DROP TABLE "user"')
      await queryRunner.query('DROP TYPE "public"."user_role_enum"')
      await queryRunner.query('DROP TABLE "user_token"')
      await queryRunner.query('DROP TYPE "public"."user_token_type_enum"')
      await queryRunner.query('DROP TABLE "deficiency"')
    }
}
