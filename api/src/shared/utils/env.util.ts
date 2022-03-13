// Environment

const getEnv = (): string => {
  const env = process.env.NODE_ENV || 'dev'
  return ['dev', 'test', 'prod'].includes(env) ? env : 'dev'
}

export const isDev = (): boolean => getEnv() === 'dev'

export const isTest = (): boolean => getEnv() === 'test'

export const isProd = (): boolean => getEnv() === 'prod'

// Auth Config

export const getJwtSecret = (): string => process.env.JWT_SECRET || 'some_secret'

export const getJwtExpiresIn = (): string => process.env.JWT_EXPIRES_IN || '1d'

export const getDaysToExpireRecoverPasswordToken = (): number => Number(process.env.DAYS_TO_EXPIRE_RECOVER_PASSWORD_TOKEN) || 1

export const getDaysToExpireRefreshToken = (): number => Number(process.env.DAYS_TO_EXPIRE_REFRESH_TOKEN) || 15

// Web Config

export const getPort = (): number => Number(process.env.PORT) || 4000

export const getServerBaseUrl = (): string => process.env.SERVER_BASE_URL || 'http://localhost:4000'

export const getAllowSwagger = (): boolean => process.env.ALLOW_SWAGGER === 'true'

// Test config

export const getDbPortTest = (): number => Number(process.env.DB_PORT_TEST) || 5401

// APP Config

export const getAppBaseUrl = (): string => process.env.APP_BASE_URL || 'http://localhost:8080'
