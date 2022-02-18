import { Expose } from 'class-transformer'

import { getInstanceOf, getInstancesOf } from '../../../src/shared/utils'

class ParentObjectUtilTest {
  @Expose() private id: number
  @Expose() private createdAt: Date
  @Expose() private updatedAt: Date
}

class NestedObjectUtilTest {
  @Expose() private nestedStringField: string
}

class ObjectUtilTest extends ParentObjectUtilTest {
  @Expose() private stringField: string
  @Expose() private numberField: number
  @Expose() private booleanField: boolean
  @Expose() private nestedField: NestedObjectUtilTest
  @Expose() private arrayNestedField: NestedObjectUtilTest[]
}

describe('ObjectUtil', () => {
  const data = {
    id: 1,
    stringField: 'some_string',
    numberField: 10,
    booleanField: true,
    nestedField: {
      nestedStringField: 'some_nested_string'
    },
    arrayNestedField: [
      {
        nestedStringField: 'some_nested_string1'
      },
      {
        nestedStringField: 'some_nested_string2'
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const expectedData = expect.objectContaining({
    id: 1,
    stringField: 'some_string',
    numberField: 10,
    booleanField: true,
    nestedField: {
      nestedStringField: 'some_nested_string'
    },
    arrayNestedField: [
      {
        nestedStringField: 'some_nested_string1'
      },
      {
        nestedStringField: 'some_nested_string2'
      }
    ],
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date)
  })

  it('should get instance of ObjectUtilTest', () => {
    const result = getInstanceOf(ObjectUtilTest, data)

    expect(result).toBeInstanceOf(ObjectUtilTest)
    expect(result).toEqual(expectedData)
  })

  it('should get instances of ObjectUtilTest', () => {
    const result = getInstancesOf(ObjectUtilTest, [data, data])

    expect(result).toBeInstanceOf(Array)
    expect(result.length).toBe(2)
    expect(result).toEqual(expect.arrayContaining([expectedData, expectedData]))
  })
})
