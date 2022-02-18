import { container } from 'tsyringe'

import { CreateDeficiency } from '../../../../src/application/deficiency'
import { Deficiency } from '../../../../src/domain/deficiency'
import { ValidationError } from '../../../../src/domain/errors'

describe('CreateDeficiency | ApplicationService', () => {
  let createDeficiency: CreateDeficiency

  const mockDeficiencyRepo = {
    save: jest.fn().mockResolvedValue(new Deficiency())
  }

  beforeAll(() => {
    container.registerInstance('IDeficiencyRepo', mockDeficiencyRepo)

    createDeficiency = container.resolve(CreateDeficiency)
  })

  it('should be able to create a new deficiency', async () => {
    const result = await createDeficiency.execute({ name: 'Síndrome de Down' })

    expect(mockDeficiencyRepo.save).toHaveBeenCalledWith(expect.any(Deficiency))
    expect(result).toBeInstanceOf(Deficiency)
  })

  it('should not be able to create a new deficiency without name', async () => {
    const promise = createDeficiency.execute({})
    await expect(promise)
      .rejects
      .toThrow(ValidationError)
  })

  it('should pass exception to front if "IDeficiencyRepo.save" throws exception', async () => {
    mockDeficiencyRepo.save.mockRejectedValueOnce(new Error())

    const promise = createDeficiency.execute({ name: 'Síndrome de Down' })
    await expect(promise)
      .rejects
      .toThrow(Error)
  })
})
