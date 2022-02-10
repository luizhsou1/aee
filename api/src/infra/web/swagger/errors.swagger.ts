/**
* @swagger
*
* definitions:
*   BadRequestError:
*     type: object
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
*
*   UnprocessableEntityError:
*     type: object
*     properties:
*       error:
*         type: string
*         example: UnprocessableEntityError
*       message:
*         type: string
*         example: Some message of Unprocessable Entity Error
*       stack:
*         type: string
*         example: Stack trace details
*
*   TokenNotFoundError:
*     type: object
*     required:
*       - error
*       - message
*     properties:
*       error:
*         type: string
*         example: TokenNotFoundError
*       message:
*         type: string
*         example: 'Token não encontrado'
*       stack:
*         type: string
*         example: Stack trace details
*
*   TokenExpiredError:
*     type: object
*     required:
*       - error
*       - message
*     properties:
*       error:
*         type: string
*         example: TokenExpiredError
*       message:
*         type: string
*         example: 'Reset password token expirado'
*       stack:
*         type: string
*         example: Stack trace details
*
*   UserNotFoundError:
*     type: object
*     required:
*       - error
*       - message
*     properties:
*       error:
*         type: string
*         example: UserNotFoundError
*       message:
*         type: string
*         example: 'Usuário não encontrado'
*       stack:
*         type: string
*         example: Stack trace details
*
*   UserEmailAlreadyExistsError:
*     type: object
*     required:
*       - error
*       - message
*     properties:
*       error:
*         type: string
*         example: UserEmailAlreadyExistsError
*       message:
*         type: string
*         example: Email 'maria.silva@mail.com' já cadastrado para outro usuário
*       stack:
*         type: string
*         example: Stack trace details
*
*   PasswordIsEqualError:
*     type: object
*     required:
*       - error
*       - message
*     properties:
*       error:
*         type: string
*         example: UserEmailAlrePasswordIsEqualErroradyExistsError
*       message:
*         type: string
*         example: Senha é a mesma já existente
*       stack:
*         type: string
*         example: Stack trace details
*
*   EmailOrPasswordIncorrectError:
*     type: object
*     required:
*       - error
*       - message
*     properties:
*       error:
*         type: string
*         example: EmailOrPasswordIncorrectError
*       message:
*         type: string
*         example: 'Usuário ou senha incorreto!'
*       stack:
*         type: string
*         example: Stack trace details
*
*   DeficiencyNotFoundError:
*     type: object
*     required:
*       - error
*       - message
*     properties:
*       error:
*         type: string
*         example: DeficiencyNotFoundError
*       message:
*         type: string
*         example: 'Deficiência não encontrada'
*       stack:
*         type: string
*         example: Stack trace details
*/
