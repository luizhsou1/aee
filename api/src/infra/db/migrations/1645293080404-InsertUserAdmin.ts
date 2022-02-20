import { MigrationInterface, QueryRunner } from 'typeorm'

export class InsertUserAdmin1645293080404 implements MigrationInterface {
  private readonly email = 'admin@projetoaee.com.br'
  public async up (qr: QueryRunner): Promise<void> {
    // Deve ser alterado em produção a senha do admin obviamente, é só para facilitar e ter um primeiro usuário, que acessa todas as rotas privadas
    // porque se não, nem daria para criar outros usuários via aplicação, teria o trabalho de fazer insert no banco
    await qr.query(`INSERT INTO public."user" (email, "password", name, "role")
      VALUES('${this.email}', '$2b$08$OVeoiOwOopbbNSux2w4WyuTtCK6cdAx4Uvu0aAVX3./V8LVqrtZZi', 'AEE Admin', 'ADMIN'::user_role_enum);`)
  }

  public async down (qr: QueryRunner): Promise<void> {
    await qr.query(`DELETE FROM public."user" WHERE email = '${this.email}'`)
  }
}
