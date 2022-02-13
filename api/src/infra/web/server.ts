import cors from 'cors'
import express from 'express'
import path from 'path'

import { getEnv } from '../../shared/utils'
import { web } from '../config'
import errorHandler from './error-handler'
import routes from './routes'
import swagger from './swagger'

function start (): void {
  const app = express()

  app.use(express.json())
  app.use(cors())

  app.use('/images', express.static(path.join(__dirname, '..', '..', '..', 'public', 'images')))

  swagger.setup(app)
  routes.setup(app)

  errorHandler.setup(app)

  app.listen(web.port, () => console.log(`Server is running on port ${web.port} | Env: ${getEnv()}`))
}

export default { start }
