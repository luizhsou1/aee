import cors from 'cors'
import express from 'express'

import { web } from '../config'
import errorHandler from './error-handler'
import routes from './routes'
import swagger from './swagger'

function start (): void {
  const app = express()

  app.use(express.json())
  app.use(cors())

  swagger.setup(app)
  routes.setup(app)

  errorHandler.setup(app)

  app.listen(web.port, () => console.log('Server is running...'))
}

export default { start }
