import { DataObject } from '../../../shared/types'

export interface IEmailProvider {
  send(to: string, subject: string, template: string, variables?: DataObject): Promise<void>
}
