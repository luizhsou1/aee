import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

import { Entity } from '../entity'

export class Deficiency extends Entity {
  @Expose() @IsNotEmpty() private name: string
}
