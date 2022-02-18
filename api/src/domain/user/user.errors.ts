import { NotFoundError, UnprocessableEntityError } from '../errors'

export class UserNotFoundError extends NotFoundError {
  constructor () {
    super('Usuário não encontrado')
  }
}

export class UserEmailAlreadyExistsError extends UnprocessableEntityError {
  constructor (email: string) {
    super(`Email '${email}' já cadastrado para outro usuário`)
  }
}
