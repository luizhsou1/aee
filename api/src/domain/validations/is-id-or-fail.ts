import { isNumericOrFail } from '../../shared/utils'
import { ValidationError } from '../errors'

/**
 * @throws ValidationError
 */
export const isIdOrFail = (id: number | string) => isNumericOrFail(id, new ValidationError(`Id '${id}' não é um valor numérico`))
