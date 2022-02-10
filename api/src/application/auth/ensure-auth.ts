import { verify } from 'jsonwebtoken'
import { singleton } from 'tsyringe'

import { User, UserRole } from '../../domain'
import { ForbiddenError } from '../../domain/errors'
import { getInstanceOf, getJwtSecret } from '../../shared/utils'
import { IApplicationService } from '../application.service'
import { AuthorizationError, ExpiredTokenError, InvalidTokenError } from './auth.errors'

@singleton()
export class EnsureAuth implements IApplicationService {
  private readonly jwtSecret = getJwtSecret()

  /**
   * @throws ValidationError
   * @throws InvalidTokenError
   * @throws ExpiredTokenError
   * @throws AuthorizationError
   */
  execute (bearerToken: string, role: UserRole): User {
    const checkAuthorizationOrFail = (userRole: UserRole) => {
      switch (role) {
        case UserRole.ADMIN:
          if (userRole !== UserRole.ADMIN) {
            throw new AuthorizationError(UserRole.ADMIN)
          }
          break
        case UserRole.COORDINATOR:
          if (![UserRole.ADMIN, UserRole.COORDINATOR].includes(userRole)) {
            throw new AuthorizationError(UserRole.COORDINATOR)
          }
          break
        case UserRole.TEACHER:
          if (![UserRole.ADMIN, UserRole.COORDINATOR, UserRole.TEACHER].includes(userRole)) {
            throw new AuthorizationError(UserRole.TEACHER)
          }
          break
      }
    }

    const [, token] = bearerToken.split(' ')

    try {
      const {
        sub: userId,
        email,
        name,
        role: userRole
      } = verify(token, this.jwtSecret) as { sub: string, email: string, name: string, role: UserRole }

      checkAuthorizationOrFail(userRole)

      return getInstanceOf(User, {
        id: Number(userId),
        email,
        name,
        role: userRole
      })
    } catch (err: any) {
      if (err instanceof ForbiddenError) {
        throw err
      }
      if (err.name === 'TokenExpiredError') {
        throw new ExpiredTokenError('Authentication token expired!')
      }
      throw new InvalidTokenError()
    }
  }
}
