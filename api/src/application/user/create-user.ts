import { inject, singleton } from 'tsyringe'

import { User, IUserRepo } from '../../domain/user'
import { Logger } from '../../shared/logger'
import { IApplicationService } from '../application.service'

@singleton()
export class CreateUser implements IApplicationService {
  private readonly logger = new Logger(CreateUser.name)

  constructor (
    @inject('IUserRepo')
    private readonly userRepo: IUserRepo
  ) {}

  /**
  * @throws ValidationError
  * @throws UserEmailAlreadyExistsError
  */
  async execute (data: Record<string, any>): Promise<User> {
    const user = await User.create(data)

    await user.hashPassword()

    const savedUser = await this.userRepo.save(user)
    savedUser.clearPassword()

    this.logger.info(`User created ${JSON.stringify(savedUser)}`)

    return savedUser
  }
}
