import { Application, Router } from 'express'

import { deficienciesRoutes } from './deficiency.routes'

const routes = Router()

routes.use('/deficiencies', deficienciesRoutes)

function setup (app: Application) {
  app.use('/api', routes)
}

export default { setup }
