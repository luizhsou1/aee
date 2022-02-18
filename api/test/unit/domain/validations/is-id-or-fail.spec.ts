
import { ValidationError } from '../../../../src/domain/errors'
import { isIdOrFail } from '../../../../src/domain/validations'

describe('isIdOrFail | Validation', () => {
  it('Should return undefined if success validation', () => {
    expect(isIdOrFail(1)).toBeUndefined()
    expect(isIdOrFail('1')).toBeUndefined()
  })

  it('Should throws ValidationError if fails validation', () => {
    expect(() => isIdOrFail(-1)).toThrow(ValidationError)
    expect(() => isIdOrFail('-1')).toThrow(ValidationError)
    expect(() => isIdOrFail('abc123')).toThrow(ValidationError)
  })
})
