import { container } from 'tsyringe'

import { SignIn } from '../../../../src/application/auth'
import { EmailOrPasswordIncorrectError, GenerateAccessAndRefreshToken } from '../../../../src/domain/auth'
import { ValidationError } from '../../../../src/domain/errors'
import { User } from '../../../../src/domain/user'
import { getInstanceOf } from '../../../../src/shared/utils'

describe('SignIn | ApplicationService', () => {
  let signIn: SignIn

  const emailFake = 'maria.silva@mail.com'
  const passwordFake = 'projetoaee2022'
  const userFake = getInstanceOf(User, {
    id: 1,
    email: emailFake,
    password: passwordFake,
    name: 'Maria da Silva',
    role: 'COORDINATOR'
  })

  const mockUserRepo = {
    findByEmail: jest.fn().mockResolvedValue(userFake),
    deleteUserToken: jest.fn().mockResolvedValue(undefined)
  }

  const mockGenerateAccessAndRefreshToken = {
    execute: jest.fn().mockResolvedValue({ accessToken: 'some_access_token', refreshToken: 'some_refresh_token' })
  }

  beforeAll(async () => {
    await userFake.hashPassword()
    container.registerInstance('IUserRepo', mockUserRepo)
    // @ts-ignore
    container.registerInstance(GenerateAccessAndRefreshToken, mockGenerateAccessAndRefreshToken)

    signIn = container.resolve(SignIn)
  })

  afterAll(() => {
    container.clearInstances()
  })

  it('should be able to generate tokens from refresh token', async () => {
    const result = await signIn.execute(emailFake, passwordFake)

    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(emailFake)
    expect(mockGenerateAccessAndRefreshToken.execute).toHaveBeenCalledWith(expect.any(User))
    expect(result).toMatchObject({
      accessToken: 'some_access_token',
      refreshToken: 'some_refresh_token',
      user: expect.objectContaining({
        id: 1,
        email: emailFake,
        name: 'Maria da Silva',
        role: 'COORDINATOR'
      })
    })
    // @ts-ignore
    expect(result.user.password).toBeUndefined()
  })

  it('should throw "ValidationError" if not sent valid email', async () => {
    await expect(signIn.execute('invalid_email', passwordFake))
      .rejects
      .toThrow(ValidationError)
  })

  it('should throw "EmailOrPasswordIncorrectError" if user not found', async () => {
    mockUserRepo.findByEmail.mockResolvedValueOnce(undefined)
    await expect(signIn.execute('not_exists@mail.com', passwordFake))
      .rejects
      .toThrow(EmailOrPasswordIncorrectError)
  })

  it('should throw "EmailOrPasswordIncorrectError" if user password not equal password', async () => {
    const userFake2 = getInstanceOf(User, userFake)
    userFake2.passwordIsEqual = jest.fn().mockResolvedValueOnce(false)

    mockUserRepo.findByEmail.mockResolvedValueOnce(userFake2)

    await expect(signIn.execute(emailFake, passwordFake))
      .rejects
      .toThrow(EmailOrPasswordIncorrectError)
  })

  it('should pass exception to front if "generateAccessAndRefreshToken.execute" throws exception', async () => {
    mockGenerateAccessAndRefreshToken.execute.mockRejectedValueOnce(new Error())

    const promise = signIn.execute(emailFake, passwordFake)
    await expect(promise)
      .rejects
      .toThrow(Error)
  })
})
