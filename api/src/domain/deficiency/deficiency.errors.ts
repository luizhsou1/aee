import { NotFoundError } from '../errors/not-found.error'

export class DeficiencyNotFound extends NotFoundError {
  constructor () {
    super('Deficiência não encontrada')
  }
}
