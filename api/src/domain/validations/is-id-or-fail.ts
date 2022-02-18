import { ValidationError } from '../errors'

/**
 * @throws ValidationError
 */
export const isIdOrFail = (id: unknown) => {
  if (isNaN(Number(id)) || Number(id) < 0) {
    throw new ValidationError(`Id '${id}' is not a numeric positive value`)
  }
}
