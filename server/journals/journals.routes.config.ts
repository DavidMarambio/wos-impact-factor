import express from 'express'
import { body } from 'express-validator'
import jwtMiddleware from '../auth/middleware/jwt.middleware'
import { CommonRoutesConfig } from '../common/common.routes.config'
import commonPermissionMiddleware from '../common/middleware/common.permission.middleware'
import journalsController from './controllers/journals.controller'
import bodyValidationMiddleware from '../common/middleware/body.validation.middleware'
import journalsMiddleware from './middleware/journals.middleware'

export class JournalsRoutes extends CommonRoutesConfig {
  constructor (app: express.Application) {
    super(app, 'JournalsRoutes')
  }

  configureRoutes (): express.Application {
    this.app
      .route('/journals')
      .get(
        jwtMiddleware.validJwtNeeded,
        commonPermissionMiddleware.roleCanReadJournal,
        journalsController.listJournals
      )
      .post(
        body('wosId').isString(),
        body('name').isString().notEmpty(),
        body('impactFactor').isArray(),
        bodyValidationMiddleware.verifiBodyFieldsErrors,
        commonPermissionMiddleware.roleCanCreateJournal,
        journalsMiddleware.validateSameJournalNameDoesntExist,
        journalsMiddleware.validateSameJournalWosIdDoesntExist,
        journalsController.createJournal
      )

    this.app.param('journalId', journalsMiddleware.extractJournalId)

    this.app
      .route('/journals/:journalId')
      .all(
        journalsMiddleware.validateJournalExists,
        jwtMiddleware.validJwtNeeded
      )
      .get(
        commonPermissionMiddleware.roleCanReadJournal,
        journalsController.getJournalById
      )
      .delete(
        commonPermissionMiddleware.roleCanDeleteJournal,
        journalsController.removeJournal
      )

    this.app
      .route('/journals/:wosId')
      .get(
        journalsMiddleware.validateJournalExists,
        jwtMiddleware.validJwtNeeded,
        commonPermissionMiddleware.roleCanReadJournal,
        journalsController.getJournalByWosId
      )
      .put(
        body('wosId').isString().notEmpty(),
        body('name').isString().notEmpty(),
        body('impactFactor').isArray(),
        body('quartile').isArray(),
        bodyValidationMiddleware.verifiBodyFieldsErrors,
        journalsMiddleware.validateSameWosIdBelongToSameJournal,
        commonPermissionMiddleware.roleCanUpdateJournal,
        journalsController.put
      )

    this.app
      .route('/journals/:name')
      .get(
        journalsMiddleware.validateJournalExists,
        jwtMiddleware.validJwtNeeded,
        commonPermissionMiddleware.roleCanReadJournal,
        journalsController.getJournalByName
      )
      .put(
        body('wosId').isString().notEmpty(),
        body('name').isString().notEmpty(),
        body('impactFactor').isArray(),
        body('quartile').isArray(),
        bodyValidationMiddleware.verifiBodyFieldsErrors,
        journalsMiddleware.validateSameNameBelongToSameJournal,
        commonPermissionMiddleware.roleCanUpdateJournal,
        journalsController.put
      )

    this.app.patch('/journals/:name', [
      body('wosId').isString().notEmpty().optional(),
      body('name').isString().notEmpty().optional(),
      body('impactFactor').isArray().optional(),
      body('quartile').isArray().optional(),
      bodyValidationMiddleware.verifiBodyFieldsErrors,
      journalsMiddleware.validatePatchJournalName,
      commonPermissionMiddleware.roleCanUpdateJournal,
      journalsController.patch
    ])

    this.app.patch('/journals/:wosId', [
      body('wosId').isString().notEmpty().optional(),
      body('name').isString().notEmpty().optional(),
      body('impactFactor').isArray().optional(),
      body('quartile').isArray().optional(),
      bodyValidationMiddleware.verifiBodyFieldsErrors,
      journalsMiddleware.validatePatchJournalWosId,
      commonPermissionMiddleware.roleCanUpdateJournal,
      journalsController.patch
    ])

    return this.app
  }
}
