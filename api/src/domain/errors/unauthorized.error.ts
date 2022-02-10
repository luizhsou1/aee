import { DomainError } from './domain.error'

export class UnauthorizedError extends DomainError {
  constructor (
    message: string,
    details?: any
  ) {
    super(message, 401, details)
  }
}
