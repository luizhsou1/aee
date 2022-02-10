import { inject, singleton } from 'tsyringe'

import { Deficiency, IDeficiencyRepo } from '../../domain'
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
    const deficiency = await Deficiency.create(data)
    return this.deficiencyRepo.save(deficiency)
  }
}
