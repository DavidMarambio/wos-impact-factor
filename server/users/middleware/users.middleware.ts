import express from 'express'
import usersService from '../services/users.service'
import debug from 'debug'
import { Roles } from '../../models/User.model'

const log: debug.IDebugger = debug('app:users-controller')
class UsersMiddleware {
  async validateRequiredUserBodyFields(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.body && req.body.email && req.body.password) {
      next()
    } else {
      res
        .status(400)
        .send({ error: 'Missing required fields email and password' })
    }
  }

  async validateSameEmailDoesntExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user = await usersService.getUserByEmail(req.body.email)
    user != null ?
      res.status(400).send({ error: 'User email already exists' }) :
      next()
  }

  async validateSameEmailBelongToSameUser(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (res.locals.user.role === Roles.ADMIN || res.locals.user._id === req.params.userId) {
      next()
    } else {
      res.status(400).send({ error: 'Invalid user' })
    }
  }

  async validatePatchEmail(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.body.email) {
      log('Validating email', req.body.email)
      this.validateSameEmailBelongToSameUser(req, res, next)
    } else {
      next()
    }
  }

  async validateUserExists(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user = await usersService.readById(req.params.userId)
    if (user != null) {
      next()
    } else {
      res.status(404).send({ error: `User ${req.params.userId} not found` })
    }
  }

  async extractUserId(
    req: express.Request,
    _res: express.Response,
    next: express.NextFunction
  ) {
    req.body.id = req.params.userId
    next()
  }
}
export default new UsersMiddleware()
