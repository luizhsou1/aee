import { validateOrReject } from 'class-validator'

import { ValidationError } from '../errors'

export interface IValidateOptions {
  skipMissingProperties?: boolean
}

/**
 * @param options.skipMissingProperties Caso true, pula campos 'undefined'
 * @throws ValidationError
 */
export const validateOrFail = async (input: object, options: IValidateOptions = {}) => {
  const { skipMissingProperties = false } = options
  try {
    await validateOrReject(input, { skipMissingProperties })
  } catch (errors: any) {
    throw new ValidationError(
      'One or more input validation errors occurred',
      undefined,
      errors
    )
  }
}
