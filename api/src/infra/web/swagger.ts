import { Application } from 'express'
import path from 'path'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

import { web } from '../config'

const swaggerOpts: swaggerJSDoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'AEE project REST API',
      version: 'version'
    },
    servers: [{ url: web.serverUrl }],
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
  apis: [path.join(__dirname, 'routes', '*.routes.ts')]
}

const openapiSpec = swaggerJSDoc(swaggerOpts)
const swaggerOptions = { customCss: '.swagger-ui section.models, .topbar { display: none; }' }

function setup (app: Application) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpec, swaggerOptions))
  app.use('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(openapiSpec)
  })
}

export default { setup }
