import { container } from 'tsyringe'

import { IEmailProvider } from '../../application/providers'
import { IDeficiencyRepo, IUserRepo } from '../../domain'
import { UserRepo, DeficiencyRepo } from '../../infra/db/repositories'
import { EtherealEmailProvider } from '../../infra/email'

container.registerInstance<IEmailProvider>(
  'IEmailProvider',
  new EtherealEmailProvider()
)

container.registerSingleton<IDeficiencyRepo>(
  'IDeficiencyRepo',
  DeficiencyRepo
)

container.registerSingleton<IUserRepo>(
  'IUserRepo',
  UserRepo
)
