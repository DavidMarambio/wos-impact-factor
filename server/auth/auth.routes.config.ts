import express from 'express'
import { body } from 'express-validator'
import { CommonRoutesConfig } from '../common/common.routes.config'
import bodyValidationMiddleware from '../common/middleware/body.validation.middleware'
import sessionController from '../session/controllers/session.controller'
import jwtMiddleware from './middleware/jwt.middleware'
import { inputSessionSchema } from '../session/dto/input.session.dto'

export class AuthRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'AuthRoutes')
  }

  configureRoutes(): express.Application {
    this.app.post('/auth', [
      body('email').isEmail(),
      body('password').isString(),
      bodyValidationMiddleware.verifiBodyFieldsErrors(inputSessionSchema),
      sessionController.createSessionHandler
    ])

    this.app.post('/auth/refresh-token', [(
      jwtMiddleware.validJwtNeeded,
      sessionController.refreshAccessTokenHandler
    )])

    this.app
      .route('/auth/sign-off')
      .post(
        body('email').isEmail(),
        jwtMiddleware.validJwtNeeded,
        sessionController.closeSession
      )

    return this.app
  }
}
