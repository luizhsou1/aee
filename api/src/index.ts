import 'dotenv/config'
import 'reflect-metadata'
import { connectToDatabase } from './infra/db'

(async () => {
  await connectToDatabase()

  const server = await import('./infra/web/server')
  server.default.start()
})()
