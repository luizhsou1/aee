
import { Expose } from 'class-transformer'
import { IsEmail, IsNotEmpty } from 'class-validator'
import { inject, singleton } from 'tsyringe'

import { IUserRepo, IsPassword } from '../../domain'
import { GenerateTokens, IGenerateTokensReturn } from '../../domain/user/generate-tokens.service'
import { validateOrFail } from '../../domain/validations'
import { getInstanceOf, getJwtExpiresIn, getJwtSecret } from '../../shared/utils'
import { IApplicationService } from '../application.service'
import { EmailOrPasswordIncorrectError } from './auth.errors'

class SignInInput {
  @Expose() @IsEmail()
  private email: string

  @Expose() @IsNotEmpty() @IsPassword()
  private password: string
}
@singleton()
export class SignIn implements IApplicationService {
  private static readonly JWT_SECRET = getJwtSecret()
  private static readonly JWT_EXPIRES_IN = getJwtExpiresIn()

  constructor (
    @inject('IUserRepo')
    private readonly userRepo: IUserRepo,
    private readonly generateTokens: GenerateTokens
  ) {}

  /**
   * @throws ValidationError
   * @throws EmailOrPasswordIncorrectError
   */
  async execute (email: string, password: string): Promise<IGenerateTokensReturn> {
    await validateOrFail(getInstanceOf(SignInInput, { email, password }))

    const user = await this.userRepo.findByEmail(email)
    if (!user) {
      throw new EmailOrPasswordIncorrectError()
    }

    const passwordIsEqual = await user.passwordIsEquals(password)
    if (!passwordIsEqual) {
      throw new EmailOrPasswordIncorrectError()
    }

    return this.generateTokens.execute(user)
  }
}
