// @ts-nocheck
import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

import { ValidationError } from '../../../../src/domain/errors'
import { validateOrFail } from '../../../../src/domain/validations'
import { getInstanceOf } from '../../../../src/shared/utils'

class ValidateOrFailTest {
  @Expose() @IsNotEmpty()
  private field: string
}

describe('validateOrFail | Validation', () => {
  it('Should return undefined if success validation', async () => {
    expect(await validateOrFail(getInstanceOf(ValidateOrFailTest, { field: 'test' })))
      .toBeUndefined()
    expect(await validateOrFail(getInstanceOf(ValidateOrFailTest, { field: 'test' }), { skipMissingProperties: true }))
      .toBeUndefined()
    expect(await validateOrFail(getInstanceOf(ValidateOrFailTest, {}), { skipMissingProperties: true }))
      .toBeUndefined()
  })

  it('Should throws ValidationError if fails validation', async () => {
    await expect(validateOrFail(getInstanceOf(ValidateOrFailTest, {})))
      .rejects
      .toThrow(ValidationError)
    await expect(validateOrFail(getInstanceOf(ValidateOrFailTest, { field: '' })))
      .rejects
      .toThrow(ValidationError)
  })
})
