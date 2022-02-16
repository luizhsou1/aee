import { container } from 'tsyringe'

import { GetDeficiencyById } from '../../../../src/application/deficiency'
import { Deficiency, DeficiencyNotFoundError } from '../../../../src/domain/deficiency'
import { ValidationError } from '../../../../src/domain/errors'

describe('GetDeficiencyById | ApplicationService', () => {
  let getDeficiencyById: GetDeficiencyById

  const mockDeficiencyRepo = {
    findById: jest.fn().mockResolvedValue(new Deficiency())
  }

  beforeAll(() => {
    container.registerInstance('IDeficiencyRepo', mockDeficiencyRepo)

    getDeficiencyById = container.resolve(GetDeficiencyById)
  })

  it('should find deficiency by id', async () => {
    const result = await getDeficiencyById.execute(1)

    expect(mockDeficiencyRepo.findById).toHaveBeenCalledWith(1)
    expect(result).toBeInstanceOf(Deficiency)
  })

  it('should not find deficiency by id if invalid id', async () => {
    const promise = getDeficiencyById.execute(Number('abc123'))
    await expect(promise)
      .rejects
      .toThrow(ValidationError)
  })

  it('should throw "DeficiencyNotFoundError" if deficiency not found', async () => {
    mockDeficiencyRepo.findById.mockResolvedValueOnce(undefined)

    const promise = getDeficiencyById.execute(100)
    await expect(promise)
      .rejects
      .toThrow(DeficiencyNotFoundError)
  })
})
