import { getEnv, getPort } from '../../shared/utils'
import { setupApp } from './app'

function start (): void {
  const app = setupApp()

  const port = getPort()
  console.log(port)

  app.listen(port, () => console.log(`Server is running on port ${port} | Env: ${getEnv()}`))
}

export default { start }
