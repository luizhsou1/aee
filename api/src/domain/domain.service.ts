export interface IDomainService {
  execute(...args: any[]): Promise<any> | any
}
