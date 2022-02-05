import { Deficiency, DeficiencyNotFound, IDeficiencyRepo } from '../../domain'
import { isIdOrFail } from '../../domain/validations'
import { TypeormDeficiencyRepo } from '../../infra/db/repositories'
import { getInstanceOf } from '../../shared/utils'
import { IApplicationService } from '../application.service'

class UpdateDeficiencyById implements IApplicationService {
  constructor (private readonly deficiencyRepo: IDeficiencyRepo) {}

  /**
  * @throws DeficiencyNotFound
  */
  async execute (id: number | string, data: object): Promise<Deficiency> {
    isIdOrFail(id)

    const exists = await this.deficiencyRepo.exists(Number(id))
    if (!exists) {
      throw new DeficiencyNotFound()
    }

    const deficiency = getInstanceOf(Deficiency, { ...data, id })
    await deficiency.validateOrFail()

    return this.deficiencyRepo.save(deficiency)
  }
}

const updateDeficiencyById = new UpdateDeficiencyById(new TypeormDeficiencyRepo())

export { updateDeficiencyById }
