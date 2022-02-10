import { DomainError } from './domain.error'

export class ForbiddenError extends DomainError {
  constructor (
    message: string,
    details?: any
  ) {
    super(message, 403, details)
  }
}
