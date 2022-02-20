import rTracer from 'cls-rtracer'
import winston from 'winston'

import { isProd } from '../utils'

const { version, name } = require('../../../package.json')

const customFormatJson = winston.format((info) => {
  let stack

  if (info.stack) {
    stack = info.stack
    info.stack = undefined
  }

  Object.keys(info).forEach((key) => {
    if (info[key] instanceof Function) {
      delete info[key]
    }
  })

  info = {
    ...info,
    timestamp: new Date().toISOString(),
    application: name,
    version,
    environment: process.env.NODE_ENV,
    host: process.env.HOST || process.env.HOSTNAME,
    message: info.message || '',
    level: ['verbose', 'silly'].includes(info.level) ? 'DEBUG' : info.level.toUpperCase(),
    stack_trace: stack,
    traceId: rTracer.id()
  }

  return info
})

const customCombineJson = winston.format.combine(
  customFormatJson(),
  winston.format.json()
)

const customCombineSimple = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf((info) => {
    const date = new Date(info.timestamp).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }).replace(' ', ', ')
    return `${date} - ${info.level}: ${info.message}`
  })
)

const getTransport = (): winston.transport => isProd()
  ? new winston.transports.Console({ stderrLevels: ['fatal', 'error'] })
  : new winston.transports.Console({ stderrLevels: ['fatal', 'error'] })

export const winstonConfig = {
  levels: {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    verbose: 4,
    silly: 4
  },
  level: process.env.LOGGING_LEVEL || 'debug',
  handleExceptions: true,
  format: process.env.LOGGING_SIMPLE_FORMATTER === 'true' ? customCombineSimple : customCombineJson,
  transports: [getTransport()],
  exitOnError: false
}

const logger = winston.createLogger(winstonConfig)

export default logger
