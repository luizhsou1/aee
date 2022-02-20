
import { IEmailProvider } from '../../application/providers'
import { Logger } from '../../shared/logger'
import { DataObject } from '../../shared/types'

export class ConsoleEmailProvider implements IEmailProvider {
  private readonly logger = new Logger(ConsoleEmailProvider.name)

  send (to: string, subject: string, template: string, variables: DataObject = {}): Promise<void> {
    this.logger.info(`simulated sending email to ${to} with subject ${subject} and template ${template} | variables ${variables}`)
    return Promise.resolve()
  }
}
