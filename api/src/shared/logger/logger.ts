import logger from './winston'

export class Logger {
  constructor (private readonly context?: string) {}

  info (message: string | object, ...meta: any[]) {
    logger.info(this.normalizeMessage(message), meta)
  }

  error (message: string | object, stack?: string) {
    logger.error(this.normalizeMessage(message), stack)
  }

  warn (message: string | object) {
    logger.warn(this.normalizeMessage(message))
  }

  debug (message: string | object, ...meta: any[]) {
    logger.debug(this.normalizeMessage(message), meta)
  }

  private normalizeMessage (message: string | object): string {
    const msg = typeof message === 'string' ? message : this.normalizeObject(message)
    const prefix = this.context ? `[${this.context}]` : ''
    return prefix ? `${prefix} ${msg}` : msg
  }

  private normalizeObject (obj: object): string {
    const blockListPrefix = ['Object', 'String', 'Number', 'Boolean']
    const className = obj?.constructor?.name

    const prefix = !blockListPrefix.includes(className) ? `${className}:` : ''
    return prefix ? `${prefix} ${this.stringify(obj)}` : this.stringify(obj)
  }

  private stringify (obj: Object): string {
    return JSON.stringify(obj, Object.getOwnPropertyNames(obj))
  }
}
