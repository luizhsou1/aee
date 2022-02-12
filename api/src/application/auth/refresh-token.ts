
import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'
import { inject, singleton } from 'tsyringe'

import { ExpiredTokenError, TokenNotFoundError } from '.'
import { IUserRepo, TokenType } from '../../domain'
import { GenerateTokens, IGenerateTokensReturn } from '../../domain/user/generate-tokens.service'
import { validateOrFail } from '../../domain/validations'
import { getInstanceOf } from '../../shared/utils'
import { IApplicationService } from '../application.service'

class RefreshTokenInput {
  @Expose() @IsNotEmpty()
  private refreshToken: string
}

@singleton()
export class RefreshToken implements IApplicationService {
  constructor (
    @inject('IUserRepo')
    private readonly userRepo: IUserRepo,
    private readonly generateTokens: GenerateTokens
  ) {}

  /**
   * @throws ValidationError
   * @throws TokenNotFoundError
   * @throws ExpiredTokenError
   */
  async execute (refreshToken: string): Promise<IGenerateTokensReturn> {
    await validateOrFail(getInstanceOf(RefreshTokenInput, { refreshToken }))

    const userRefreshToken = await this.userRepo.findUserToken({ token: refreshToken, type: TokenType.REFRESH_TOKEN })
    if (!userRefreshToken) {
      throw new TokenNotFoundError('Refresh token não encontrado')
    }

    if (userRefreshToken.isExpired()) {
      await this.userRepo.deleteUserToken(userRefreshToken)
      throw new ExpiredTokenError('Refresh token expirado!')
    }

    const result = this.generateTokens.execute(userRefreshToken.getUser())

    await this.userRepo.deleteUserToken(userRefreshToken)

    return result
  }
}
