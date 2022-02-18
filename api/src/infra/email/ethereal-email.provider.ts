import fs from 'fs'
import handlebars from 'handlebars'
import nodemailer, { Transporter } from 'nodemailer'
import path from 'path'

import { IEmailProvider } from '../../application/providers'
import { DataObject } from '../../shared/types'
import { getServerBaseUrl } from '../../shared/utils'

export class EtherealEmailProvider implements IEmailProvider {
  private client?: Transporter
  constructor () {
    nodemailer.createTestAccount().then(async account => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass
        }
      })

      const clientOk = await transporter.verify()
      if (clientOk) {
        this.client = transporter
        console.log('Client nodemailer is registered')
      }
    }).catch((err) => console.error(`Error registering 'nodemailer' | ${err}`))
  }

  async send (to: string, subject: string, template: string, variables: DataObject = {}): Promise<void> {
    if (!this.client) {
      console.warn('Client nodemailer is not registered yet')
      return
    }

    const templatePath = path.join(__dirname, '..', '..', 'application', 'providers', 'email', 'templates', `${template}${!template.includes('.hbs') ? '.hbs' : ''}`)
    const templateFileContent = fs.readFileSync(templatePath).toString('utf-8')

    const templateParse = handlebars.compile(templateFileContent)
    const templateHtml = templateParse({
      ...variables,
      logoUrl: `${getServerBaseUrl()}/images/logo.png`
    })

    const info = await this.client.sendMail({
      to,
      from: 'AEE <noreplay-aee@mail.com>',
      subject,
      html: templateHtml
    })

    console.log(`Message sent: ${info.messageId}`)
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`)
  }
}
