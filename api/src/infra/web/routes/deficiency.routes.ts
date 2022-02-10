import { Router } from 'express'
import { container } from 'tsyringe'

import {
  CreateDeficiency,
  DeleteDeficiencyById,
  GetDeficiencyById,
  UpdateDeficiencyById
} from '../../../application/deficiency'
import { IDeficiencyRepo } from '../../../domain'
import { pagination } from '../middlewares'
import { isAtLeastCoordinator } from '../middlewares/auth.middleware'

export const deficienciesRoutes = Router()

/**
* @swagger
*
* definitions:
*   DeficiencyCreate:
*     type: object
*     required:
*       - name
*     properties:
*       name:
*         type: string
*         example: Síndrome de Down
*
*   DeficiencyUpdate:
*     type: object
*     properties:
*       name:
*         type: string
*         example: Síndrome de Down
*
*   DeficiencyResponse:
*     type: object
*     required:
*       - name
*     properties:
*       id:
*         type: integer
*         example: id
*       name:
*         type: string
*         example: Síndrome de Down
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
* /deficiencies:
*   post:
*     security:
*       - bearerAuth: []
*     tags: ['Deficiency']
*     summary: Create an deficiency
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/definitions/DeficiencyCreate'
*     responses:
*       '201':
*         description: Created
*         content:
*           application/json:
*             schema:
*               $ref: '#/definitions/DeficiencyResponse'
*       '400':
*         description: Bad request
*         content:
*           application/json:
*             schema:
*               $ref: '#/definitions/BadRequestError'
*       '500':
*         description: Internal server error
*/
deficienciesRoutes.post('/', isAtLeastCoordinator, async (req, res, next) => container.resolve(CreateDeficiency)
  .execute(req.body)
  .then((deficiency) => res.status(201).json(deficiency))
  .catch(next))

/**
* @swagger
*
* /deficiencies:
*   get:
*     security:
*       - bearerAuth: []
*     tags: ['Deficiency']
*     summary: Get deficiencies list
*     parameters:
*       - $ref: '#/parameters/page'
*       - $ref: '#/parameters/limit'
*       - $ref: '#/parameters/order'
*       - in: query
*         name: name
*         schema:
*           type: string
*         description: search by partial name (case insensitive and ignore accents)
*     responses:
*       '200':
*         description: Ok
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 data:
*                   type: array
*                   items:
*                     $ref: '#/definitions/DeficiencyResponse'
*                 page:
*                   type: number
*                   example: 2
*                 limit:
*                   type: number
*                   example: 10
*                 total:
*                   type: number
*                   example: 15
*                 totalSearched:
*                   type: number
*                   example: 5
*       '500':
*         description: Internal server error
*/
deficienciesRoutes.get('/', isAtLeastCoordinator, pagination, (req, res, next) => {
  const { page, limit, order } = res.locals
  const { name } = req.query as { [key: string]: string }
  return container.resolve<IDeficiencyRepo>('IDeficiencyRepo')
    .find({ page, limit, order, name })
    .then((paginatedDeficiency) => res.status(200).json(paginatedDeficiency))
    .catch(next)
})

/**
* @swagger
*
* /deficiencies/{id}:
*   get:
*     security:
*       - bearerAuth: []
*     tags: ['Deficiency']
*     summary: Get deficiency by id
*     parameters:
*       - in: path
*         name: id
*     responses:
*       '200':
*         description: OK
*         content:
*           application/json:
*             schema:
*               $ref: '#/definitions/DeficiencyResponse'
*       '500':
*         description: Internal server error
*/
deficienciesRoutes.get('/:id', isAtLeastCoordinator, (req, res, next) => container.resolve(GetDeficiencyById)
  .execute(Number(req.params.id))
  .then((deficiency) => res.status(200).json(deficiency))
  .catch(next))

/**
* @swagger
*
* /deficiencies/{id}:
*   patch:
*     security:
*       - bearerAuth: []
*     tags: ['Deficiency']
*     summary: Update deficiency by id
*     parameters:
*       - in: path
*         name: id
*         required: true
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/definitions/DeficiencyUpdate'
*     responses:
*       '200':
*         description: OK
*         content:
*           application/json:
*             schema:
*               $ref: '#/definitions/DeficiencyResponse'
*       '400':
*         description: Bad request
*         content:
*           application/json:
*             schema:
*               $ref: '#/definitions/BadRequestError'
*       '404':
*         description: Bad request
*         content:
*           application/json:
*             schema:
*               $ref: '#/definitions/DeficiencyNotFoundError'
*       '500':
*         description: Internal server error
*/
deficienciesRoutes.patch('/:id', isAtLeastCoordinator, async (req, res, next) => container.resolve(UpdateDeficiencyById)
  .execute(Number(req.params.id), req.body)
  .then((deficiency) => res.status(200).json(deficiency))
  .catch(next))

/**
* @swagger
*
* /deficiencies/{id}:
*   delete:
*     security:
*       - bearerAuth: []
*     tags: ['Deficiency']
*     summary: Delete deficiency by id
*     parameters:
*       - in: path
*         name: id
*         required: true
*     responses:
*       '204':
*         description: No content
*       '400':
*         description: Bad request
*         content:
*           application/json:
*             schema:
*               $ref: '#/definitions/BadRequestError'
*       '404':
*         description: Bad request
*         content:
*           application/json:
*             schema:
*               $ref: '#/definitions/DeficiencyNotFoundError'
*       '500':
*         description: Internal server error
*/
deficienciesRoutes.delete('/:id', isAtLeastCoordinator, (req, res, next) => container.resolve(DeleteDeficiencyById)
  .execute(Number(req.params.id))
  .then(() => res.status(204).send())
  .catch(next))
