import { Application, NextFunction, Request, Response } from 'express'

import { DomainError, ValidationError } from '../../domain/errors'
import { isProd } from '../../shared/utils'

interface IError {
  error: string,
  message: string,
  property?: string,
  details?: any,
  stack?: string
}

function setup (app: Application) {
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (isProd()) {
      delete err.stack
    }

    if (err instanceof DomainError) {
      const error: IError = {
        error: err.error,
        message: err.message,
        property: (err as ValidationError).property,
        details: err.details,
        stack: err.stack
      }
      return res.status(err.code).json(error)
    }

    const error: IError = {
      error: 'InternalServerError',
      message: `Internal Server Error - ${err.message}`
    }
    return res.status(500).json(error)
  })
}

export default { setup }
