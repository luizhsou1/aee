import { Connection, createConnection } from 'typeorm'

export let connection: Connection

export async function connectToDatabase (): Promise<void> {
  try {
    connection = await createConnection()

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
