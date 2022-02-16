import { container } from 'tsyringe'

import { UpdateUserById } from '../../../../src/application/user'
import { PasswordIsEqualError } from '../../../../src/domain/auth'
import { ValidationError } from '../../../../src/domain/errors'
import { User, UserNotFoundError } from '../../../../src/domain/user'
import { getInstanceOf } from '../../../../src/shared/utils'

describe('UpdateUserById | ApplicationService', () => {
  let updateUserById: UpdateUserById

  const id = 1
  const userData = {
    id,
    email: 'maria.silva@mail.com',
    password: '$2b$08$qP9QkoZ7z2rJxr6i5/C9o.yl02I0LFzmSg72jEQSFgCiCbB90T7hW', // hash password: projetoaee2022
    name: 'Maria da Silva',
    role: 'COORDINATOR'
  }
  const userFake = getInstanceOf(User, userData)
  const userDataToUpdate = {
    email: 'maria.santos@mail.com',
    password: '2022projetoaee',
    name: 'Maria dos Santos',
    role: 'TEACHER'
  }

  const mockUserRepo = {
    save: jest.fn().mockResolvedValue(new User()),
    findById: jest.fn().mockResolvedValue(userFake)
  }

  beforeAll(() => {
    container.registerInstance('IUserRepo', mockUserRepo)

    updateUserById = container.resolve(UpdateUserById)
  })

  it('should be able to update user by id', async () => {
    const result = await updateUserById.execute(id, userDataToUpdate)

    expect(mockUserRepo.save).toHaveBeenCalledWith(expect.any(User))
    expect(mockUserRepo.save).toHaveBeenCalledWith(expect.objectContaining({
      email: 'maria.santos@mail.com',
      password: expect.stringMatching(/^\$2b\$08\$/), // Check be password hashed with 8 salt rounds
      name: 'Maria dos Santos',
      role: 'TEACHER'
    }))
    expect(result).toBeInstanceOf(User)
    // @ts-ignore
    expect(result.password).toBeUndefined()
  })

  it('should not update user by id if invalid id', async () => {
    const promise = updateUserById.execute(Number('abc123'), userDataToUpdate)
    await expect(promise)
      .rejects
      .toThrow(ValidationError)
  })

  it('should throw "UserNotFoundError" if user not found', async () => {
    mockUserRepo.findById.mockResolvedValueOnce(undefined)

    const promise = updateUserById.execute(100, userDataToUpdate)
    await expect(promise)
      .rejects
      .toThrow(UserNotFoundError)
  })

  it('should throw "PasswordIsEqualError" if it\'s the same password', async () => {
    const promise = updateUserById.execute(100, { ...userDataToUpdate, password: 'projetoaee2022' })
    await expect(promise)
      .rejects
      .toThrow(PasswordIsEqualError)
  })

  it('should pass exception to front if "IUserRepo.save" throws exception', async () => {
    mockUserRepo.save.mockRejectedValueOnce(new Error())

    const promise = updateUserById.execute(id, userDataToUpdate)
    await expect(promise)
      .rejects
      .toThrow(Error)
  })
})
