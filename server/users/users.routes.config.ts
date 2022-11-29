import express from 'express'
import { CommonRoutesConfig } from '../common/common.routes.config'
import usersController from './controllers/users.controller'
import commonPermissionMiddleware from '../common/middleware/common.permission.middleware'
import bodyValidationMiddleware from '../common/middleware/body.validation.middleware'
import usersMiddleware from './middleware/users.middleware'
import jwtMiddleware from '../auth/middleware/jwt.middleware'
import { createUserSchema, forgotPasswordSchema, resetPasswordSchema, verifyUserSchema } from './dto/create.user.dto'
import { updateUserSchema } from './dto/put.user.dto'

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'UsersRoutes')
  }

  configureRoutes(): express.Application {
    this.app
      .route('/users')
      .get(
        jwtMiddleware.validJwtNeeded,
        commonPermissionMiddleware.roleCanReadUser,
        usersController.listUsers
      )

    this.app
      .route('/users')
      .post(
        bodyValidationMiddleware.verifiBodyFieldsErrors(createUserSchema),
        // commonPermissionMiddleware.roleCanCreateUser,
        usersMiddleware.validateSameEmailDoesntExist,
        usersController.createUser
      )

    this.app.param('userId', usersMiddleware.extractUserId)

    this.app
      .route('/users/:userId')
      .all(
        jwtMiddleware.validJwtNeeded,
        usersMiddleware.validateUserExists
      )
      .get(
        commonPermissionMiddleware.roleCanReadUser,
        usersController.getUserById
      )
      .delete(
        commonPermissionMiddleware.roleCanDeleteUser,
        usersController.removeUser
      )

    this.app
      .route('/users/:userId')
      .put(
        jwtMiddleware.validJwtNeeded,
        bodyValidationMiddleware.verifiBodyFieldsErrors(updateUserSchema),
        usersMiddleware.validateSameEmailBelongToSameUser,
        commonPermissionMiddleware.roleCanUpdateUser,
        usersController.put
      )

    this.app
      .route('/users/:userId')
      .patch(
        jwtMiddleware.validJwtNeeded,
        bodyValidationMiddleware.verifiBodyFieldsErrors(updateUserSchema),
        usersMiddleware.validatePatchEmail,
        commonPermissionMiddleware.roleCanUpdateUser,
        usersController.patch
      )

    this.app
      .route('/users/:userId/role/:role')
      .put(
        jwtMiddleware.validJwtNeeded,
        commonPermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
        commonPermissionMiddleware.roleCanUpdateUser,
        usersController.updateRole
      )

    this.app
      .route('/users/verify/:id/:verificationCode')
      .post(
        bodyValidationMiddleware.verifiBodyFieldsErrors(verifyUserSchema),
        usersController.verifyUser
      )

    this.app
      .route('/users/forgotpassword/:email')
      .post(
        bodyValidationMiddleware.verifiBodyFieldsErrors(forgotPasswordSchema),
        usersController.forgotPassword
      )

    this.app
      .route('/users/resetpassword/:id/:passwordResetCode')
      .post(
        bodyValidationMiddleware.verifiBodyFieldsErrors(resetPasswordSchema),
        usersController.resetPassword
      )

    return this.app
  }
}
