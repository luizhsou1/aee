import { Expose } from 'class-transformer'
import { IsEmail } from 'class-validator'
import { inject, singleton } from 'tsyringe'

import { IUserRepo, TokenType, UserNotFoundError, UserToken } from '../../domain/user'
import { validateOrFail } from '../../domain/validations'
import { Logger } from '../../shared/logger'
import { getAppBaseUrl, getInstanceOf } from '../../shared/utils'
import { IApplicationService } from '../application.service'
import { IEmailProvider } from '../providers'

class ForgotPasswordInput {
  @Expose() @IsEmail()
  private email: string
}

@singleton()
export class ForgotPassword implements IApplicationService {
  private readonly logger = new Logger(ForgotPassword.name)
  private static readonly APP_BASE_URL = getAppBaseUrl()

  constructor (
    @inject('IUserRepo')
    private readonly userRepo: IUserRepo,
    @inject('IEmailProvider')
    private readonly emailProvider: IEmailProvider
  ) {}

  /**
   * @throws ValidationError
   * @throws UserNotFoundError
   */
  async execute (email: string): Promise<void> {
    await validateOrFail(getInstanceOf(ForgotPasswordInput, { email }))

    const user = await this.userRepo.findByEmail(email)
    if (!user) {
      throw new UserNotFoundError()
    }

    const userRecoverPasswordToken = UserToken.create(user, TokenType.RECOVER_PASSWORD_TOKEN)

    await this.userRepo.saveUserToken(userRecoverPasswordToken)

    this.logger.info(`Generate recover password token for user with email '${email}' with successfully`)

    await this.emailProvider.send(
      email,
      'Recuperação de senha',
      'forgot-password', {
        name: user.getName(),
        link: `${ForgotPassword.APP_BASE_URL}/password/reset?token=${userRecoverPasswordToken.getToken()}`
      })
  }
}
