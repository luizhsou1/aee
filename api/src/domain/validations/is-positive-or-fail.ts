import { ValidationError } from '../errors'

/**
 * @throws ValidationError
 */
export const isPositiveOrFail = (value: number, field: string, error?: Error) => {
  if (value <= 0) {
    throw error || new ValidationError(`Field '${field} with value '${value}' is not a value greater than 0`)
  }
}
