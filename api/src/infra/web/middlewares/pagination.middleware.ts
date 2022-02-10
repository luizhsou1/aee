import { NextFunction, Request, Response } from 'express'

import { IOrderPaginationOptions, OrderType } from '../../../domain/common'
import { ValidationError } from '../../../domain/errors'

export const pagination = (req: Request, res: Response, next: NextFunction) => {
  let pagePagination: number | undefined
  let limitPagination: number | undefined
  let orderPagination: IOrderPaginationOptions | undefined

  const { page, limit, order } = req.query as { [key: string]: string }

  if (page) {
    if (isNaN(Number(page))) {
      throw new ValidationError(`Field 'page' with value ${page}' is not a numeric value`)
    }

    pagePagination = Number(page)
    if (pagePagination <= 0) {
      throw new ValidationError(`Field 'page' with value '${pagePagination}' is not a value greater than 0`)
    }
  }

  if (limit) {
    if (isNaN(Number(limit))) {
      throw new ValidationError(`Field 'limit' with value ${limit}' is not a numeric value`)
    }

    limitPagination = Number(limit)
    if (limitPagination <= 0) {
      throw new ValidationError(`Field 'limit' with value '${limitPagination}' is not a value greater than 0`)
    }
  }

  if (order) {
    orderPagination = {}
    const sortExpressions = order.split(',')
    for (const sortExpression of sortExpressions) {
      const [field, orderType = 'ASC'] = sortExpression.split('=') as [string, OrderType]

      if (!['ASC', 'DESC'].includes(orderType)) {
        throw new ValidationError(`Field '${field}' with value '${orderType}' is invalid, one of the following values must be informed: ['ASC', 'DESC'] or no value must be informed, in order to assume the default value, what is 'ASC'`)
      }

      orderPagination[field] = orderType || 'ASC'
    }
  }

  res.locals.page = pagePagination
  res.locals.limit = limitPagination
  res.locals.order = orderPagination

  next()
}
