import { inject, singleton } from 'tsyringe'

import { Deficiency, DeficiencyNotFoundError, IDeficiencyRepo } from '../../domain/deficiency'
import { isIdOrFail } from '../../domain/validations'
import { IApplicationService } from '../application.service'

@singleton()
export class UpdateDeficiencyById implements IApplicationService {
  constructor (
    @inject('IDeficiencyRepo')
    private readonly deficiencyRepo: IDeficiencyRepo
  ) {}

  /**
   * @throws ValidationError
   * @throws DeficiencyNotFoundError
   */
  async execute (id: number, data: Record<string, any>): Promise<Deficiency> {
    isIdOrFail(id)

    const deficiency = await Deficiency.create({ ...data, id })

    const exists = await this.deficiencyRepo.exists(id)
    if (!exists) {
      throw new DeficiencyNotFoundError()
    }

    return this.deficiencyRepo.save(deficiency)
  }
}
