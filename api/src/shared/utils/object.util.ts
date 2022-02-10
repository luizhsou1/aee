import { plainToInstance } from 'class-transformer'
import mergeDeep from 'merge-deep'

export type ClassConstructor<T> = {
  new (...args: any[]): T;
};

export const getInstanceOf = <T, V>(cls: ClassConstructor<T>, initialValues: V): T => plainToInstance(cls, initialValues, { excludeExtraneousValues: true })

export const getInstancesOf = <T, V>(cls: ClassConstructor<T>, initialsValues: V[]): T[] => initialsValues
  .map(initialValues => getInstanceOf(cls, initialValues))

export const merge = (base: object, obj: object): any => mergeDeep(base, obj)
