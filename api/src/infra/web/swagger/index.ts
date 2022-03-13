import { Application } from 'express'
import path from 'path'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi, { SwaggerUiOptions } from 'swagger-ui-express'

import { Logger } from '../../../shared/logger'
import { getServerBaseUrl } from '../../../shared/utils'

const TITLE = 'AEE REST API'

const swaggerOpts: swaggerJSDoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: TITLE,
      version: 'version'
    },
    servers: [{ url: getServerBaseUrl() }, { url: 'api.projetoaee.com.br' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: [path.join(__dirname, '*.swagger.{ts,js}'), path.join(__dirname, '..', 'routes', '*.routes.{ts,js}')]
}

const openapiSpec = swaggerJSDoc(swaggerOpts)
const swaggerOptions: SwaggerUiOptions = {
  customSiteTitle: TITLE,
  customCss: '.swagger-ui section.models, .topbar { display: none; }',
  swaggerOptions: {
    persistAuthorization: true
  }
}

function setup (app: Application) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec, swaggerOptions))
  app.use('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(openapiSpec)
  })
  new Logger('Swagger').debug('successfully configured')
}

export default { setup }
