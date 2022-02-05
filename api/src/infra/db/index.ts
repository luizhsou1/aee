import path from 'path'
import { Connection, ConnectionOptions, createConnection } from 'typeorm'

const options: ConnectionOptions = require('../../../ormconfig')

export let connection: Connection

export async function connectToDatabase (): Promise<void> {
  try {
    connection = await createConnection({
      ...options,
      entities: [path.join(__dirname, 'entities', '*.{ts,js}')],
      migrations: [path.join(__dirname, 'migrations', '**', '*..{ts,js}')],
      subscribers: [path.join(__dirname, 'subscriber', '**', '*.{ts,js}')]
    })

    if (!connection.isConnected) {
      console.warn('Failed to connect to the database')
      process.exit(1)
    }

    console.info('Connected to Database')

    const migrations = await connection.runMigrations()
    if (migrations.length) {
      console.info(`Performed these migrations: ${JSON.stringify(migrations)}`)
    }
  } catch (err: any) {
    console.error(`Connection to Database failed: ${JSON.stringify(err)}`, err.stack)
    process.exit(1)
  }
}
