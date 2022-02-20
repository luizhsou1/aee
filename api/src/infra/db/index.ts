import path from 'path'
import { Connection, ConnectionOptions, createConnection } from 'typeorm'

import { Logger } from '../../shared/logger'
import { isProd } from '../../shared/utils'

const options: ConnectionOptions = require('../../../ormconfig')

const logger = new Logger('Database')

export let connection: Connection

export async function connectToDatabase ({ dropDatabase = false } = {}): Promise<void> {
  try {
    connection = await createConnection({
      ...options,
      entities: [
        path.join(__dirname, '..', '..', 'domain', '**', '*.entity.{ts,js}'), // Entities
        path.join(__dirname, '..', '..', 'domain', '**', '*.vo.{ts,js}') // Value Objects
      ],
      migrations: [path.join(__dirname, 'migrations', '**', '*.{ts,js}')],
      subscribers: [path.join(__dirname, 'subscriber', '**', '*.{ts,js}')]
    })

    if (!connection.isConnected) {
      logger.warn('Failed to connect to the database')
      process.exit(1)
    }

    if (dropDatabase && !isProd()) {
      await connection.dropDatabase()
    }

    logger.debug('Connected to Database')

    const migrations = await connection.runMigrations()
    if (migrations.length) {
      logger.info(`Performed these migrations: ${JSON.stringify(migrations)}`)
    }
  } catch (err: any) {
    logger.error(`Connection to Database failed: ${JSON.stringify(err)}`, err.stack)
    process.exit(1)
  }
}

export async function closeConnectionWithDatabase (): Promise<void> {
  await connection.close()
}
