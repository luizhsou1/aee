import { ForbiddenError, NotFoundError, UnauthorizedError, UnprocessableEntityError } from '../errors'
import { UserRole } from '../user'

export class InvalidTokenError extends UnauthorizedError {
  constructor () {
    super('Invalid authentication token!')
  }
}

export class ExpiredTokenError extends ForbiddenError {
  constructor (message: string) {
    super(message)
  }
}

export class AuthorizationError extends ForbiddenError {
  constructor (role: UserRole) {
    super(`Need be at least '${role}' to access this route!`)
  }
}

export class EmailOrPasswordIncorrectError extends UnauthorizedError {
  constructor () {
    super('Usuário ou senha incorreto!')
  }
}

export class TokenNotFoundError extends NotFoundError {
  constructor (message: string) {
    super(message)
  }
}

export class PasswordIsEqualError extends UnprocessableEntityError {
  constructor () {
    super('Senha é a mesma já existente')
  }
}
