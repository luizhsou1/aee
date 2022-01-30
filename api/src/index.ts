import 'dotenv/config'
import 'reflect-metadata'
import { connectToDatabase } from './infra/db'
import server from './infra/web/server'

(async () => {
  await connectToDatabase()
  server.start()
})()
