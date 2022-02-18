import { Express } from 'express'
import request from 'supertest'
import { getRepository, Repository } from 'typeorm'

import { TokenType, User, UserRole, UserToken } from '../../src/domain/user'
import { closeConnectionWithDatabase, connectToDatabase, dropDatabase } from '../../src/infra/db'
import { setupApp } from '../../src/infra/web/app'
import { getInstanceOf } from '../../src/shared/utils'

describe('Auth Routes', () => {
  let app: Express
  let typeormRepoUser: Repository<User>
  let typeormRepoUserToken: Repository<UserToken>

  const initialConfigDb = async () => {
    await connectToDatabase()

    typeormRepoUser = getRepository(User)
    typeormRepoUserToken = getRepository(UserToken)

    const userAmin = getInstanceOf(User, {
      name: 'Admin',
      email: 'admin@mail.com',
      password: '$2b$08$qP9QkoZ7z2rJxr6i5/C9o.yl02I0LFzmSg72jEQSFgCiCbB90T7hW', // hash password: projetoaee2022
      role: UserRole.ADMIN
    })
    const userCoordinator = getInstanceOf(User, {
      name: 'Coordinator',
      email: 'coordinator@mail.com',
      password: '$2b$08$qP9QkoZ7z2rJxr6i5/C9o.yl02I0LFzmSg72jEQSFgCiCbB90T7hW', // hash password: projetoaee2022
      role: UserRole.COORDINATOR
    })
    const userTeacher = getInstanceOf(User, {
      name: 'Teacher',
      email: 'teacher@mail.com',
      password: '$2b$08$qP9QkoZ7z2rJxr6i5/C9o.yl02I0LFzmSg72jEQSFgCiCbB90T7hW', // hash password: projetoaee2022
      role: UserRole.TEACHER
    })

    await typeormRepoUser.save([userAmin, userCoordinator, userTeacher])
  }

  beforeAll(async () => {
    await initialConfigDb()

    await import('../../src/shared/container')

    app = setupApp()
  })

  afterAll(async () => {
    await dropDatabase()
    await closeConnectionWithDatabase()
  })

  let refreshToken: string
  let accessToken: string
  describe('POST /auth/signin', () => {
    test('Should return 200 on signin', async () => {
      await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'admin@mail.com',
          password: 'projetoaee2022'
        })
        .expect(({ status, body }) => {
          expect(status).toBe(200)
          expect(body).toEqual({
            user: {
              id: 1,
              email: 'admin@mail.com',
              name: 'Admin',
              role: 'ADMIN',
              createdAt: expect.any(String),
              updatedAt: expect.any(String)
            },
            accessToken: expect.any(String),
            refreshToken: expect.any(String)
          })
          accessToken = body.accessToken
          refreshToken = body.refreshToken
        })
    })

    test('Should return 401 on signin', async () => {
      await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'admin@mail.com',
          password: '123456'
        })
        .expect(401)

      await request(app)
        .post('/api/auth/signin')
        .send({
          email: 'not_exists@mail.com',
          password: 'projetoaee2022'
        })
        .expect(401)
    })
  })

  describe('POST /auth/refresh-token', () => {
    test('Should return 200 on refresh token', async () => {
      await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken })
        .expect(({ status, body }) => {
          expect(status).toBe(200)
          expect(body).toEqual({
            user: {
              id: 1,
              email: 'admin@mail.com',
              name: 'Admin',
              role: 'ADMIN',
              createdAt: expect.any(String),
              updatedAt: expect.any(String)
            },
            accessToken: expect.any(String),
            refreshToken: expect.any(String)
          })
        })
    })

    test('Should return 404 on refresh token', async () => {
      await request(app)
        .post('/api/auth/refresh-token')
        .send({ refreshToken })
        .expect(({ status, body }) => {
          expect(status).toBe(404)
          expect(body).toMatchObject({ error: 'TokenNotFoundError' })
        })
    })

    let tokenRecoverPassword: string
    describe('GET /auth/forgot-password', () => {
      test('Should return 204 on forgot password', async () => {
        await request(app)
          .get('/api/auth/forgot-password/admin@mail.com')
          .expect(204)
          // @ts-ignore
        const userToken = await typeormRepoUserToken.findOne({ type: TokenType.RECOVER_PASSWORD_TOKEN })
        if (userToken) {
          tokenRecoverPassword = userToken.getToken()
        }
      })
    })

    describe('POST /auth/reset-password', () => {
      test('Should return 204 on reset password', async () => {
        await request(app)
          .post(`/api/auth/reset-password?token=${tokenRecoverPassword}`)
          .send({ password: '2022projetoaee' })
          .expect(204)

        await request(app)
          .post('/api/auth/signin')
          .send({
            email: 'admin@mail.com',
            password: '2022projetoaee'
          })
          .expect(200)
      })
    })

    describe('POST /auth/change-password', () => {
      test('Should return 204 on change password', async () => {
        await request(app)
          .post('/api/auth/change-password')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ password: 'projetoaee2022' })
          .expect(204)

        await request(app)
          .post('/api/auth/signin')
          .send({
            email: 'admin@mail.com',
            password: 'projetoaee2022'
          })
          .expect(200)
      })
    })
  })
})
