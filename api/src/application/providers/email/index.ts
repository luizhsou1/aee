export interface IEmailProvider {
  send(to: string, subject: string, path: string, variables: { [key: string]: any }): Promise<void>
}
