import { container } from 'tsyringe'

import { AuthorizationError, EnsureAuth, ExpiredTokenError, generateAccessToken, InvalidTokenError } from '../../../../src/domain/auth'
import { User, UserRole } from '../../../../src/domain/user'

const generateFakeBearerToken = (role: UserRole, { expiresIn }: { expiresIn?: string} = {}) => `Bearer ${generateAccessToken({
    userId: 1,
    email: 'some@mail.com',
    name: 'Some Name',
    role,
    expiresIn
  })}`

describe('EnsureAuth | DomainService', () => {
  let ensureAuth: EnsureAuth

  beforeAll(() => {
    ensureAuth = container.resolve(EnsureAuth)
  })

  const expectedUserAdmin = expect.objectContaining({
    id: 1,
    email: 'some@mail.com',
    name: 'Some Name',
    role: UserRole.ADMIN
  })

  const expectedUserCoordinator = expect.objectContaining({
    id: 1,
    email: 'some@mail.com',
    name: 'Some Name',
    role: UserRole.COORDINATOR
  })

  const expectedUserTeacher = expect.objectContaining({
    id: 1,
    email: 'some@mail.com',
    name: 'Some Name',
    role: UserRole.TEACHER
  })

  describe('At least "ADMIN" role', () => {
    it('should return "User" when passing bearerToken from user "ADMIN"', () => {
      const bearerTokenAdmin = generateFakeBearerToken(UserRole.ADMIN)
      const result = ensureAuth.execute(bearerTokenAdmin, UserRole.ADMIN)

      expect(result).toBeInstanceOf(User)
      expect(result).toEqual(expectedUserAdmin)
    })

    it('should Throw "AuthorizationError" when passing bearerToken from user "COORDINATOR"', () => {
      const bearerTokenCoordinator = generateFakeBearerToken(UserRole.COORDINATOR)
      expect(() => ensureAuth.execute(bearerTokenCoordinator, UserRole.ADMIN))
        .toThrow(new AuthorizationError(UserRole.ADMIN))
    })

    it('should Throw "AuthorizationError" when passing bearerToken from user "TEACHER"', () => {
      const bearerTokenTeacher = generateFakeBearerToken(UserRole.TEACHER)
      expect(() => ensureAuth.execute(bearerTokenTeacher, UserRole.ADMIN))
        .toThrow(new AuthorizationError(UserRole.ADMIN))
    })
  })

  describe('At least "COORDINATOR" role', () => {
    it('should return "User" when passing bearerToken from user "ADMIN"', () => {
      const bearerTokenAdmin = generateFakeBearerToken(UserRole.ADMIN)
      const result = ensureAuth.execute(bearerTokenAdmin, UserRole.COORDINATOR)

      expect(result).toBeInstanceOf(User)
      expect(result).toEqual(expectedUserAdmin)
    })

    it('should return "User" when passing bearerToken from user "COORDINATOR"', () => {
      const bearerTokenCoordinator = generateFakeBearerToken(UserRole.COORDINATOR)
      const result = ensureAuth.execute(bearerTokenCoordinator, UserRole.COORDINATOR)

      expect(result).toBeInstanceOf(User)
      expect(result).toEqual(expectedUserCoordinator)
    })

    it('should Throw "AuthorizationError" when passing bearerToken from user "TEACHER"', () => {
      const bearerTokenTeacher = generateFakeBearerToken(UserRole.TEACHER)
      expect(() => ensureAuth.execute(bearerTokenTeacher, UserRole.COORDINATOR))
        .toThrow(new AuthorizationError(UserRole.COORDINATOR))
    })
  })

  describe('At least "TEACHER" role', () => {
    it('should return "User" when passing bearerToken from user "ADMIN"', () => {
      const bearerTokenAdmin = generateFakeBearerToken(UserRole.ADMIN)
      const result = ensureAuth.execute(bearerTokenAdmin, UserRole.TEACHER)

      expect(result).toBeInstanceOf(User)
      expect(result).toEqual(expectedUserAdmin)
    })

    it('should return "User" when passing bearerToken from user "COORDINATOR"', () => {
      const bearerTokenCoordinator = generateFakeBearerToken(UserRole.COORDINATOR)
      const result = ensureAuth.execute(bearerTokenCoordinator, UserRole.TEACHER)

      expect(result).toBeInstanceOf(User)
      expect(result).toEqual(expectedUserCoordinator)
    })

    it('should return "User" when passing bearerToken from user "TEACHER"', () => {
      const bearerTokenTeacher = generateFakeBearerToken(UserRole.TEACHER)
      const result = ensureAuth.execute(bearerTokenTeacher, UserRole.TEACHER)

      expect(result).toBeInstanceOf(User)
      expect(result).toEqual(expectedUserTeacher)
    })
  })

  it('should Throw "AuthorizationError" when passing bearerToken from user "ROLE_NOT_EXISTS"', () => {
    const bearerTokenTeacher = generateFakeBearerToken('ROLE_NOT_EXISTS' as UserRole)
    expect(() => ensureAuth.execute(bearerTokenTeacher, UserRole.TEACHER))
      .toThrow(new AuthorizationError(UserRole.TEACHER))
  })

  it('should Throw "ExpiredTokenError" if expired token', () => {
    const bearerToken = generateFakeBearerToken(UserRole.ADMIN, { expiresIn: '-1h' })

    expect(() => ensureAuth.execute(bearerToken, UserRole.ADMIN))
      .toThrow(new ExpiredTokenError('Authentication token expired!'))
  })

  it('should throw "InvalidTokenError" if an unmapped error occurs', () => {
    const bearerToken = 'Bearer invalid_token'

    expect(() => ensureAuth.execute(bearerToken, UserRole.ADMIN))
      .toThrow(InvalidTokenError)
  })
})
