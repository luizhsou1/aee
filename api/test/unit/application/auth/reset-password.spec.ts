import { container } from 'tsyringe'

import { ResetPassword } from '../../../../src/application/auth'
import { ExpiredTokenError, PasswordIsEqualError, TokenNotFoundError } from '../../../../src/domain/auth'
import { TokenType, User, UserToken } from '../../../../src/domain/user'
import { getInstanceOf, subtractDaysInDate } from '../../../../src/shared/utils'

describe('ResetPassword | ApplicationService', () => {
  let resetPassword: ResetPassword

  const userData = {
    id: 1,
    email: 'maria.silva@mail.com',
    password: 'projetoaee2022',
    name: 'Maria da Silva',
    role: 'COORDINATOR'
  }
  const userFake = getInstanceOf(User, userData)

  const mockUserRepo = {
    findUserToken: jest.fn().mockResolvedValue(UserToken.create(userFake, TokenType.REFRESH_TOKEN)),
    save: jest.fn().mockResolvedValue(userFake),
    deleteUserToken: jest.fn().mockResolvedValue(undefined)
  }

  beforeAll(async () => {
    await userFake.hashPassword()

    container.registerInstance('IUserRepo', mockUserRepo)

    resetPassword = container.resolve(ResetPassword)
  })

  afterAll(() => {
    container.clearInstances()
  })

  it('should be able reset password by token', async () => {
    const result = await resetPassword.execute('recover_password_token', '2022projetoaee')

    expect(mockUserRepo.findUserToken).toHaveBeenCalledWith({ token: 'recover_password_token', type: TokenType.RECOVER_PASSWORD_TOKEN })
    expect(mockUserRepo.save).toHaveBeenCalledWith(expect.any(User))
    expect(mockUserRepo.save).toHaveBeenCalledWith(expect.objectContaining({
      password: expect.stringMatching(/^\$2b\$08\$/) // Check be password hashed with 8 salt rounds
    }))
    expect(mockUserRepo.deleteUserToken).toHaveBeenCalledWith(expect.any(UserToken))
    expect(result).toBeUndefined()
  })

  it('should throw "TokenNotFoundError" if user token not found', async () => {
    mockUserRepo.findUserToken.mockResolvedValueOnce(undefined)
    await expect(resetPassword.execute('recover_password_token', '2022projetoaee'))
      .rejects
      .toThrow(new TokenNotFoundError('Recover password token não encontrado'))
  })

  it('should throw "ExpiredTokenError" if user token expired', async () => {
    const userTokenFake2 = UserToken.create(userFake, TokenType.REFRESH_TOKEN)
    const expirationDate = new Date()
    subtractDaysInDate(expirationDate, 1)
    // @ts-ignore
    userTokenFake2.expirationDate = expirationDate

    mockUserRepo.findUserToken.mockResolvedValueOnce(userTokenFake2)

    try {
      await resetPassword.execute('recover_password_token', '2022projetoaee')
      throw new Error('fails because it was not catch')
    } catch (err) {
      expect(mockUserRepo.deleteUserToken).toHaveBeenCalledWith(expect.any(UserToken))
      expect(err).toEqual(new ExpiredTokenError('Recover password token expirado!'))
    }
  })

  it('should throw "PasswordIsEqualError" if user password is equal new password', async () => {
    const userFake2 = getInstanceOf(User, userData)
    await userFake2.hashPassword()

    mockUserRepo.findUserToken.mockResolvedValueOnce(UserToken.create(userFake2, TokenType.REFRESH_TOKEN))

    await expect(resetPassword.execute('recover_password_token', 'projetoaee2022'))
      .rejects
      .toThrow(PasswordIsEqualError)
  })

  it('should pass exception to front if "IUserRepo.save" throws exception', async () => {
    mockUserRepo.deleteUserToken.mockRejectedValueOnce(new Error())

    const promise = resetPassword.execute('recover_password_token', '2022projetoaee')
    await expect(promise)
      .rejects
      .toThrow(Error)
  })
})
