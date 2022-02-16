import { container } from 'tsyringe'

import { ForgotPassword } from '../../../../src/application/auth'
import { ValidationError } from '../../../../src/domain/errors'
import { TokenType, User, UserNotFoundError, UserToken } from '../../../../src/domain/user'
import { getInstanceOf } from '../../../../src/shared/utils'

describe('ForgotPassword | ApplicationService', () => {
  let forgotPassword: ForgotPassword

  const emailFake = 'some@mail.com'
  const userFake = getInstanceOf(User, {
    id: 1,
    email: emailFake,
    password: 'projetoaee2022',
    name: 'Maria da Silva',
    role: 'COORDINATOR'
  })

  const mockUserRepo = {
    findByEmail: jest.fn().mockResolvedValue(userFake),
    saveUserToken: jest.fn().mockResolvedValue(UserToken.create(userFake, TokenType.RECOVER_PASSWORD_TOKEN))
  }

  const mockEmailProvider = {
    send: jest.fn().mockResolvedValue(undefined)
  }

  beforeAll(() => {
    container.clearInstances()
    container.registerInstance('IUserRepo', mockUserRepo)
    container.registerInstance('IEmailProvider', mockEmailProvider)

    forgotPassword = container.resolve(ForgotPassword)
  })

  it('should be able to generate password recovery token and send email to user', async () => {
    const result = await forgotPassword.execute(emailFake)

    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(emailFake)
    expect(mockUserRepo.saveUserToken).toHaveBeenCalledWith(expect.any(UserToken))
    expect(mockEmailProvider.send).toHaveBeenCalledWith(
      emailFake,
      'Recuperação de senha',
      'forgot-password', {
        name: userFake.getName(),
        link: expect.any(String)
      })
    expect(result).toBeUndefined()
  })

  it('should throw "ValidationError" if not sent valid email', async () => {
    await expect(forgotPassword.execute('invalid_email'))
      .rejects
      .toThrow(ValidationError)
  })

  it('should throw "UserNotFoundError" if user not found', async () => {
    mockUserRepo.findByEmail.mockResolvedValueOnce(undefined)
    await expect(forgotPassword.execute(emailFake))
      .rejects
      .toThrow(UserNotFoundError)
  })

  it('should pass exception to front if "IUserRepo.saveUserToken" throws exception', async () => {
    mockUserRepo.saveUserToken.mockRejectedValueOnce(new Error())

    await expect(forgotPassword.execute(emailFake))
      .rejects
      .toThrow(Error)
  })
})
