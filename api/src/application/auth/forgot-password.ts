import { Expose } from 'class-transformer'
import { IsEmail } from 'class-validator'
import { inject, singleton } from 'tsyringe'

import { IUserRepo, UserNotFoundError, UserToken } from '../../domain'
import { validateOrFail } from '../../domain/validations'
import { getAppBaseUrl, getInstanceOf } from '../../shared/utils'
import { IApplicationService } from '../application.service'
import { IEmailProvider } from '../providers'

class ForgotPasswordInput {
  @Expose() @IsEmail()
  private email: string
}

@singleton()
export class ForgotPassword implements IApplicationService {
  private readonly appBaseUrl = getAppBaseUrl()

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

    const userToken = UserToken.createRecoverPasswordToken(user)

    await this.userRepo.saveUserToken(userToken)

    await this.emailProvider.send(
      email,
      'Recuperação de senha',
      'forgot-password', {
        name: user.getName(),
        link: `${this.appBaseUrl}/password/reset?token=${userToken.getToken()}`
      })
  }
}
