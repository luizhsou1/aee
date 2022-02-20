import { inject, singleton } from 'tsyringe'

import { Deficiency, DeficiencyNotFoundError, IDeficiencyRepo } from '../../domain/deficiency'
import { isIdOrFail } from '../../domain/validations'
import { Logger } from '../../shared/logger'
import { IApplicationService } from '../application.service'

@singleton()
export class UpdateDeficiencyById implements IApplicationService {
  private readonly logger = new Logger(UpdateDeficiencyById.name)

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

    const updatedDeficiency = this.deficiencyRepo.save(deficiency)

    this.logger.info(`Deficiency with id ${id} updated ${updatedDeficiency}`)

    return updatedDeficiency
  }
}
