import { Paginated } from '../../../../src/domain/common'

describe('Pagination | Domain', () => {
  const data = [
    {
      field1: 'some_string_1',
      field2: 1
    },
    {
      field1: 'some_string_2',
      field2: 2
    }
  ]
  const total = 2
  const page = 1
  const limit = 10

  const expectedPaginated = expect.objectContaining({
    data,
    total,
    page,
    limit,
    totalSearched: 2
  })

  it('should generate Pagination and totalSearch automatically calculated', () => {
    const result = new Paginated(data, total, page, limit)

    expect(result).toBeInstanceOf(Paginated)
    expect(result).toEqual(expectedPaginated)
  })
})
