import { NextFunction, Request, Response } from 'express'

import { IOrderPaginationOptions, OrderType } from '../../../domain/common'
import { ValidationError } from '../../../domain/errors'
import { isNumericOrFail, isPositiveOrFail } from '../../../shared/utils'

export const pagination = (req: Request, res: Response, next: NextFunction) => {
  let pagePagination: number | undefined
  let limitPagination: number | undefined
  let orderPagination: IOrderPaginationOptions | undefined

  const { page, limit, order } = req.query as { [key: string]: string }

  if (page) {
    isNumericOrFail(page, new ValidationError(`O valor '${page}' para campo 'page' está inválido, deve ser informado um valor numérico`))

    pagePagination = Number(page)
    isPositiveOrFail(pagePagination, new ValidationError(`O valor '${pagePagination}' para campo 'page' está inválido, deve ser informado um valor maior que 0 ou não ser informado nenhum valor, para assim pegar o valor default`))
  }

  if (limit) {
    isNumericOrFail(limit, new ValidationError(`O valor '${limit}' para campo 'limit' está inválido, deve ser informado um valor numérico`))

    limitPagination = Number(limit)
    isPositiveOrFail(limitPagination, new ValidationError(`O valor '${limitPagination}' para campo 'limit' está inválido, deve ser informado um valor maior que 0 ou não ser informado nenhum valor, para assim pegar o valor default`))
  }

  if (order) {
    orderPagination = {}
    const sortExpressions = order.split(',')
    for (const sortExpression of sortExpressions) {
      const [field, orderType = 'ASC'] = sortExpression.split('=') as [string, OrderType]

      if (!['ASC', 'DESC'].includes(orderType)) {
        throw new ValidationError(`O valor '${orderType}' para campo '${field}' está inválido, deve ser informado um dos seguintes valores: ['ASC', 'DESC'] ou não ser informado nenhum valor, para assim assumir o valor padrão, que é 'ASC'`)
      }

      orderPagination[field] = orderType || 'ASC'
    }
  }

  res.locals.page = pagePagination
  res.locals.limit = limitPagination
  res.locals.order = orderPagination

  next()
}
