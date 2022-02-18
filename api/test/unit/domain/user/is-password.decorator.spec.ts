// @ts-nocheck
import { Expose } from 'class-transformer'

import { ValidationError } from '../../../../src/domain/errors'
import { IsPassword } from '../../../../src/domain/user'
import { validateOrFail } from '../../../../src/domain/validations'
import { getInstanceOf } from '../../../../src/shared/utils'

class PasswordTest {
  @Expose() @IsPassword() private password: string
}

describe('IsPassword | Decorator', () => {
  it('should validate isPassword in object', async () => {
    const passwordTest = getInstanceOf(PasswordTest, { password: 'projetoaee2022' })

    await expect(validateOrFail(passwordTest))
      .resolves
      .toBeUndefined()
  })

  it('should throws "ValidationError" to pass invalid passwords', async () => {
    let passwordTest = getInstanceOf(PasswordTest, { password: '1234567890' })
    await expect(validateOrFail(passwordTest))
      .rejects
      .toThrow(ValidationError)

    passwordTest = getInstanceOf(PasswordTest, { password: 'abcdefghij' })
    await expect(validateOrFail(passwordTest))
      .rejects
      .toThrow(ValidationError)

    passwordTest = getInstanceOf(PasswordTest, { password: 'abc123' })
    await expect(validateOrFail(passwordTest))
      .rejects
      .toThrow(ValidationError)

    passwordTest = getInstanceOf(PasswordTest, { password: 'password_is_very_very_very_large_123' })
    await expect(validateOrFail(passwordTest))
      .rejects
      .toThrow(ValidationError)
  })
})
