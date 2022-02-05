export class DomainError extends Error {
  readonly error: string
  constructor (
    message: string,
    readonly code: number,
    readonly details?: any
  ) {
    super(message)
    this.error = this.constructor.name
  }
}
