import { Deficiency, IDeficiencyRepo } from '../../domain'
import { TypeormDeficiencyRepo } from '../../infra/db/repositories'
import { getInstanceOf } from '../../shared/utils'
import { IApplicationService } from '../application.service'

class CreateDeficiency implements IApplicationService {
  constructor (private readonly deficiencyRepo: IDeficiencyRepo) {}

  /**
  * @throws ValidationError
  */
  async execute (data: object): Promise<Deficiency> {
    const deficiency = getInstanceOf(Deficiency, data)
    await deficiency.validateOrFail()

    return this.deficiencyRepo.save(deficiency)
  }
}

const createDeficiency = new CreateDeficiency(new TypeormDeficiencyRepo())

export { createDeficiency }
