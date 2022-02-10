interface IWebConfig {
  port: number,
  serverBaseUrl: string
}

interface IDbConfig {}

interface IConfig {
  web: IWebConfig,
  db: IDbConfig
}

const config: IConfig = {
  web: {
    port: Number(process.env.PORT) || 4000,
    serverBaseUrl: process.env.SERVER_BASE_URL || 'http://localhost:4000'
  },
  db: {}
}

export = config
