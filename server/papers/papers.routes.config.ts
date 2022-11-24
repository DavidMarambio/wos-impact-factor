import express from 'express'
import { body } from 'express-validator'
import jwtMiddleware from '../auth/middleware/jwt.middleware'
import { CommonRoutesConfig } from '../common/common.routes.config'
import commonPermissionMiddleware from '../common/middleware/common.permission.middleware'
import papersController from './controllers/papers.controller'
import { typePapers } from '../models/Paper.model'
import bodyValidationMiddleware from '../common/middleware/body.validation.middleware'
import papersMiddleware from './middleware/papers.middleware'

const typePaper = Object.values(typePapers)

export class PapersRoutes extends CommonRoutesConfig {
  constructor (app: express.Application) {
    super(app, 'PapersRoutes')
  }

  configureRoutes (): express.Application {
    this.app
      .route('/papers')
      .get(
        jwtMiddleware.validJwtNeeded,
        commonPermissionMiddleware.roleCanReadPaper,
        papersController.listPapers
      )
      .post(
        body('year').toInt().isInt().notEmpty(),
        body('codeWos').isAlphanumeric().notEmpty(),
        body('codeDoi').isAlphanumeric().notEmpty(),
        body('typePaper').isIn(typePaper).notEmpty(),
        body('journalName').isString().notEmpty(),
        body('journalNumber').toInt().isInt(),
        body('journalVolume').toInt().isInt(),
        body('title').isString().notEmpty(),
        body('chapterPage').toInt().isInt(),
        body('numberOfPage').toInt().isInt(),
        body('initialPage').toInt().isInt(),
        body('endPage').toInt().isInt(),
        bodyValidationMiddleware.verifiBodyFieldsErrors,
        commonPermissionMiddleware.roleCanCreatePaper,
        papersMiddleware.validateSamePaperCodeDoiDoesntExist,
        papersMiddleware.validateSamePaperCodeWosDoesntExist,
        papersMiddleware.validateSamePaperTitleDoesntExist,
        papersController.createPaper
      )

    this.app.param('paperId', papersMiddleware.extractPaperId)

    this.app
      .route('/papers/:paperId')
      .all(
        papersMiddleware.validatePaperExists,
        jwtMiddleware.validJwtNeeded
      )
      .get(
        commonPermissionMiddleware.roleCanReadPaper,
        papersController.getPaperById
      )
      .delete(
        commonPermissionMiddleware.roleCanDeletePaper,
        papersController.removePaper
      )

    this.app.put('/papers/:paperId', [
      body('year').toInt().isInt().notEmpty(),
      body('codeWos').isAlphanumeric().notEmpty(),
      body('codeDoi').isAlphanumeric().notEmpty(),
      body('typePaper').isIn(typePaper).notEmpty(),
      body('journalName').isString().notEmpty(),
      body('journalNumber').toInt().isInt(),
      body('journalVolume').toInt().isInt(),
      body('title').isString().notEmpty(),
      body('chapterPage').toInt().isInt(),
      body('numberOfPage').toInt().isInt(),
      body('initialPage').toInt().isInt(),
      body('endPage').toInt().isInt(),
      bodyValidationMiddleware.verifiBodyFieldsErrors,
      papersMiddleware.validateSameCodeDoiBelongToSamePaper,
      papersMiddleware.validateSameCodeWosBelongToSamePaper,
      papersMiddleware.validateSameTitleBelongToSamePaper,
      commonPermissionMiddleware.roleCanUpdatePaper,
      papersController.put
    ])

    this.app.patch('/papers/:paperId', [
      body('year').toInt().isInt().notEmpty().optional(),
      body('codeWos').isAlphanumeric().notEmpty().optional(),
      body('codeDoi').isAlphanumeric().notEmpty().optional(),
      body('typePaper').isIn(typePaper).notEmpty().optional(),
      body('journalName').isString().notEmpty().optional(),
      body('journalNumber').toInt().isInt().optional(),
      body('journalVolume').toInt().isInt().optional(),
      body('title').isString().notEmpty().optional(),
      body('chapterPage').toInt().isInt().optional(),
      body('numberOfPage').toInt().isInt().optional(),
      body('initialPage').toInt().isInt().optional(),
      body('endPage').toInt().isInt().optional(),
      bodyValidationMiddleware.verifiBodyFieldsErrors,
      papersMiddleware.validatePatchPaperCodeDoi,
      papersMiddleware.validatePatchPaperCodeWos,
      papersMiddleware.validatePatchPaperTitle,
      commonPermissionMiddleware.roleCanUpdatePaper,
      papersController.patch
    ])

    this.app
      .route('/papers/massive/import')
      .post(
        body('papers.*.year').toInt().isInt().notEmpty(),
        body('papers.*.codeWos').isAlphanumeric().notEmpty(),
        body('papers.*.codeDoi').isAlphanumeric().notEmpty(),
        body('papers.*.typePaper').isIn(typePaper).notEmpty(),
        body('papers.*.journalName').isString().notEmpty(),
        body('papers.*.journalNumber').toInt().isInt(),
        body('papers.*.journalVolume').toInt().isInt(),
        body('papers.*.title').isString().notEmpty(),
        body('papers.*.chapterPage').toInt().isInt(),
        body('papers.*.numberOfPage').toInt().isInt(),
        body('papers.*.initialPage').toInt().isInt(),
        body('papers.*.endPage').toInt().isInt(),
        bodyValidationMiddleware.verifiBodyFieldsErrors,
        commonPermissionMiddleware.roleCanCreatePaper,
        papersMiddleware.validateSamePaperCodeDoiDoesntExist,
        papersMiddleware.validateSamePaperCodeWosDoesntExist,
        papersMiddleware.validateSamePaperTitleDoesntExist,
        papersController.createPaper
      )

    return this.app
  }
}
