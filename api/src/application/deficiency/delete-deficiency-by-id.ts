import { inject, singleton } from 'tsyringe'

import { DeficiencyNotFound, IDeficiencyRepo } from '../../domain'
import { isIdOrFail } from '../../domain/validations'
import { IApplicationService } from '../application.service'

@singleton()
export class DeleteDeficiencyById implements IApplicationService {
  constructor (
    @inject('IDeficiencyRepo')
    private readonly deficiencyRepo: IDeficiencyRepo
  ) {}

  /**
  * @throws ValidationError
  * @throws DeficiencyNotFound
  */
  async execute (id: number): Promise<void> {
    isIdOrFail(id)

    const exists = await this.deficiencyRepo.exists(id)
    if (!exists) {
      throw new DeficiencyNotFound()
    }

    await this.deficiencyRepo.deleteById(id)
  }
}
