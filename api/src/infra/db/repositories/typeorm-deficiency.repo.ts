import { FindConditions, getRepository, Raw } from 'typeorm'

import { Deficiency, IDeficiencyQueryOptions, IDeficiencyRepo } from '../../../domain'
import { IPaginationOptions, Paginated } from '../../../domain/common'
import { getInstanceOf, getInstancesOf } from '../../../shared/utils'
import { TypeormDeficiency } from '../entities'

export class TypeormDeficiencyRepo implements IDeficiencyRepo {
  constructor (private readonly repo = getRepository(TypeormDeficiency)) {}

  async exists (id: number): Promise<boolean> {
    const entity = await this.repo.findOne(id, { select: ['id'] })
    return !!entity
  }

  async save (deficiency: Deficiency): Promise<Deficiency> {
    const entityToSave = getInstanceOf(TypeormDeficiency, deficiency)
    const savedEntity = await this.repo.save(entityToSave)
    return getInstanceOf(Deficiency, savedEntity)
  }

  async findById (id: number): Promise<Deficiency | undefined> {
    const entity = await this.repo.findOne(id)
    if (entity) {
      return getInstanceOf(Deficiency, entity)
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
    const where: FindConditions<TypeormDeficiency> = {}
    if (name) {
      where.name = Raw((alias) => `unaccent(${alias}) ILIKE unaccent('%${name}%')`)
    }

    const [data, total] = await this.repo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order
    })

    return new Paginated<Deficiency>(getInstancesOf(Deficiency, data), total, page, limit)
  }
}
