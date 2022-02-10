import { Application, Router } from 'express'

import { authRoutes } from './auth.routes'
import { deficienciesRoutes } from './deficiency.routes'
import { usersRoutes } from './user.routes'

const routes = Router()

routes.use('/auth', authRoutes)
routes.use('/users', usersRoutes)
routes.use('/deficiencies', deficienciesRoutes)

function setup (app: Application) {
  app.use('/api', routes)
}

export default { setup }
