const { DefaultNamingStrategy } = require('typeorm')

const getTableName = (tableOrName) => typeof tableOrName === 'string' ? tableOrName : tableOrName.name

class CustomNamingStrategy extends DefaultNamingStrategy {
  primaryKeyName (tableOrName, columnNames) {
    tableOrName = getTableName(tableOrName)

    return `pk_${tableOrName}`
  }

  foreignKeyName (tableOrName, columnNames, referencedTablePath, referencedColumnNames) {
    tableOrName = getTableName(tableOrName)

    return columnNames.reduce(
      (name, column) => `${name}_${column}`,
      `fk_${tableOrName}` // `${tableOrName}_${referencedTablePath}`
    )
  }

  indexName (tableOrName, columns, where) {
    tableOrName = getTableName(tableOrName)

    return columns.reduce(
      (name, column) => `${name}_${column}`,
      `idx_${tableOrName}` // `${tableOrName}_${referencedTablePath}`
    )
  }

  uniqueConstraintName (tableOrName, columnNames) {
    tableOrName = getTableName(tableOrName)

    return `uq_${tableOrName}_${columnNames.sort().join('_')}`
  }
}

module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5400,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'aee',
  synchronize: process.env.DB_SYNC === 'true',
  logging: process.env.DB_LOGGING === 'true',
  entities: ['./src/infra/db/entities/*.entity.{ts,js}'],
  migrations: ['./src/infra/db/migrations/**/*.{ts,js}'],
  subscribers: ['./src/infra/db/subscriber/**/*.{ts,js}'],
  cli: {
    entitiesDir: './src/infra/db/entities',
    migrationsDir: './src/infra/db/migrations',
    subscribersDir: './src/infra/db/subscriber'
  },
  extra: {
    connectionLimit: process.env.DB_CONNECTION_LIMIT || 10
  },
  namingStrategy: new CustomNamingStrategy()
}