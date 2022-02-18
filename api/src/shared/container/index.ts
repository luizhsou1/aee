import { container } from 'tsyringe'

import { IEmailProvider } from '../../application/providers'
import { IDeficiencyRepo } from '../../domain/deficiency'
import { IUserRepo } from '../../domain/user'
import { UserRepo, DeficiencyRepo } from '../../infra/db/repositories'
import { EtherealEmailProvider, ConsoleEmailProvider } from '../../infra/email'
import { isTest } from '../utils'

container.registerInstance<IEmailProvider>(
  'IEmailProvider',
  isTest() ? new ConsoleEmailProvider() : new EtherealEmailProvider()
)

container.registerSingleton<IDeficiencyRepo>(
  'IDeficiencyRepo',
  DeficiencyRepo
)

container.registerSingleton<IUserRepo>(
  'IUserRepo',
  UserRepo
)
