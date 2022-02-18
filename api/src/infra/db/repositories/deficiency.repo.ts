import { FindConditions, getRepository, Raw } from 'typeorm'

import { IPaginationOptions, Paginated } from '../../../domain/common'
import { Deficiency, IDeficiencyQueryOptions, IDeficiencyRepo } from '../../../domain/deficiency'

export class DeficiencyRepo implements IDeficiencyRepo {
  constructor (private readonly repo = getRepository(Deficiency)) {}

  async exists (id: number): Promise<boolean> {
    // @ts-ignore
    const entity = await this.repo.findOne(id, { select: ['id'] })
    return !!entity
  }

  async save (deficiency: Deficiency): Promise<Deficiency> {
    return await this.repo.save(deficiency)
  }

  async findById (id: number): Promise<Deficiency | undefined> {
    const entity = await this.repo.findOne(id)
    if (entity) {
      return entity
    }
  }

  async deleteById (id: number): Promise<void> {
    await this.repo.delete(id)
  }

  async find ({
    page = 1,
    limit = 10,
    order = {
      name: 'ASC',
      createdAt: 'ASC'
    },
    name = ''
  } : IPaginationOptions & IDeficiencyQueryOptions = {}): Promise<Paginated<Deficiency>> {
    const where: FindConditions<IDeficiencyQueryOptions> = {}
    if (name) {
      where.name = Raw((alias) => `unaccent(${alias}) ILIKE unaccent('%${name}%')`)
    }

    const [data, total] = await this.repo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order
    })

    return new Paginated<Deficiency>(data, total, page, limit)
  }
}
