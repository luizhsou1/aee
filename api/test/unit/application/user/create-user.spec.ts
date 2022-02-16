import { container } from 'tsyringe'

import { CreateUser } from '../../../../src/application/user'
import { ValidationError } from '../../../../src/domain/errors'
import { User } from '../../../../src/domain/user'

describe('CreateUser | ApplicationService', () => {
  let createUser: CreateUser

  const mockUserRepo = {
    save: jest.fn().mockResolvedValue(new User())
  }

  const userData = {
    email: 'maria.silva@mail.com',
    password: 'projetoaee2022',
    name: 'Maria da Silva',
    role: 'COORDINATOR'
  }

  beforeAll(() => {
    container.registerInstance('IUserRepo', mockUserRepo)

    createUser = container.resolve(CreateUser)
  })

  it('should be able to create a new user', async () => {
    const result = await createUser.execute(userData)

    expect(mockUserRepo.save).toHaveBeenCalledWith(expect.any(User))
    expect(mockUserRepo.save).toHaveBeenCalledWith(expect.objectContaining({
      password: expect.stringMatching(/^\$2b\$08\$/) // Check be password hashed with 8 salt rounds
    }))
    expect(result).toBeInstanceOf(User)
  })

  it('should not be able to create a new user without some required property', async () => {
    const { email, ...userDataWithoutEmail } = userData
    const promise = createUser.execute(userDataWithoutEmail)
    await expect(promise)
      .rejects
      .toThrow(ValidationError)
  })

  it('should pass exception to front if "IUserRepo.save" throws exception', async () => {
    mockUserRepo.save.mockRejectedValueOnce(new Error())

    const promise = createUser.execute(userData)
    await expect(promise)
      .rejects
      .toThrow(Error)
  })
})
