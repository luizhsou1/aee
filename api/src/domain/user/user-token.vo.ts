import { Expose } from 'class-transformer'
import { Column, CreateDateColumn, Entity, ManyToOne } from 'typeorm'

import { generateUuid } from '../../shared/utils'
import { User } from './user.entity'

export enum TokenType {
  RECOVER_PASSWORD_TOKEN = 'RECOVER_PASSWORD_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN'
}

@Entity()
export class UserToken {
  private static readonly DAYS_TO_EXPIRE_RECOVER_PASSWORD_TOKEN = 1
  private static readonly DAYS_TO_EXPIRE_REFRESH_TOKEN = 1

  @Expose()
  @Column('text', { primary: true })
  private token: string

  @Expose()
  @ManyToOne(() => User, { eager: true })
  private user: User

  @Expose()
  @Column({ type: 'enum', enum: TokenType })
  private type: TokenType

  @Expose()
  @Column('timestamp', { name: 'expiration_date' })
  private expirationDate: Date

  @Expose()
  @CreateDateColumn({ name: 'created_at' })
  private createdAt: Date

  getToken (): string {
    return this.token
  }

  getExpirationDate (): Date {
    return this.expirationDate
  }

  getUser (): User {
    return this.user
  }

  private constructor (user: User, type: TokenType, expirationDate: Date) {
    this.user = user
    this.type = type
    this.token = generateUuid()
    this.expirationDate = expirationDate
  }

  static createRecoverPasswordToken (user: User) {
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + UserToken.DAYS_TO_EXPIRE_RECOVER_PASSWORD_TOKEN)
    return new UserToken(user, TokenType.RECOVER_PASSWORD_TOKEN, expirationDate)
  }

  static createRefreshToken (user: User) {
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + UserToken.DAYS_TO_EXPIRE_REFRESH_TOKEN)
    return new UserToken(user, TokenType.RECOVER_PASSWORD_TOKEN, expirationDate)
  }
}
