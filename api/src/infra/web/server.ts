import { Logger } from '../../shared/logger'
import { getPort } from '../../shared/utils'
import { setupApp } from './app'

function start (): void {
  const app = setupApp()

  const port = getPort()

  app.listen(port, () => new Logger('Server')
    .info(`Running on port ${port}`)
  )
}

export default { start }
