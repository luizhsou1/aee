import { Deficiency } from '.'
import { Paginated, IPaginationOptions } from '../common'

export interface IDeficiencyQueryOptions {
  name?: string
}

export interface IDeficiencyRepo {
  /**
   * Checks if there is a deficiency in repository
   */
  exists(id: number): Promise<boolean>
  /**
   * Save or update Deficiency in repository
   */
  save(deficiency: Partial<Deficiency>): Promise<Deficiency>
  /**
   * Find Deficiency by id
   */
  find(options?: IPaginationOptions & IDeficiencyQueryOptions): Promise<Paginated<Deficiency>>
  /**
   * Find Deficiency by id
   */
  findById(id: number): Promise<Deficiency | undefined>
  /**
   * Delete Deficiency by id
   */
   deleteById (id: number): Promise<void>
}
