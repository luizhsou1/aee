import { TokenType, User, UserToken } from '.'

export interface IFindUserTokenOptions {
  token: string,
  type?: TokenType
}

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
  findUserToken(options: IFindUserTokenOptions): Promise<UserToken | undefined>
  /**
   * Delete UserToken by Token
   */
  deleteUserToken(userToken: UserToken): Promise<void>
}
