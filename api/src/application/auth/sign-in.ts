
import { Expose } from 'class-transformer'
import { IsEmail, IsNotEmpty } from 'class-validator'
import { sign } from 'jsonwebtoken'
import { inject, singleton } from 'tsyringe'

import { User, IUserRepo, IsPassword } from '../../domain'
import { validateOrFail } from '../../domain/validations'
import { getInstanceOf, getJwtExpiresIn, getJwtSecret } from '../../shared/utils'
import { IApplicationService } from '../application.service'
import { EmailOrPasswordIncorrectError } from './auth.errors'

class SignInInput {
  @Expose() @IsEmail()
  private email: string

  @Expose() @IsNotEmpty() @IsPassword()
  private password: string
}

export interface ISignInReturn {
  user: User,
  token: string
}

@singleton()
export class SignIn implements IApplicationService {
  private readonly jwtSecret = getJwtSecret()
  private readonly jwtExpiresIn = getJwtExpiresIn()

  constructor (
    @inject('IUserRepo')
    private readonly userRepo: IUserRepo
  ) {}

  /**
   * @throws ValidationError
   * @throws EmailOrPasswordIncorrectError
   */
  async execute (email: string, password: string): Promise<ISignInReturn> {
    await validateOrFail(getInstanceOf(SignInInput, { email, password }))

    const user = await this.userRepo.findByEmail(email)
    if (!user) {
      throw new EmailOrPasswordIncorrectError()
    }

    const passwordIsEqual = await user.passwordIsEquals(password)
    if (!passwordIsEqual) {
      throw new EmailOrPasswordIncorrectError()
    }

    user.clearPassword()

    const token = sign({ email, name: user.getName(), role: user.getRole() }, this.jwtSecret, {
      subject: user.getId()?.toString(),
      expiresIn: this.jwtExpiresIn
    })

    return { user, token }
  }
}
