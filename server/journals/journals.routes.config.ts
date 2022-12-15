import express from 'express'
import { body } from 'express-validator'
import jwtMiddleware from '../auth/middleware/jwt.middleware'
import { CommonRoutesConfig } from '../common/common.routes.config'
import commonPermissionMiddleware from '../common/middleware/common.permission.middleware'
import journalsController from './controllers/journals.controller'
import bodyValidationMiddleware from '../common/middleware/body.validation.middleware'
import journalsMiddleware from './middleware/journals.middleware'
import { createJournalSchema, updateJournalSchema } from './dto/create.journal.dto'

export class JournalsRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, 'JournalsRoutes')
  }

  configureRoutes(): express.Application {
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
        bodyValidationMiddleware.verifiBodyFieldsErrors(createJournalSchema),
        commonPermissionMiddleware.roleCanCreateJournal,
        journalsMiddleware.validateSameJournalNameDoesntExist,
        journalsMiddleware.validateSameJournalWosIdDoesntExist,
        journalsController.createJournal
      )

    this.app.param('journalId', journalsMiddleware.extractJournalId)

    this.app
      .route('/journals/:journalId')
      .all(
        jwtMiddleware.validJwtNeeded,
        journalsMiddleware.validateJournalExists
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
      .all(
        jwtMiddleware.validJwtNeeded,
        journalsMiddleware.validateJournalExists
      )
      .get(
        commonPermissionMiddleware.roleCanReadJournal,
        journalsController.getJournalByWosId
      )
      .put(
        body('wosId').isString().notEmpty(),
        body('name').isString().notEmpty(),
        body('impactFactor').isArray(),
        body('quartile').isArray(),
        bodyValidationMiddleware.verifiBodyFieldsErrors(updateJournalSchema),
        journalsMiddleware.validateSameWosIdBelongToSameJournal,
        commonPermissionMiddleware.roleCanUpdateJournal,
        journalsController.put
      )

    this.app
      .route('/journals/name/:name')
      .all(
        jwtMiddleware.validJwtNeeded,
        journalsMiddleware.validateJournalExists
      )
      .get(
        commonPermissionMiddleware.roleCanReadJournal,
        journalsController.getJournalByName
      )
      .put(
        // body('wosId').isString().notEmpty(),
        // body('name').isString().notEmpty(),
        // body('impactFactor').isArray(),
        // body('quartile').isArray(),
        // bodyValidationMiddleware.verifiBodyFieldsErrors(updateJournalSchema),
        journalsMiddleware.validateSameNameBelongToSameJournal,
        commonPermissionMiddleware.roleCanUpdateJournal,
        journalsController.put
      )

    this.app
      .route('/journals/name/:name')
      .patch(
        body('wosId').isString().notEmpty().optional(),
        body('name').isString().notEmpty().optional(),
        body('impactFactor').isArray().optional(),
        body('quartile').isArray().optional(),
        jwtMiddleware.validJwtNeeded,
        bodyValidationMiddleware.verifiBodyFieldsErrors(updateJournalSchema),
        journalsMiddleware.validatePatchJournalName,
        commonPermissionMiddleware.roleCanUpdateJournal,
        journalsController.patch
      )

    this.app
      .route('/journals/:wosId')
      .patch(
        body('wosId').isString().notEmpty().optional(),
        body('name').isString().notEmpty().optional(),
        body('impactFactor').isArray().optional(),
        body('quartile').isArray().optional(),
        jwtMiddleware.validJwtNeeded,
        bodyValidationMiddleware.verifiBodyFieldsErrors(updateJournalSchema),
        journalsMiddleware.validatePatchJournalWosId,
        commonPermissionMiddleware.roleCanUpdateJournal,
        journalsController.patch
      )

    this.app
      .route('/journals/search/:name')
      .get(
        jwtMiddleware.validJwtNeeded,
        journalsController.searchWosId
      )

    this.app
      .route('/journals/bring/:wosId/year/:year')
      .get(
        jwtMiddleware.validJwtNeeded,
        journalsController.bringJournalData
      )

    return this.app
  }
}
