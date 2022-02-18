import { DomainError } from './domain.error'

export class ValidationError extends DomainError {
  constructor (
    message: string,
    readonly property?: string,
    details?: any
  ) {
    super(message, 400, details)
  }
}
