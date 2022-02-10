const getEnv = (): string => {
  const env = process.env.NODE_ENV || 'dev'
  return ['dev', 'test', 'prod'].includes(env) ? env : 'dev'
}

export const isDev = (): boolean => getEnv() === 'dev'

export const isTest = (): boolean => getEnv() === 'test'

export const isProd = (): boolean => getEnv() === 'prod'

export const getJwtSecret = (): string => process.env.JWT_SECRET || 'some_secret'

export const getJwtExpiresIn = (): string => process.env.JWT_EXPIRES_IN || '1d'

export const getAppBaseUrl = (): string => process.env.APP_BASE_URL || 'http://localhost:8080'
