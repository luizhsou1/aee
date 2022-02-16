import { sign } from 'jsonwebtoken'
import { inject, singleton } from 'tsyringe'

import { getJwtExpiresIn, getJwtSecret } from '../../shared/utils'
import { IDomainService } from '../domain.service'
import { User, IUserRepo, UserToken, TokenType, UserRole } from '../user'

export const generateAccessToken = (payload: { userId: number, email: string, name: string, role: UserRole, expiresIn?: string }) => sign(payload, getJwtSecret(), {
  subject: payload.userId.toString(),
  expiresIn: payload.expiresIn || getJwtExpiresIn()
})

export interface IGenerateAccessAndRefreshTokenReturn {
  accessToken: string,
  refreshToken: string
}

@singleton()
export class GenerateAccessAndRefreshToken implements IDomainService {
  constructor (
    @inject('IUserRepo')
    private readonly userRepo: IUserRepo
  ) {}

  /**
   * @throws ValidationError
   * @throws EmailOrPasswordIncorrectError
   */
  async execute (user: User): Promise<IGenerateAccessAndRefreshTokenReturn> {
    const accessToken = generateAccessToken({
      userId: user.getId() as number,
      email: user.getEmail(),
      name: user.getName(),
      role: user.getRole()
    })

    const userRefreshToken = UserToken.create(user, TokenType.REFRESH_TOKEN)
    const refreshToken = userRefreshToken.getToken()

    await this.userRepo.saveUserToken(userRefreshToken)

    return { accessToken, refreshToken }
  }
}
