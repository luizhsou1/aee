import { NotFoundError } from '../errors'

export class DeficiencyNotFoundError extends NotFoundError {
  constructor () {
    super('Deficiência não encontrada')
  }
}
