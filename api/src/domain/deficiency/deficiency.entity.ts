import { Expose } from 'class-transformer'
import { IsNotEmpty, MaxLength } from 'class-validator'
import { Column, Entity } from 'typeorm'

import { getInstanceOf } from '../../shared/utils'
import { DomainEntity } from '../entity'
import { IValidateOptions, validateOrFail } from '../validations'

@Entity()
export class Deficiency extends DomainEntity {
  @Expose() @IsNotEmpty() @MaxLength(100)
  @Column('text')
  private name: string

  static async create (data: Record<string, any>, options?: IValidateOptions): Promise<Deficiency> {
    const deficiency = getInstanceOf(Deficiency, data)
    await validateOrFail(deficiency, options)
    return deficiency
  }
}
