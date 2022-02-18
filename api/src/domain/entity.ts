import { Expose } from 'class-transformer'
import { IsDate, IsNumber, IsOptional } from 'class-validator'
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
export abstract class DomainEntity {
  @Expose() @IsOptional() @IsNumber()
  @PrimaryGeneratedColumn()
  private id?: number

  @Expose()@IsOptional()@IsDate()
  @CreateDateColumn({ name: 'created_at' })
  private createdAt: Date

  @Expose() @IsOptional() @IsDate()
  @UpdateDateColumn({ name: 'updated_at' })
  private updatedAt: Date

  getId (): number | undefined {
    if (this.id) return this.id
  }
}
