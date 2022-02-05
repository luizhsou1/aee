import { container } from 'tsyringe'

import { IDeficiencyRepo } from '../../domain'
import { TypeormDeficiencyRepo } from '../../infra/db/repositories'

container.registerSingleton<IDeficiencyRepo>(
  'IDeficiencyRepo',
  TypeormDeficiencyRepo
)
