
import { Expose } from 'class-transformer'
import { IsEmail, IsNotEmpty } from 'class-validator'
import { inject, singleton } from 'tsyringe'

import { GenerateAccessAndRefreshToken, IGenerateAccessAndRefreshTokenReturn } from '../../domain/auth'
import { EmailOrPasswordIncorrectError } from '../../domain/auth/auth.errors'
import { IUserRepo, User } from '../../domain/user'
import { validateOrFail } from '../../domain/validations'
import { getInstanceOf, getJwtExpiresIn, getJwtSecret } from '../../shared/utils'
import { IApplicationService } from '../application.service'

class SignInInput {
  @Expose() @IsEmail()
  private email: string

  @Expose() @IsNotEmpty()
  private password: string
}
@singleton()
export class SignIn implements IApplicationService {
  private static readonly JWT_SECRET = getJwtSecret()
  private static readonly JWT_EXPIRES_IN = getJwtExpiresIn()

  constructor (
    @inject('IUserRepo')
    private readonly userRepo: IUserRepo,
    private readonly generateAccessAndRefreshToken: GenerateAccessAndRefreshToken
  ) {}

  /**
   * @throws ValidationError
   * @throws EmailOrPasswordIncorrectError
   */
  async execute (email: string, password: string): Promise<IGenerateAccessAndRefreshTokenReturn & { user: User }> {
    await validateOrFail(getInstanceOf(SignInInput, { email, password }))

    const user = await this.userRepo.findByEmail(email)
    if (!user) {
      throw new EmailOrPasswordIncorrectError()
    }

    const passwordIsEqual = await user.passwordIsEqual(password)
    if (!passwordIsEqual) {
      throw new EmailOrPasswordIncorrectError()
    }

    const tokens = await this.generateAccessAndRefreshToken.execute(user)

    user.clearPassword()

    return { ...tokens, user }
  }
}
