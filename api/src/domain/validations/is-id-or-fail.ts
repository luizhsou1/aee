import { ValidationError } from '../errors'

/**
 * @throws ValidationError
 */
export const isIdOrFail = (id: unknown) => {
  if (isNaN(Number(id))) {
    throw new ValidationError(`Id '${id}' is not a numeric value`)
  }
}
