import { ValidationError } from '../../domain/errors'

/**
 * @throws Error
 */
export const isNumericOrFail = (value: string | number, error?: Error) => {
  if (isNaN(Number(value))) {
    throw error || new ValidationError(`'${value}' não é um valor numérico`)
  }
}

/**
 * @throws Error
 */
export const isPositiveOrFail = (value: number, error?: Error) => {
  if (value <= 0) {
    throw error || new ValidationError(`'${value}' não é um valor maior que 0`)
  }
}
