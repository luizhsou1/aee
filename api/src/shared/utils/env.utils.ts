const getEnv = (): string => {
  const env = process.env.NODE_ENV || 'dev'
  return ['dev', 'test', 'prod'].includes(env) ? env : 'dev'
}

export const isDev = (): boolean => getEnv() === 'dev'

export const isTest = (): boolean => getEnv() === 'test'

export const isProd = (): boolean => getEnv() === 'prod'
