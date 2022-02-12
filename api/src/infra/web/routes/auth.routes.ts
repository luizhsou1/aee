import { Router } from 'express'
import { container } from 'tsyringe'

import { SignIn, ForgotPassword, ResetPassword } from '../../../application/auth'
import { RefreshToken } from '../../../application/auth/refresh-token'

export const authRoutes = Router()

/**
* @swagger
*
* definitions:
*   SingIn:
*     type: object
*     required:
*       - email
*       - password
*     properties:
*       email:
*         type: string
*         example: maria.silva@mail.com
*       password:
*         type: string
*         example: projetoaee2022
*
*   RefreshToken:
*     type: object
*     required:
*       - refreshToken
*     properties:
*       refreshToken:
*         type: string
*         example: some_refresh_token
*
*   ResetPassword:
*     type: object
*     required:
*       - token
*       - password
*     properties:
*       password:
*         type: string
*         example: 2022projetoaee
*
*/

/**
* @swagger
*
* /auth/signin:
*   post:
*     tags: ['Auth']
*     summary: SignIn
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/definitions/SingIn'
*     responses:
*       '200':
*         description: OK
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                user:
*                  type: object
*                  $ref: '#/definitions/UserResponse'
*                accessToken:
*                  type: string
*                  example: some_access_token
*                refreshToken:
*                  type: string
*                  example: some_refresh_token
*       '422':
*         description: Unprocessable Entity
*         content:
*           application/json:
*             schema:
*               oneOf:
*                 - $ref: '#/definitions/EmailOrPasswordIncorrectError'
*       '500':
*         description: Internal server error
*/
authRoutes.post('/signin', async (req, res, next) => container.resolve(SignIn)
  .execute(req.body.email, req.body.password)
  .then((result) => res.status(200).json(result))
  .catch(next))

/**
* @swagger
*
* /auth/refresh-token:
*   post:
*     tags: ['Auth']
*     summary: Get access token by refresh token
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/definitions/RefreshToken'
*     responses:
*       '200':
*         description: OK
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                user:
*                  type: object
*                  $ref: '#/definitions/UserResponse'
*                token:
*                  type: string
*                  example: some_token
*       '422':
*         description: Unprocessable Entity
*         content:
*           application/json:
*             schema:
*               oneOf:
*                 - $ref: '#/definitions/EmailOrPasswordIncorrectError'
*       '500':
*         description: Internal server error
*/
authRoutes.post('/refresh-token', async (req, res, next) => container.resolve(RefreshToken)
  .execute(req.body.refreshToken)
  .then((result) => res.status(200).json(result))
  .catch(next))

/**
* @swagger
*
* /auth/forgot-password/{email}:
*   post:
*     tags: ['Auth']
*     summary: Forgot Password
*     parameters:
*       - in: path
*         name: email
*     responses:
*       '204':
*         description: No Content
*       '404':
*         description: User Not Found
*         content:
*           application/json:
*             schema:
*               oneOf:
*                 - $ref: '#/definitions/UserNotFoundError'
*       '500':
*         description: Internal server error
*/
authRoutes.post('/forgot-password/:email', async (req, res, next) => container.resolve(ForgotPassword)
  .execute(req.params.email)
  .then(() => res.status(204).send())
  .catch(next))

/**
* @swagger
*
* /auth/reset-password:
*   post:
*     tags: ['Auth']
*     summary: Reset Password
*     parameters:
*       - in: query
*         name: token
*         type: integer
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/definitions/ResetPassword'
*     responses:
*       '204':
*         description: No Content
*       '403':
*         description: Forbidden
*         content:
*           application/json:
*             schema:
*               $ref: '#/definitions/ExpiredTokenError'
*       '404':
*         description: Not Found
*         content:
*           application/json:
*             schema:
*               $ref: '#/definitions/TokenNotFoundError'
*       '422':
*         description: Unprocessable Entity
*         content:
*           application/json:
*             schema:
*               oneOf:
*                 - $ref: '#/definitions/PasswordIsEqualError'
*       '500':
*         description: Internal server error
*/
authRoutes.post('/reset-password', async (req, res, next) => container.resolve(ResetPassword)
  .execute(req.query.token as string, req.body.password)
  .then(() => res.status(204).send())
  .catch(next))
