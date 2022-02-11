import { inject, singleton } from 'tsyringe'

import { User, IUserRepo } from '../../domain'
import { IApplicationService } from '../application.service'

@singleton()
export class CreateUser implements IApplicationService {
  constructor (
    @inject('IUserRepo')
    private readonly userRepo: IUserRepo
  ) {}

  /**
  * @throws ValidationError
  * @throws UserEmailAlreadyExistsError
  */
  async execute (data: object): Promise<User> {
    const user = await User.create(data)

    await user.hashPassword()

    const userSaved = await this.userRepo.save(user)
    userSaved.clearPassword()

    return userSaved
  }
}
