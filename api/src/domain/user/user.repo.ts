import { User, UserToken } from '.'

export interface IUserRepo {
  /**
   * Save or update User in repository
   * @throws UserEmailAlreadyExistsError
   */
  save(user: User): Promise<User>
  /**
   * Find User by email
   */
  findByEmail (email: string): Promise<User | undefined>
  /**
   * Find User by id
   */
  saveUserToken(userToken: UserToken): Promise<UserToken>
  /**
   * Find UserToken by Token
   */
  findUserTokenByToken(token: string): Promise<UserToken | undefined>
  /**
   * Find UserToken by Token
   */
  deleteUserToken(userToken: UserToken): Promise<void>
}
