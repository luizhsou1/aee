import { inject, singleton } from 'tsyringe'

import { DeficiencyNotFoundError, IDeficiencyRepo } from '../../domain/deficiency'
import { isIdOrFail } from '../../domain/validations'
import { Logger } from '../../shared/logger'
import { IApplicationService } from '../application.service'

@singleton()
export class DeleteDeficiencyById implements IApplicationService {
  private readonly logger = new Logger(DeleteDeficiencyById.name)
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

    this.logger.info(`Deficiency with id ${id} deleted`)
  }
}
