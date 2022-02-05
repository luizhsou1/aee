import { Expose } from 'class-transformer'
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm'

@Entity('deficiency')
export class TypeormDeficiency extends BaseEntity {
  @Expose() @PrimaryGeneratedColumn()
  id: number

  @Expose() @Column('text')
  name: string

  @Expose() @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @Expose() @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
