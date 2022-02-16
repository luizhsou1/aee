import { container } from 'tsyringe'

import { UpdateDeficiencyById } from '../../../../src/application/deficiency'
import { Deficiency, DeficiencyNotFoundError } from '../../../../src/domain/deficiency'
import { ValidationError } from '../../../../src/domain/errors'

describe('UpdateDeficiencyById | ApplicationService', () => {
  let updateDeficiencyById: UpdateDeficiencyById

  const mockDeficiencyRepo = {
    exists: jest.fn().mockResolvedValue(true),
    save: jest.fn().mockResolvedValue(new Deficiency())
  }

  beforeAll(() => {
    container.registerInstance('IDeficiencyRepo', mockDeficiencyRepo)

    updateDeficiencyById = container.resolve(UpdateDeficiencyById)
  })

  it('should update deficiency by id', async () => {
    const result = await updateDeficiencyById.execute(1, { name: 'Síndrome de Up' })

    expect(mockDeficiencyRepo.exists).toHaveBeenCalledWith(1)
    expect(mockDeficiencyRepo.save).toHaveBeenCalledWith(expect.any(Deficiency))
    expect(mockDeficiencyRepo.save).toHaveBeenCalledWith(expect.objectContaining({
      id: 1,
      name: 'Síndrome de Up'
    }))
    expect(result).toBeInstanceOf(Deficiency)
  })

  it('should not update deficiency by id if invalid id', async () => {
    const promise = updateDeficiencyById.execute(Number('abc123'), { name: 'Síndrome de Up' })
    await expect(promise)
      .rejects
      .toThrow(ValidationError)
  })

  it('should not update deficiency without name', async () => {
    const promise = updateDeficiencyById.execute(1, {})
    await expect(promise)
      .rejects
      .toThrow(ValidationError)
  })

  it('should throw "DeficiencyNotFoundError" if deficiency not found', async () => {
    mockDeficiencyRepo.exists.mockResolvedValueOnce(false)

    const promise = updateDeficiencyById.execute(100, { name: 'Síndrome de Up' })
    await expect(promise)
      .rejects
      .toThrow(DeficiencyNotFoundError)
  })

  it('should pass exception to front if "IDeficiencyRepo.deleteById" throws exception', async () => {
    mockDeficiencyRepo.save.mockRejectedValueOnce(new Error())

    const promise = updateDeficiencyById.execute(1, { name: 'Síndrome de Up' })
    await expect(promise)
      .rejects
      .toThrow(Error)
  })
})
