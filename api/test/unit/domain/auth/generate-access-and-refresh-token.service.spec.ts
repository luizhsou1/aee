import { container } from 'tsyringe'

import { GenerateAccessAndRefreshToken } from '../../../../src/domain/auth'
import { User, UserToken, TokenType } from '../../../../src/domain/user'
import { getInstanceOf } from '../../../../src/shared/utils'

describe('GenerateTokens | DomainService', () => {
  let generateAccessAndRefreshToken: GenerateAccessAndRefreshToken

  const user = getInstanceOf(User, {
    id: 1,
    email: 'maria.silva@mail.com',
    password: 'projetoaee2022',
    name: 'Maria da Silva',
    role: 'COORDINATOR'
  })

  const mockUserRepo = {
    saveUserToken: jest.fn().mockResolvedValue(UserToken.create(user, TokenType.REFRESH_TOKEN))
  }

  beforeAll(() => {
    container.registerInstance('IUserRepo', mockUserRepo)

    generateAccessAndRefreshToken = container.resolve(GenerateAccessAndRefreshToken)
  })

  it('should generate access and refresh token', async () => {
    const result = await generateAccessAndRefreshToken.execute(user)

    expect(mockUserRepo.saveUserToken).toBeCalledWith(expect.any(UserToken))
    expect(result).toEqual(expect.objectContaining({
      accessToken: expect.any(String),
      refreshToken: expect.any(String)
    }))
  })

  it('should pass exception to front if "IUserRepo.saveUserToken" throws exception', async () => {
    mockUserRepo.saveUserToken.mockRejectedValueOnce(new Error())

    const promise = generateAccessAndRefreshToken.execute(user)
    await expect(promise)
      .rejects
      .toThrow(Error)
  })
})
