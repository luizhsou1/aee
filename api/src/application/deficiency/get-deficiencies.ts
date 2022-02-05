import { Deficiency, IDeficiencyRepo } from '../../domain'
import { IPaginationOptions, Paginated } from '../../domain/common'
import { TypeormDeficiencyRepo } from '../../infra/db/repositories'
import { IApplicationService } from '../application.service'

// TODO quando incluir injeção de dependência, verificar se precisa realmente deste service, já que ele só chama o repository
class GetDeficiencies implements IApplicationService {
  constructor (private readonly deficiencyRepo: IDeficiencyRepo) {}

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

const getDeficiencies = new GetDeficiencies(new TypeormDeficiencyRepo())

export { getDeficiencies }
