export type OrderType = 'ASC' | 'DESC'

export interface IOrderPaginationOptions {
  [key: string]: OrderType
}

export interface IPaginationOptions {
  page?: number,
  limit?: number,
  order?: IOrderPaginationOptions
}

export class Paginated<Entity> {
  private readonly totalSearched: number
  constructor (
    private readonly data: Entity[],
    private readonly total: number,
    private readonly page: number,
    private readonly limit: number
  ) {
    this.totalSearched = data.length
  }
}
