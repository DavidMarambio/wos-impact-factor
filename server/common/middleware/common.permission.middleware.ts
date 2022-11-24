import express from 'express'
import { ForbiddenError } from '@casl/ability'
import { PERMISSION, MODEL_NAMES } from '../permissions/roles.permission'
import { getRoleAbilityForUser } from '../permissions/utils.permission'
import debug from 'debug'
import { Roles } from './common.roles.enum'
import usersService from '../../users/services/users.service'

const log: debug.IDebugger = debug('app:common-permission-middleware')
ForbiddenError.setDefaultMessage(error => `You are not allowed to ${error.action} on ${error.subjectType}`)

class CommonPermissionMiddleware {
  rolesRequired (requiredRoles: Roles) {
    return (
      _req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      try {
        const userRoles = res.locals.user.role
        if (userRoles === requiredRoles) {
          return next()
        } else {
          return res.status(403).send({ error: "you don't have permission for this action" })
        }
      } catch (error) {
        log(error)
      }
    }
  }

  async roleCanCreateUser (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const user = await usersService.readById(res.locals.user._id)
      if (user != null) {
        const ability = getRoleAbilityForUser(user)
        ForbiddenError.from(ability)
          .throwUnlessCan(PERMISSION.CREATE, MODEL_NAMES.USERS)
        return next()
      } else {
        return res.status(403).send()
      }
    } catch (error) {
      console.log({ message: error })
    }
  }

  async roleCanCreatePaper (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const user = await usersService.readById(res.locals.user._id)
      if (user != null) {
        const ability = getRoleAbilityForUser(user)
        ForbiddenError.from(ability)
          .throwUnlessCan(PERMISSION.CREATE, MODEL_NAMES.PAPERS)
        return next()
      } else {
        return res.status(403).send()
      }
    } catch (error) {
      console.log({ message: error })
    }
  }

  async roleCanCreateJournal (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const user = await usersService.readById(res.locals.user._id)
      if (user != null) {
        const ability = getRoleAbilityForUser(user)
        ForbiddenError.from(ability)
          .throwUnlessCan(PERMISSION.CREATE, MODEL_NAMES.JOURNALS)
        return next()
      } else {
        return res.status(403).send()
      }
    } catch (error) {
      console.log({ message: error })
    }
  }

  async roleCanCreateQuartile (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const user = await usersService.readById(res.locals.user._id)
      if (user != null) {
        const ability = getRoleAbilityForUser(user)
        ForbiddenError.from(ability)
          .throwUnlessCan(PERMISSION.CREATE, MODEL_NAMES.QUARTILES)
        return next()
      } else {
        return res.status(403).send()
      }
    } catch (error) {
      console.log({ message: error })
    }
  }

  async roleCanCreateYear (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const user = await usersService.readById(res.locals.user._id)
      if (user != null) {
        const ability = getRoleAbilityForUser(user)
        ForbiddenError.from(ability)
          .throwUnlessCan(PERMISSION.CREATE, MODEL_NAMES.YEARS)
        return next()
      } else {
        return res.status(403).send()
      }
    } catch (error) {
      console.log({ message: error })
    }
  }

  async roleCanReadUser (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const user = await usersService.readById(res.locals.user._id)
      if (user != null) {
        const ability = getRoleAbilityForUser(user)
        ForbiddenError.from(ability)
          .throwUnlessCan(PERMISSION.READ, MODEL_NAMES.USERS)
        return next()
      } else {
        return res.status(403).send()
      }
    } catch (error) {
      console.log({ message: error })
    }
  }

  async roleCanReadPaper (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const user = await usersService.readById(res.locals.user._id)
      if (user != null) {
        const ability = getRoleAbilityForUser(user)
        ForbiddenError.from(ability)
          .throwUnlessCan(PERMISSION.READ, MODEL_NAMES.PAPERS)
        return next()
      } else {
        return res.status(403).send()
      }
    } catch (error) {
      console.log({ message: error })
    }
  }

  async roleCanReadJournal (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const user = await usersService.readById(res.locals.user._id)
      if (user != null) {
        const ability = getRoleAbilityForUser(user)
        ForbiddenError.from(ability)
          .throwUnlessCan(PERMISSION.READ, MODEL_NAMES.JOURNALS)
        return next()
      } else {
        return res.status(403).send()
      }
    } catch (error) {
      console.log({ message: error })
    }
  }

  async roleCanReadQuartile (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const user = await usersService.readById(res.locals.user._id)
      if (user != null) {
        const ability = getRoleAbilityForUser(user)
        ForbiddenError.from(ability)
          .throwUnlessCan(PERMISSION.READ, MODEL_NAMES.QUARTILES)
        return next()
      } else {
        return res.status(403).send()
      }
    } catch (error) {
      console.log({ message: error })
    }
  }

  async roleCanReadYear (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const user = await usersService.readById(res.locals.user._id)
      if (user != null) {
        const ability = getRoleAbilityForUser(user)
        ForbiddenError.from(ability)
          .throwUnlessCan(PERMISSION.READ, MODEL_NAMES.YEARS)
        return next()
      } else {
        return res.status(403).send()
      }
    } catch (error) {
      console.log({ message: error })
    }
  }

  async roleCanUpdateUser (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const user = await usersService.readById(res.locals.user._id)
      if (user != null) {
        const ability = getRoleAbilityForUser(user)
        ForbiddenError.from(ability)
          .throwUnlessCan(PERMISSION.UPDATE, MODEL_NAMES.USERS)
        return next()
      } else {
        return res.status(403).send()
      }
    } catch (error) {
      console.log({ message: error })
    }
  }

  async roleCanUpdatePaper (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const user = await usersService.readById(res.locals.user._id)
      if (user != null) {
        const ability = getRoleAbilityForUser(user)
        ForbiddenError.from(ability)
          .throwUnlessCan(PERMISSION.UPDATE, MODEL_NAMES.PAPERS)
        return next()
      } else {
        return res.status(403).send()
      }
    } catch (error) {
      console.log({ message: error })
    }
  }

  async roleCanUpdateJournal (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const user = await usersService.readById(res.locals.user._id)
      if (user != null) {
        const ability = getRoleAbilityForUser(user)
        ForbiddenError.from(ability)
          .throwUnlessCan(PERMISSION.UPDATE, MODEL_NAMES.JOURNALS)
        return next()
      } else {
        return res.status(403).send()
      }
    } catch (error) {
      console.log({ message: error })
    }
  }

  async roleCanUpdateQuartile (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const user = await usersService.readById(res.locals.user._id)
      if (user != null) {
        const ability = getRoleAbilityForUser(user)
        ForbiddenError.from(ability)
          .throwUnlessCan(PERMISSION.UPDATE, MODEL_NAMES.QUARTILES)
        return next()
      } else {
        return res.status(403).send()
      }
    } catch (error) {
      console.log({ message: error })
    }
  }

  async roleCanUpdateYear (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const user = await usersService.readById(res.locals.user._id)
      if (user != null) {
        const ability = getRoleAbilityForUser(user)
        ForbiddenError.from(ability)
          .throwUnlessCan(PERMISSION.UPDATE, MODEL_NAMES.YEARS)
        return next()
      } else {
        return res.status(403).send()
      }
    } catch (error) {
      console.log({ message: error })
    }
  }

  async roleCanDeleteUser (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const user = await usersService.readById(res.locals.user._id)
      if (user != null) {
        const ability = getRoleAbilityForUser(user)
        ForbiddenError.from(ability)
          .throwUnlessCan(PERMISSION.DELETE, MODEL_NAMES.USERS)
        return next()
      } else {
        return res.status(403).send()
      }
    } catch (error) {
      console.log({ message: error })
    }
  }

  async roleCanDeletePaper (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const user = await usersService.readById(res.locals.user._id)
      if (user != null) {
        const ability = getRoleAbilityForUser(user)
        ForbiddenError.from(ability)
          .throwUnlessCan(PERMISSION.DELETE, MODEL_NAMES.PAPERS)
        return next()
      } else {
        return res.status(403).send()
      }
    } catch (error) {
      console.log({ message: error })
    }
  }

  async roleCanDeleteJournal (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const user = await usersService.readById(res.locals.user._id)
      if (user != null) {
        const ability = getRoleAbilityForUser(user)
        ForbiddenError.from(ability)
          .throwUnlessCan(PERMISSION.DELETE, MODEL_NAMES.JOURNALS)
        return next()
      } else {
        return res.status(403).send()
      }
    } catch (error) {
      console.log({ message: error })
    }
  }

  async roleCanDeleteQuartile (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const user = await usersService.readById(res.locals.user._id)
      if (user != null) {
        const ability = getRoleAbilityForUser(user)
        ForbiddenError.from(ability)
          .throwUnlessCan(PERMISSION.DELETE, MODEL_NAMES.QUARTILES)
        return next()
      } else {
        return res.status(403).send()
      }
    } catch (error) {
      console.log({ message: error })
    }
  }

  async roleCanDeleteYear (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const user = await usersService.readById(res.locals.user._id)
      if (user != null) {
        const ability = getRoleAbilityForUser(user)
        ForbiddenError.from(ability)
          .throwUnlessCan(PERMISSION.DELETE, MODEL_NAMES.YEARS)
        return next()
      } else {
        return res.status(403).send()
      }
    } catch (error) {
      console.log({ message: error })
    }
  }

  async onlySameUserOrAdminCanDoThisAction (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const userRole = res.locals.jwt.role
    if (
      req.params &&
      req.params.userId &&
      req.params.userId === res.locals.user._id
    ) {
      return next()
    } else {
      if (userRole === userRole.ADMIN) {
        return next()
      } else {
        res.status(403).send()
      }
    }
  }
}
export default new CommonPermissionMiddleware()
