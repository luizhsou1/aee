import { container } from 'tsyringe'

import { RefreshToken } from '../../../../src/application/auth'
import { ExpiredTokenError, GenerateAccessAndRefreshToken, TokenNotFoundError } from '../../../../src/domain/auth'
import { TokenType, User, UserToken } from '../../../../src/domain/user'
import { getInstanceOf, subtractDaysInDate } from '../../../../src/shared/utils'

describe('RefreshToken | ApplicationService', () => {
  let refreshToken: RefreshToken

  const userFake = getInstanceOf(User, {
    id: 1,
    email: 'maria.silva@mail.com',
    password: 'projetoaee2022',
    name: 'Maria da Silva',
    role: 'COORDINATOR'
  })

  const mockUserRepo = {
    findUserToken: jest.fn().mockResolvedValue(UserToken.create(userFake, TokenType.REFRESH_TOKEN)),
    deleteUserToken: jest.fn().mockResolvedValue(undefined)
  }

  const mockGenerateAccessAndRefreshToken = {
    execute: jest.fn().mockResolvedValue({ accessToken: 'some_access_token', refreshToken: 'some_refresh_token' })
  }

  beforeAll(() => {
    container.registerInstance('IUserRepo', mockUserRepo)
    // @ts-ignore
    container.registerInstance(GenerateAccessAndRefreshToken, mockGenerateAccessAndRefreshToken)

    refreshToken = container.resolve(RefreshToken)
  })

  afterAll(() => {
    container.clearInstances()
  })

  it('should be able to generate tokens from refresh token', async () => {
    const result = await refreshToken.execute('refresh_token')

    expect(mockUserRepo.findUserToken).toHaveBeenCalledWith({ token: 'refresh_token', type: TokenType.REFRESH_TOKEN })
    expect(mockUserRepo.deleteUserToken).toHaveBeenCalledWith(expect.any(UserToken))
    expect(mockGenerateAccessAndRefreshToken.execute).toHaveBeenCalledWith(expect.any(User))
    expect(result).toMatchObject({
      accessToken: 'some_access_token',
      refreshToken: 'some_refresh_token',
      user: expect.objectContaining({
        id: 1,
        email: 'maria.silva@mail.com',
        name: 'Maria da Silva',
        role: 'COORDINATOR'
      })
    })
    // @ts-ignore
    expect(result.user.password).toBeUndefined()
  })

  it('should throw "TokenNotFoundError" if user token not found', async () => {
    mockUserRepo.findUserToken.mockResolvedValueOnce(undefined)
    await expect(refreshToken.execute('refresh_token'))
      .rejects
      .toThrow(new TokenNotFoundError('Refresh token não encontrado'))
  })

  it('should throw "ExpiredTokenError" if user token expired', async () => {
    const userTokenFake2 = UserToken.create(userFake, TokenType.REFRESH_TOKEN)
    const expirationDate = new Date()
    subtractDaysInDate(expirationDate, 1)
    // @ts-ignore
    userTokenFake2.expirationDate = expirationDate

    mockUserRepo.findUserToken.mockResolvedValueOnce(userTokenFake2)

    try {
      await refreshToken.execute('refresh_token')
      throw new Error('fails because it was not catch')
    } catch (err) {
      expect(mockUserRepo.deleteUserToken).toHaveBeenCalledWith(expect.any(UserToken))
      expect(err).toEqual(new ExpiredTokenError('Refresh token expirado!'))
    }
  })

  it('should pass exception to front if "IUserRepo.save" throws exception', async () => {
    mockUserRepo.deleteUserToken.mockRejectedValueOnce(new Error())

    const promise = refreshToken.execute('refresh_token')
    await expect(promise)
      .rejects
      .toThrow(Error)
  })
})
