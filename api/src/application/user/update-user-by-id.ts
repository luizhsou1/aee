import { inject, singleton } from 'tsyringe'

import { User, IUserRepo, UserNotFoundError } from '../../domain/user'
import { isIdOrFail } from '../../domain/validations'
import { Logger } from '../../shared/logger'
import { IApplicationService } from '../application.service'

@singleton()
export class UpdateUserById implements IApplicationService {
  private readonly logger = new Logger(UpdateUserById.name)

  constructor (
    @inject('IUserRepo')
    private readonly userRepo: IUserRepo
  ) {}

  /**
  * @throws ValidationError
  */
  async execute (id: number, data: Record<string, any>): Promise<User> {
    isIdOrFail(id)

    const user = await this.userRepo.findById(id)
    if (!user) {
      throw new UserNotFoundError()
    }

    const userToSave = await User.create({ ...data, id }, { skipMissingProperties: true })
    if (data.password) {
      await user.passwordIsDiffOrFail(data.password)

      await userToSave.hashPassword()
    }

    const savedUser = await this.userRepo.save(userToSave)
    savedUser.clearPassword()

    this.logger.info(`User with id ${id} updated ${JSON.stringify(savedUser)}`)

    return savedUser
  }
}
