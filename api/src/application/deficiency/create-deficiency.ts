import { inject, singleton } from 'tsyringe'

import { Deficiency, IDeficiencyRepo } from '../../domain/deficiency'
import { Logger } from '../../shared/logger'
import { DataObject } from '../../shared/types'
import { IApplicationService } from '../application.service'

@singleton()
export class CreateDeficiency implements IApplicationService {
  private readonly logger = new Logger(CreateDeficiency.name)

  constructor (
    @inject('IDeficiencyRepo')
    private readonly deficiencyRepo: IDeficiencyRepo
  ) {}

  /**
  * @throws ValidationError
  */
  async execute (data: DataObject): Promise<Deficiency> {
    const deficiency = await Deficiency.create(data)
    const savedDeficiency = this.deficiencyRepo.save(deficiency)

    this.logger.info(`Deficiency created ${JSON.stringify(savedDeficiency)}`)

    return savedDeficiency
  }
}
