import { IValidateOptions, validateOrFail } from './validations'

export abstract class Validator {
  /**
   * @param skipMissingProperties Caso true, pula campos 'undefined'
   * @throws ValidationError
   */
  async validateOrFail (options?: IValidateOptions) {
    await validateOrFail(this, options)
  }
}
