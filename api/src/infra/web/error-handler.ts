import { Application, NextFunction, Request, Response } from 'express'

function setup (app: Application) {
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('HANDLER ERROR', err)

    return res.status(500).json({
      status: 'error',
      message: `Internal Server Error - ${err.message}`
    })
  })
}

export default { setup }
