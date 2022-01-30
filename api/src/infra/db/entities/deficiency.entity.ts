import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm'

@Entity('deficiency')
export class DeficiencyEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number

  @Column('text')
  name!: string

  @CreateDateColumn()
  create_at!: Date

  @UpdateDateColumn()
  update_at!: Date
}
