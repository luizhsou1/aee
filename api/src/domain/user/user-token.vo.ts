import { Expose } from 'class-transformer'
import crypto from 'crypto'
import { Column, CreateDateColumn, Entity, ManyToOne } from 'typeorm'

import { getDaysToExpireRecoverPasswordToken, getDaysToExpireRefreshToken } from '../../shared/utils'
import { User } from './user.entity'

export enum TokenType {
  RECOVER_PASSWORD_TOKEN = 'RECOVER_PASSWORD_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN'
}

@Entity()
export class UserToken {
  private static readonly DAYS_TO_EXPIRE_RECOVER_PASSWORD_TOKEN = getDaysToExpireRecoverPasswordToken()
  private static readonly DAYS_TO_EXPIRE_REFRESH_TOKEN = getDaysToExpireRefreshToken()

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

  getUser (): User {
    return this.user
  }

  isExpired (): boolean {
    return new Date() > this.expirationDate
  }

  private constructor (user: User, type: TokenType, expirationDate: Date) {
    this.user = user
    this.type = type
    this.token = this.generateToken()
    this.expirationDate = expirationDate
  }

  static create (user: User, type: TokenType) {
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() + UserToken.DAYS_TO_EXPIRE_REFRESH_TOKEN)
    return new UserToken(user, type, expirationDate)
  }

  private generateToken (): string {
    return crypto.randomBytes(24).toString('hex')
  }
}
