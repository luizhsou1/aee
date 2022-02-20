import cors from 'cors'
import express, { Express } from 'express'
import path from 'path'

import { Logger } from '../../shared/logger'
import errorHandler from './error-handler'
import requestLogger from './request-logger'
import routes from './routes'
import swagger from './swagger'

export function setupApp (): Express {
  const app = express()

  app.use(express.json())
  app.use(cors())

  app.use('/images', express.static(path.join(__dirname, '..', '..', '..', 'public', 'images')))

  requestLogger.setup(app)
  swagger.setup(app)
  routes.setup(app)

  errorHandler.setup(app)

  new Logger('Server').debug('application successfully configured')

  return app
}
