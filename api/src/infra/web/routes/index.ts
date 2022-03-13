import { Application, Router } from 'express'

import { Logger } from '../../../shared/logger'
import { authRoutes } from './auth.routes'
import { deficienciesRoutes } from './deficiency.routes'
import { usersRoutes } from './user.routes'

const routes = Router()

function setup (app: Application) {
  const logger = new Logger('Route')

  routes.use('/auth', authRoutes)
  logger.debug('/auth successfully configured')

  routes.use('/users', usersRoutes)
  logger.debug('/users successfully configured')

  routes.use('/deficiencies', deficienciesRoutes)
  logger.debug('/deficiencies successfully configured')

  routes.get('/health-check', (req, res) => res.send())
  logger.debug('/health-check successfully configured')

  app.use(routes)
}

export default { setup }
