import { inject, singleton } from 'tsyringe'

import { Deficiency, DeficiencyNotFound, IDeficiencyRepo } from '../../domain'
import { isIdOrFail } from '../../domain/validations'
import { getInstanceOf } from '../../shared/utils'
import { IApplicationService } from '../application.service'

@singleton()
export class UpdateDeficiencyById implements IApplicationService {
  constructor (
    @inject('IDeficiencyRepo')
    private readonly deficiencyRepo: IDeficiencyRepo
  ) {}

  /**
  * @throws DeficiencyNotFound
  */
  async execute (id: number, data: object): Promise<Deficiency> {
    isIdOrFail(id)

    const exists = await this.deficiencyRepo.exists(id)
    if (!exists) {
      throw new DeficiencyNotFound()
    }

    const deficiency = getInstanceOf(Deficiency, { ...data, id })
    await deficiency.validateOrFail()

    return this.deficiencyRepo.save(deficiency)
  }
}
