import { inject, singleton } from 'tsyringe'

import { Deficiency, IDeficiencyRepo } from '../../domain'
import { getInstanceOf } from '../../shared/utils'
import { IApplicationService } from '../application.service'

@singleton()
export class CreateDeficiency implements IApplicationService {
  constructor (
    @inject('IDeficiencyRepo')
    private readonly deficiencyRepo: IDeficiencyRepo
  ) {}

  /**
  * @throws ValidationError
  */
  async execute (data: object): Promise<Deficiency> {
    const deficiency = getInstanceOf(Deficiency, data)
    await deficiency.validateOrFail()

    return this.deficiencyRepo.save(deficiency)
  }
}
