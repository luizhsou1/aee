import { inject, singleton } from 'tsyringe'

import { Deficiency, DeficiencyNotFound, IDeficiencyRepo } from '../../domain'
import { isIdOrFail } from '../../domain/validations'
import { IApplicationService } from '../application.service'

@singleton()
export class GetDeficiencyById implements IApplicationService {
  constructor (
    @inject('IDeficiencyRepo')
    private readonly deficiencyRepo: IDeficiencyRepo
  ) {}

  /**
  * @throws ValidationError
  * @throws DeficiencyNotFound
  */
  async execute (id: number): Promise<Deficiency> {
    isIdOrFail(id)

    const deficiency = await this.deficiencyRepo.findById(id)
    if (!deficiency) {
      throw new DeficiencyNotFound()
    }

    return deficiency
  }
}
