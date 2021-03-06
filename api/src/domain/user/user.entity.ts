import { hash, compare } from 'bcrypt'
import { Expose } from 'class-transformer'
import { IsEmail, IsEnum, IsNotEmpty, MaxLength } from 'class-validator'
import { Column, Entity } from 'typeorm'

import { getInstanceOf } from '../../shared/utils'
import { PasswordIsEqualError } from '../auth'
import { DomainEntity } from '../entity'
import { IValidateOptions, validateOrFail } from '../validations'
import { IsPassword } from './is-password.decorator'

export enum UserRole {
  ADMIN = 'ADMIN',
  COORDINATOR = 'COORDINATOR',
  TEACHER = 'TEACHER'
}

@Entity()
export class User extends DomainEntity {
  private static readonly SALT_ROUNDS = 8

  @Expose() @IsEmail()
  @Column('text', { unique: true })
  private email: string

  @Expose() @IsPassword()
  @Column('text')
  private password?: string

  @Expose() @IsNotEmpty() @MaxLength(100)
  @Column('text')
  private name: string

  @Expose() @IsEnum(UserRole)
  @Column({ type: 'enum', enum: UserRole })
  private role: UserRole

  getEmail (): string {
    return this.email
  }

  getRole (): UserRole {
    return this.role
  }

  getName (): string {
    return this.name
  }

  clearPassword () {
    delete this.password
  }

  static async create (data: Record<string, any>, options?: IValidateOptions): Promise<User> {
    const user = getInstanceOf(User, data)
    await validateOrFail(user, options)
    return user
  }

  async hashPassword () {
    if (this.password) {
      this.password = await hash(this.password, User.SALT_ROUNDS)
    }
  }

  async setAndHashPassword (password: string) {
    this.password = password
    await this.hashPassword()
  }

  /**
   * @throws PasswordIsEqualError
   */
  async passwordIsDiffOrFail (password: string): Promise<void> {
    const passwordIsEqual = await this.passwordIsEqual(password)
    if (passwordIsEqual) {
      throw new PasswordIsEqualError()
    }
  }

  async passwordIsEqual (password: string): Promise<boolean> {
    if (!this.password) {
      throw new Error('Attribute \'password\' cannot be empty in invocation of this method')
    }

    const isEqual = await compare(password, this.password)
    return isEqual
  }
}
