import rTracer from 'cls-rtracer'
import { Application, Request, Response } from 'express'
import expressWinston from 'express-winston'

import { Logger } from '../../shared/logger'
import { winstonConfig } from '../../shared/logger/winston'

function setup (app: Application) {
  app.use(rTracer.expressMiddleware({
    useHeader: true,
    headerName: 'x-trace-id',
    echoHeader: true
  }))

  app.use(expressWinston.logger({
    ...winstonConfig,
    level: 'info',
    msg: '[HTTP] {{res.statusCode}} {{req.method}} {{req.url}} {{res.responseTime}}ms',
    ignoreRoute: function (req: Request, res: Response) {
      const blockListRegex = /^\/(docs|health-check).*/
      return blockListRegex.test(req.url)
    }
  }))

  new Logger('RequestLogger').debug('successfully configured')
}

export default { setup }
