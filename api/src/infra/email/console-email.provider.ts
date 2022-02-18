
import { IEmailProvider } from '../../application/providers'
import { DataObject } from '../../shared/types'

export class ConsoleEmailProvider implements IEmailProvider {
  send (to: string, subject: string, template: string, variables: DataObject = {}): Promise<void> {
    console.log(`Simulated sent email to ${to} with subject ${subject} and template ${template} | variables ${variables}`)
    return Promise.resolve()
  }
}
