import 'dotenv/config'
import 'reflect-metadata'
import { connectToDatabase } from './infra/db'

(async () => {
  await connectToDatabase()

  await import('./shared/container')

  const server = await import('./infra/web/server')
  server.default.start()
})()
