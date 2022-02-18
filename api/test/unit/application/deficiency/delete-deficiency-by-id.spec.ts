import { container } from 'tsyringe'

import { DeleteDeficiencyById } from '../../../../src/application/deficiency'
import { DeficiencyNotFoundError } from '../../../../src/domain/deficiency'
import { ValidationError } from '../../../../src/domain/errors'

describe('DeleteDeficiencyById | ApplicationService', () => {
  let deleteDeficiencyById: DeleteDeficiencyById

  const mockDeficiencyRepo = {
    exists: jest.fn().mockResolvedValue(true),
    deleteById: jest.fn().mockResolvedValue(undefined)
  }

  beforeAll(() => {
    container.registerInstance('IDeficiencyRepo', mockDeficiencyRepo)

    deleteDeficiencyById = container.resolve(DeleteDeficiencyById)
  })

  it('should delete deficiency by id', async () => {
    const result = await deleteDeficiencyById.execute(1)

    expect(mockDeficiencyRepo.exists).toHaveBeenCalledWith(1)
    expect(mockDeficiencyRepo.deleteById).toHaveBeenCalledWith(1)
    expect(result).toBeUndefined()
  })

  it('should not delete deficiency by id if invalid id', async () => {
    const promise = deleteDeficiencyById.execute(Number('abc123'))
    await expect(promise)
      .rejects
      .toThrow(ValidationError)
  })

  it('should throw "DeficiencyNotFoundError" if deficiency not found', async () => {
    mockDeficiencyRepo.exists.mockResolvedValueOnce(false)

    const promise = deleteDeficiencyById.execute(100)
    await expect(promise)
      .rejects
      .toThrow(DeficiencyNotFoundError)
  })

  it('should pass exception to front if "IDeficiencyRepo.deleteById" throws exception', async () => {
    mockDeficiencyRepo.deleteById.mockRejectedValueOnce(new Error())

    const promise = deleteDeficiencyById.execute(1)
    await expect(promise)
      .rejects
      .toThrow(Error)
  })
})
