import { sign } from 'jsonwebtoken'
import { inject, singleton } from 'tsyringe'

import { User, IUserRepo, UserToken, TokenType } from '.'
import { getJwtExpiresIn, getJwtSecret } from '../../shared/utils'
import { IDomainService } from '../domain.service'

export interface IGenerateTokensReturn {
  user: User,
  accessToken: string,
  refreshToken: string
}

@singleton()
export class GenerateTokens implements IDomainService {
  private static readonly JWT_SECRET = getJwtSecret()
  private static readonly JWT_EXPIRES_IN = getJwtExpiresIn()

  constructor (
    @inject('IUserRepo')
    private readonly userRepo: IUserRepo
  ) {}

  /**
   * @throws ValidationError
   * @throws EmailOrPasswordIncorrectError
   */
  async execute (user: User): Promise<IGenerateTokensReturn> {
    user.clearPassword()

    const accessToken = sign(
      {
        email: user.getEmail(),
        name: user.getName(),
        role: user.getRole()
      },
      GenerateTokens.JWT_SECRET,
      {
        subject: user.getId()?.toString(),
        expiresIn: GenerateTokens.JWT_EXPIRES_IN
      })

    const userRefreshToken = UserToken.create(user, TokenType.REFRESH_TOKEN)
    const refreshToken = userRefreshToken.getToken()

    await this.userRepo.saveUserToken(userRefreshToken)

    return { user, accessToken, refreshToken }
  }
}
