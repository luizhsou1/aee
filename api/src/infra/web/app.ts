import cors from 'cors'
import express, { Express } from 'express'
import path from 'path'

import errorHandler from './error-handler'
import routes from './routes'
import swagger from './swagger'

export function setupApp (): Express {
  const app = express()

  app.use(express.json())
  app.use(cors())

  app.use('/images', express.static(path.join(__dirname, '..', '..', '..', 'public', 'images')))

  swagger.setup(app)
  routes.setup(app)

  errorHandler.setup(app)

  return app
}
