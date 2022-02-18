import { getRepository } from 'typeorm'

import { User, IUserRepo, UserEmailAlreadyExistsError, UserToken, IFindUserTokenOptions } from '../../../domain/user'

export class UserRepo implements IUserRepo {
  constructor (
    private readonly repo = getRepository(User),
    private readonly userTokenRepo = getRepository(UserToken)
  ) {}

  async exists (id: number): Promise<boolean> {
    // @ts-ignore
    const entity = await this.repo.findOne(id, { select: ['id'] })
    return !!entity
  }

  async save (user: User): Promise<User> {
    try {
      return await this.repo.save(user)
    } catch (error: any) {
      if (error.constraint === 'uq_user_email') {
        throw new UserEmailAlreadyExistsError(user.getEmail())
      }
      throw error
    }
  }

  async findById (id: number): Promise<User | undefined> {
    const entity = await this.repo.findOne(id)
    if (entity) {
      return entity
    }
  }

  async findByEmail (email: string): Promise<User | undefined> {
    // @ts-ignore
    return await this.repo.findOne({ email })
  }

  async saveUserToken (userToken: UserToken): Promise<UserToken> {
    return await this.userTokenRepo.save(userToken)
  }

  async findUserToken ({ token, type }: IFindUserTokenOptions): Promise<UserToken | undefined> {
    // @ts-ignore
    return await this.userTokenRepo.findOne({ token, type })
  }

  async deleteUserToken (userToken: UserToken): Promise<void> {
    // @ts-ignore
    await this.userTokenRepo.delete({ token: userToken.getToken() })
  }
}
