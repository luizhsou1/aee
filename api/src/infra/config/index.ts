interface IWebConfig {
  port: number,
  serverUrl: string
}

interface IDbConfig {}

interface IConfig {
  web: IWebConfig,
  db: IDbConfig
}

const config: IConfig = {
  web: {
    port: Number(process.env.PORT) || 4000,
    serverUrl: process.env.SERVER_URL || 'http://localhost:4000/api'
  },
  db: {}
}

export = config
