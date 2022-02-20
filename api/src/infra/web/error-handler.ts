import { Application, NextFunction, Request, Response } from 'express'

import { DomainError, ValidationError } from '../../domain/errors'
import { Logger } from '../../shared/logger'
import { isProd } from '../../shared/utils'

interface IError {
  error: string,
  message: string,
  property?: string,
  details?: any,
  stack?: string
}

function setup (app: Application) {
  const logger = new Logger('ErrorHandler')
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err)

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
      message: `Internal Server Error - ${err.message}`,
      stack: err.stack
    }
    return res.status(500).json(error)
  })
  logger.debug('successfully configured')
}

export default { setup }
