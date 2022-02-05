import { DeficiencyNotFound, IDeficiencyRepo } from '../../domain'
import { isIdOrFail } from '../../domain/validations'
import { TypeormDeficiencyRepo } from '../../infra/db/repositories'
import { IApplicationService } from '../application.service'

class DeleteDeficiencyById implements IApplicationService {
  constructor (private readonly deficiencyRepo: IDeficiencyRepo) {}

  /**
  * @throws ValidationError
  * @throws DeficiencyNotFound
  */
  async execute (id: number | string): Promise<void> {
    isIdOrFail(id)

    const exists = await this.deficiencyRepo.exists(Number(id))
    if (!exists) {
      throw new DeficiencyNotFound()
    }

    await this.deficiencyRepo.deleteById(Number(id))
  }
}

const deleteDeficiencyById = new DeleteDeficiencyById(new TypeormDeficiencyRepo())

export { deleteDeficiencyById }
