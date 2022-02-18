export interface IApplicationService {
  execute(...args: any[]): Promise<any> | any
}
