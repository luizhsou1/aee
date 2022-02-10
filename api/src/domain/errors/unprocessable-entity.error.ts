import { DomainError } from './domain.error'

export class UnprocessableEntityError extends DomainError {
  constructor (
    message: string,
    details?: any
  ) {
    super(message, 422, details)
  }
}
