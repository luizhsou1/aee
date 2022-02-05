/**
* @swagger
*
* definitions:
*   BadRequestError:
*     type: object
*     required:
*       - error
*       - message
*     properties:
*       error:
*         type: string
*         example: ValidationError
*       message:
*         type: string
*         example: Some message of Validation Error
*       property:
*         type: string
*         example: 'any_property'
*       details:
*         oneOf:
*           - type: array
*             items:
*               type: object
*           - type: object
*       stack:
*         type: string
*         example: Stack trace details
*/
