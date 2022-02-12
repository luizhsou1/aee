import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'
import { inject, singleton } from 'tsyringe'

import { ExpiredTokenError, PasswordIsEqualError } from '.'
import { IUserRepo, IsPassword, TokenType } from '../../domain'
import { validateOrFail } from '../../domain/validations'
import { getAppBaseUrl, getInstanceOf } from '../../shared/utils'
import { IApplicationService } from '../application.service'
import { TokenNotFoundError } from './auth.errors'

class ResetPasswordInput {
  @Expose() @IsNotEmpty()
  private token: string

  @Expose() @IsNotEmpty() @IsPassword()
  private password: string
}

@singleton()
export class ResetPassword implements IApplicationService {
  private readonly appBaseUrl = getAppBaseUrl()

  constructor (
    @inject('IUserRepo')
    private readonly userRepo: IUserRepo
  ) {}

  /**
   * @throws ValidationError
   * @throws TokenNotFoundError
   * @throws ExpiredTokenError
   */
  async execute (token: string, password: string): Promise<void> {
    await validateOrFail(getInstanceOf(ResetPasswordInput, { token, password }))

    const userToken = await this.userRepo.findUserToken({ token, type: TokenType.RECOVER_PASSWORD_TOKEN })
    if (!userToken) {
      throw new TokenNotFoundError('Recover password token não encontrado')
    }

    if (userToken.isExpired()) {
      await this.userRepo.deleteUserToken(userToken)
      throw new ExpiredTokenError('Reset password token expirado!')
    }

    const user = userToken.getUser()
    const passwordIsEqual = await user.passwordIsEquals(password)
    if (passwordIsEqual) {
      throw new PasswordIsEqualError()
    }

    await user.setAndHashPassword(password)
    await this.userRepo.save(user)

    await this.userRepo.deleteUserToken(userToken)
  }
}
