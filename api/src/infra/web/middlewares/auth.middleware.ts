import { isEmpty } from 'class-validator'
import { NextFunction, Request, Response } from 'express'
import { container } from 'tsyringe'

import { EnsureAuth } from '../../../domain/auth'
import { ValidationError } from '../../../domain/errors'
import { UserRole } from '../../../domain/user'

export const auth = (role: UserRole) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ensureAuth = container.resolve(EnsureAuth)

    const bearerToken = req.headers.authorization
    if (isEmpty(bearerToken)) {
      throw new ValidationError('Should have a bearer token in the authorization header of the request')
    }

    res.locals.user = ensureAuth.execute(bearerToken as string, role)
    next()
  } catch (err) {
    next(err)
  }
}

export const isAtLeastAdmin = auth(UserRole.ADMIN)

export const isAtLeastCoordinator = auth(UserRole.COORDINATOR)

export const isAtLeastTeacher = auth(UserRole.TEACHER)
