import { inject, singleton } from 'tsyringe'

import { Deficiency, IDeficiencyRepo } from '../../domain'
import { IPaginationOptions, Paginated } from '../../domain/common'
import { IApplicationService } from '../application.service'

// TODO quando incluir injeção de dependência, verificar se precisa realmente deste service, já que ele só chama o repository
@singleton()
export class GetDeficiencies implements IApplicationService {
  constructor (
    @inject('IDeficiencyRepo')
    private readonly deficiencyRepo: IDeficiencyRepo
  ) {}

  async execute ({
    page = 1,
    limit = 10,
    order = {
      name: 'ASC'
    }
  } : IPaginationOptions = {}): Promise<Paginated<Deficiency>> {
    return await this.deficiencyRepo.find({ page, limit, order })
  }
}
