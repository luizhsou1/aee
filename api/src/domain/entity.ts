import { Expose } from 'class-transformer'
import { validateOrReject } from 'class-validator'

import { ValidationError } from './errors'

interface IValidateOptions {
  skipMissingProperties?: boolean
}

export class Entity {
  @Expose() private id?: number
  @Expose() private createdAt?: Date
  @Expose() private updatedAt?: Date

  /**
   * @param skipMissingProperties Caso true, pula campos 'undefined'
   * @throws ValidationError
   */
  async validateOrFail ({
    skipMissingProperties = false
  }: IValidateOptions = {}) {
    try {
      await validateOrReject(this, { skipMissingProperties })
    } catch (errors: any) {
      throw new ValidationError(
        'One or more input validation errors occurred',
        undefined,
        errors
      )
    }
  }
}
