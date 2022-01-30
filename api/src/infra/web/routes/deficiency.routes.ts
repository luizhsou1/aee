import { Router } from 'express'

export const deficienciesRoutes = Router()

/**
* @swagger
*
* definitions:
*   deficiencyCreate:
*     type: object
*     required:
*       - name
*     properties:
*       name:
*         type: string
*         example: Síndrome de Down
*
*   deficiencyUpdate:
*     type: object
*     properties:
*       name:
*         type: string
*         example: Síndrome de Down
*
*   deficiencyResponse:
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
*     tags: ['Deficiency']
*     summary: Create an deficiency
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/definitions/deficiencyCreate'
*     responses:
*       '201':
*         description: Created
*         content:
*           application/json:
*             schema:
*               $ref: '#/definitions/deficiencyResponse'
*       '400':
*         description: Bad request
*       '500':
*         description: Internal server error
*/
deficienciesRoutes.post('/', (req, res) => {
  return res.status(201).json(req.body)
})

/**
* @swagger
*
* /deficiencies:
*   get:
*     tags: ['Deficiency']
*     summary: Get deficiencies list
*     responses:
*       '200':
*         description: Ok
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*                 $ref: '#/definitions/deficiencyResponse'
*       '500':
*         description: Internal server error
*/
deficienciesRoutes.get('/', (req, res) => res.json([req.body]))

/**
* @swagger
*
* /deficiencies/{id}:
*   get:
*     tags: ['Deficiency']
*     summary: Get deficiency by id
*     parameters:
*       - in: path
*         name: id
*         required: true
*     responses:
*       '200':
*         description: OK
*         content:
*           application/json:
*             schema:
*               $ref: '#/definitions/deficiencyResponse'
*       '500':
*         description: Internal server error
*/
deficienciesRoutes.get('/:id', (req, res) => res.json(req.params))

/**
* @swagger
*
* /deficiencies/{id}:
*   patch:
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
*             $ref: '#/definitions/deficiencyUpdate'
*     responses:
*       '200':
*         description: OK
*         content:
*           application/json:
*             schema:
*               $ref: '#/definitions/deficiencyResponse'
*       '400':
*         description: Bad request
*       '500':
*         description: Internal server error
*/
deficienciesRoutes.patch('/:id', (req, res) => res.json({ params: req.params, deficiency: req.body }))

/**
* @swagger
*
* /deficiencies/{id}:
*   delete:
*     tags: ['Deficiency']
*     summary: Delete deficiency by id
*     parameters:
*       - in: path
*         name: id
*         required: true
*     responses:
*       '204':
*         description: No content
*       '500':
*         description: Internal server error
*/
deficienciesRoutes.delete('/:id', (req, res) => res.status(204).send())
