import { inject, singleton } from 'tsyringe'

import { DeficiencyNotFoundError, IDeficiencyRepo } from '../../domain'
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
  * @throws DeficiencyNotFoundError
  */
  async execute (id: number): Promise<void> {
    isIdOrFail(id)

    const exists = await this.deficiencyRepo.exists(id)
    if (!exists) {
      throw new DeficiencyNotFoundError()
    }

    await this.deficiencyRepo.deleteById(id)
  }
}
