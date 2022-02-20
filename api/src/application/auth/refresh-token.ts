
import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'
import { inject, singleton } from 'tsyringe'

import {
  ExpiredTokenError,
  TokenNotFoundError,
  GenerateAccessAndRefreshToken,
  IGenerateAccessAndRefreshTokenReturn
} from '../../domain/auth'
import { IUserRepo, TokenType, User } from '../../domain/user'
import { validateOrFail } from '../../domain/validations'
import { Logger } from '../../shared/logger'
import { getInstanceOf } from '../../shared/utils'
import { IApplicationService } from '../application.service'

class RefreshTokenInput {
  @Expose() @IsNotEmpty()
  private refreshToken: string
}

@singleton()
export class RefreshToken implements IApplicationService {
  private readonly logger = new Logger(RefreshToken.name)

  constructor (
    @inject('IUserRepo')
    private readonly userRepo: IUserRepo,
    private readonly generateAccessAndRefreshToken: GenerateAccessAndRefreshToken
  ) {}

  /**
   * @throws ValidationError
   * @throws TokenNotFoundError
   * @throws ExpiredTokenError
   */
  async execute (refreshToken: string): Promise<IGenerateAccessAndRefreshTokenReturn & { user: User }> {
    await validateOrFail(getInstanceOf(RefreshTokenInput, { refreshToken }))

    const userRefreshToken = await this.userRepo.findUserToken({ token: refreshToken, type: TokenType.REFRESH_TOKEN })
    if (!userRefreshToken) {
      throw new TokenNotFoundError('Refresh token não encontrado')
    }

    if (userRefreshToken.isExpired()) {
      await this.userRepo.deleteUserToken(userRefreshToken)
      throw new ExpiredTokenError('Refresh token expirado!')
    }

    const user = userRefreshToken.getUser()
    user.clearPassword()

    const tokens = await this.generateAccessAndRefreshToken.execute(userRefreshToken.getUser())

    this.logger.debug(`Generate access tokens by refresh for user with email '${user.getEmail()}' token with successfully`)

    await this.userRepo.deleteUserToken(userRefreshToken)

    return { ...tokens, user }
  }
}
