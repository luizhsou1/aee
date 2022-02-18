import { getRepository, Repository } from 'typeorm'

import { Deficiency } from '../../../../src/domain/deficiency'
import { closeConnectionWithDatabase, connectToDatabase, dropDatabase } from '../../../../src/infra/db'
import { DeficiencyRepo } from '../../../../src/infra/db/repositories'
import { getInstanceOf } from '../../../../src/shared/utils'

describe('DeficiencyRepo | Repository', () => {
  let repo: DeficiencyRepo
  let typeormRepo: Repository<Deficiency>

  const initialConfigDb = async () => {
    await connectToDatabase()

    typeormRepo = getRepository(Deficiency)

    const deficiency = getInstanceOf(Deficiency, { name: 'Síndrome de Down' })

    await typeormRepo.save([deficiency, deficiency, deficiency])
  }

  beforeAll(async () => {
    await initialConfigDb()

    repo = new DeficiencyRepo()
  })

  afterAll(async () => {
    await dropDatabase()
    await closeConnectionWithDatabase()
  })

  describe('exists', () => {
    it('should return "true" if exists deficiency in database', async () => {
      expect(await repo.exists(1)).toBe(true)
    })

    it('should return "false" if not exists deficiency in database', async () => {
      expect(await repo.exists(10)).toBe(false)
    })
  })

  describe('save', () => {
    it('should insert deficiency in database', async () => {
      const deficiency = getInstanceOf(Deficiency, { name: 'Síndrome de Down' })

      const result = await repo.save(deficiency)

      expect(result).toEqual(expect.any(Deficiency))
      expect(result).toMatchObject({
        id: 4,
        name: 'Síndrome de Down',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    })

    it('should fails to save deficiency in database with property not null is null', async () => {
      const deficiency = getInstanceOf(Deficiency, {})
      await expect(repo.save(deficiency))
        .rejects
        .toThrow()
    })

    it('should update deficiency in database', async () => {
      const deficiency = getInstanceOf(Deficiency, { id: 4, name: 'Síndrome de Up' })

      const result = await repo.save(deficiency)

      expect(result).toEqual(expect.any(Deficiency))
      expect(result).toMatchObject({
        id: 4,
        name: 'Síndrome de Up',
        updatedAt: expect.any(Date)
      })
    })
  })

  describe('findById', () => {
    it('should return "deficiency" if exists deficiency in database', async () => {
      const result = await repo.findById(4)

      expect(result).toEqual(expect.any(Deficiency))
      expect(result).toMatchObject({
        id: 4,
        name: 'Síndrome de Up',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      })
    })

    it('should return "undefined" if not exists deficiency in database', async () => {
      expect(await repo.findById(10)).toBeUndefined()
    })
  })

  describe('deleteById', () => {
    it('should return "undefined" if exists deficiency deleted of database', async () => {
      expect(await repo.deleteById(3)).toBeUndefined()
      expect(await repo.exists(3)).toBe(false)
    })
  })

  describe('find', () => {
    it('should return "Paginated<Deficiency>"', async () => {
      const result = await repo.find()
      expect(result).toEqual({
        total: 3,
        page: 1,
        limit: 10,
        totalSearched: 3,
        data: expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            name: 'Síndrome de Down',
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
          }),
          expect.objectContaining({
            id: 2,
            name: 'Síndrome de Down',
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
          }),
          expect.objectContaining({
            id: 4,
            name: 'Síndrome de Up',
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
          })
        ])
      })
    })

    it('should return "Paginated<Deficiency>" with options', async () => {
      const result = await repo.find({
        name: 'up'
      })

      expect(result).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        totalSearched: 1,
        data: expect.arrayContaining([
          expect.objectContaining({
            id: 4,
            name: 'Síndrome de Up',
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
          })
        ])
      })
    })

    it('should return empty data "Paginated<Deficiency>" with options', async () => {
      const result = await repo.find({
        page: 2
      })

      expect(result).toEqual({
        total: 3,
        page: 2,
        limit: 10,
        totalSearched: 0,
        data: []
      })
    })
  })
})
