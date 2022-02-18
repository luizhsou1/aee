import { DomainError } from './domain.error'

export class NotFoundError extends DomainError {
  constructor (
    message: string,
    details?: any
  ) {
    super(message, 404, details)
  }
}
