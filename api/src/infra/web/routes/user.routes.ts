import { Router } from 'express'
import { container } from 'tsyringe'

import {
  CreateUser
} from '../../../application/user'
import { isAtLeastCoordinator } from '../middlewares/auth.middleware'

export const usersRoutes = Router()

/**
* @swagger
*
* definitions:
*   UserCreate:
*     type: object
*     required:
*       - email
*       - password
*       - name
*       - role
*     properties:
*       email:
*         type: string
*         example: maria.silva@mail.com
*       password:
*         type: string
*         example: projetoaee2022
*       name:
*         type: string
*         example: Maria da Silva
*       role:
*         type: string
*         enum: [ADMIN, COORDINATOR, TEACHER]
*         example: COORDINATOR
*
*   UserUpdate:
*     type: object
*     properties:
*       email:
*         type: string
*         example: maria.silva@mail.com
*       password:
*         type: string
*         example: projetoaee2022
*       name:
*         type: string
*         example: Maria da Silva
*       role:
*         type: string
*         enum: [ADMIN, COORDINATOR, TEACHER]
*         example: COORDINATOR
*
*   UserResponse:
*     type: object
*     properties:
*       id:
*         type: integer
*         example: id
*       email:
*         type: string
*         example: maria.silva@mail.com
*       name:
*         type: string
*         example: Maria da Silva
*       role:
*         type: string
*         enum: [ADMIN, COORDINATOR, TEACHER]
*         example: COORDINATOR
*       createdAt:
*         type: string
*         example: 2022-01-30T19:50:15.462Z
*       updatedAt:
*         type: string
*         example: 2022-01-30T19:50:15.462Z
*/

/**
* @swagger
*
* /users:
*   post:
*     security:
*       - bearerAuth: []
*     tags: ['User']
*     summary: Create an user
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/definitions/UserCreate'
*     responses:
*       '201':
*         description: Created
*         content:
*           application/json:
*             schema:
*               $ref: '#/definitions/UserResponse'
*       '400':
*         description: Bad request
*         content:
*           application/json:
*             schema:
*               $ref: '#/definitions/BadRequestError'
*       '422':
*         description: Unprocessable Entity
*         content:
*           application/json:
*             schema:
*               oneOf:
*                 - $ref: '#/definitions/UserEmailAlreadyExistsError'
*       '500':
*         description: Internal server error
*/
usersRoutes.post('/', isAtLeastCoordinator, async (req, res, next) => container.resolve(CreateUser)
  .execute(req.body)
  .then((user) => res.status(201).json(user))
  .catch(next))
