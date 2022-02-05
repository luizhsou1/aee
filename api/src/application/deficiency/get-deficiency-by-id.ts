import { Deficiency, DeficiencyNotFound, IDeficiencyRepo } from '../../domain'
import { isIdOrFail } from '../../domain/validations'
import { TypeormDeficiencyRepo } from '../../infra/db/repositories'
import { IApplicationService } from '../application.service'

class GetDeficiencyById implements IApplicationService {
  constructor (private readonly deficiencyRepo: IDeficiencyRepo) {}

  /**
  * @throws ValidationError
  * @throws DeficiencyNotFound
  */
  async execute (id: number | string): Promise<Deficiency> {
    isIdOrFail(id)

    const deficiency = await this.deficiencyRepo.findById(Number(id))
    if (!deficiency) {
      throw new DeficiencyNotFound()
    }

    return deficiency
  }
}

const getDeficiencyById = new GetDeficiencyById(new TypeormDeficiencyRepo())

export { getDeficiencyById }
