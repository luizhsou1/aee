import { getRepository, Repository } from 'typeorm'

import { TokenType, User, UserEmailAlreadyExistsError, UserRole, UserToken } from '../../../../src/domain/user'
import { closeConnectionWithDatabase, connectToDatabase } from '../../../../src/infra/db'
import { UserRepo } from '../../../../src/infra/db/repositories'
import { getInstanceOf } from '../../../../src/shared/utils'

describe('UserRepo | Repository', () => {
  let repo: UserRepo
  let typeormRepo: Repository<User>

  const initialConfigDb = async () => {
    await connectToDatabase({ dropDatabase: true })

    typeormRepo = getRepository(User)

    const userAmin = getInstanceOf(User, {
      name: 'Admin',
      email: 'admin@mail.com',
      password: 'some_hash_password',
      role: UserRole.ADMIN
    })
    const userCoordinator = getInstanceOf(User, {
      name: 'Coordinator',
      email: 'coordinator@mail.com',
      password: 'some_hash_password',
      role: UserRole.COORDINATOR
    })
    const userTeacher = getInstanceOf(User, {
      name: 'Teacher',
      email: 'teacher@mail.com',
      password: 'some_hash_password',
      role: UserRole.TEACHER
    })

    await typeormRepo.save([userAmin, userCoordinator, userTeacher])
  }

  beforeAll(async () => {
    await initialConfigDb()

    repo = new UserRepo()
  })

  afterAll(async () => {
    await closeConnectionWithDatabase()
  })

  describe('exists', () => {
    it('should return "true" if exists user in database', async () => {
      expect(await repo.exists(1)).toBe(true)
    })

    it('should return "false" if not exists user in database', async () => {
      expect(await repo.exists(10)).toBe(false)
    })
  })

  describe('save', () => {
    it('should insert user in database', async () => {
      const user = getInstanceOf(User, {
        name: 'Some',
        email: 'some@mail.com',
        password: 'some_hash_password',
        role: UserRole.COORDINATOR
      })

      const result = await repo.save(user)

      expect(result).toEqual(expect.any(User))
      expect(result).toMatchObject({
        id: 4,
        name: 'Some',
        email: 'some@mail.com',
        password: 'some_hash_password',
        role: UserRole.COORDINATOR,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    })

    it('should fails to save user in database with property not null is null', async () => {
      const user = getInstanceOf(User, {})
      await expect(repo.save(user))
        .rejects
        .toThrow()
    })

    it('should throws UserEmailAlreadyExistsError if exists user with email in database', async () => {
      const user = getInstanceOf(User, {
        name: 'Some',
        email: 'some@mail.com',
        password: 'some_hash_password',
        role: UserRole.COORDINATOR
      })
      await expect(repo.save(user))
        .rejects
        .toThrow(UserEmailAlreadyExistsError)
    })

    it('should update user in database', async () => {
      const user = getInstanceOf(User, {
        id: 4,
        name: 'Other',
        email: 'other@mail.com',
        password: 'other_hash_password',
        role: UserRole.ADMIN
      })

      const result = await repo.save(user)

      expect(result).toEqual(expect.any(User))
      expect(result).toMatchObject({
        id: 4,
        name: 'Other',
        email: 'other@mail.com',
        password: 'other_hash_password',
        role: UserRole.ADMIN,
        updatedAt: expect.any(Date)
      })
    })
  })

  describe('findById', () => {
    it('should return "user" if exists user in database', async () => {
      const result = await repo.findById(4)

      expect(result).toEqual(expect.any(User))
      expect(result).toMatchObject({
        id: 4,
        name: 'Other',
        email: 'other@mail.com',
        password: 'other_hash_password',
        role: UserRole.ADMIN,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    })

    it('should return "undefined" if not exists user in database', async () => {
      expect(await repo.findById(10)).toBeUndefined()
    })
  })

  describe('findByEmail', () => {
    it('should return "user" if exists user with email in database', async () => {
      const result = await repo.findByEmail('other@mail.com')

      expect(result).toEqual(expect.any(User))
      expect(result).toMatchObject({
        id: 4,
        name: 'Other',
        email: 'other@mail.com',
        password: 'other_hash_password',
        role: UserRole.ADMIN,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    })

    it('should return "undefined" if not exists user with email in database', async () => {
      expect(await repo.findByEmail('not_exists@mail.com')).toBeUndefined()
    })
  })

  const userFake = getInstanceOf(User, { id: 4 })
  const userTokenFake = UserToken.create(userFake, TokenType.RECOVER_PASSWORD_TOKEN)

  describe('saveUserToken', () => {
    it('should insert userToken in database', async () => {
      const result = await repo.saveUserToken(userTokenFake)

      expect(result).toEqual(expect.any(UserToken))
      expect(result).toMatchObject({
        token: userTokenFake.getToken(),
        user: expect.any(User),
        type: TokenType.RECOVER_PASSWORD_TOKEN,
        expirationDate: expect.any(Date),
        createdAt: expect.any(Date)
      })
    })
  })

  describe('findUserToken', () => {
    it('should return "userToken" if exists userToken in database', async () => {
      const result = await repo.findUserToken({
        token: userTokenFake.getToken(),
        type: TokenType.RECOVER_PASSWORD_TOKEN
      })

      expect(result).toEqual(expect.any(UserToken))
      expect(result).toMatchObject({
        token: userTokenFake.getToken(),
        user: expect.any(User),
        type: TokenType.RECOVER_PASSWORD_TOKEN,
        expirationDate: expect.any(Date),
        createdAt: expect.any(Date)
      })
    })

    it('should return "undefined" if not exists userToken in database', async () => {
      expect(await repo.findById(10)).toBeUndefined()
    })
  })

  describe('deleteUserToken', () => {
    it('should return "userToken" if exists userToken in database', async () => {
      expect(await repo.deleteUserToken(userTokenFake)).toBeUndefined()
    })
  })
})
