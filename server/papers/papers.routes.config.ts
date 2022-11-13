import express from "express";
import { body } from "express-validator";
import jwtMiddleware from "../auth/middleware/jwt.middleware";
import { CommonRoutesConfig } from "../common/common.routes.config";
import commonPermissionMiddleware from "../common/middleware/common.permission.middleware";
import { PermissionFlag } from "../common/middleware/common.permissionflag.enum";
import papersController from "./controllers/papers.controller";
import { typePapers } from "../models/Paper";
import bodyValidationMiddleware from "../common/middleware/body.validation.middleware";
import papersMiddleware from "./middleware/papers.middleware";

const typePaper = Object.keys(typePapers)

export class PapersRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "PapersRoutes");
  }

  configureRoutes(): express.Application {
    this.app
      .route('/papers')
      .get(
        jwtMiddleware.validJwtNeeded,
        commonPermissionMiddleware.roleCanReadPaper,
        papersController.listPapers
      )
      .post(
        body('year').isInt().notEmpty(),
        body('codeWos').isAlphanumeric().notEmpty(),
        body('codeDoi').isAlphanumeric().notEmpty(),
        body('typePaper').isIn(typePaper).notEmpty(),
        body('journalName').isString().notEmpty(),
        body('journalNumber').isInt(),
        body('journalVolume').isInt(),
        body('title').isString().notEmpty(),
        body('chapterPage').isInt(),
        body('numberOfPage').isInt(),
        body('initialPage').isInt(),
        body('endPage').isInt(),
        bodyValidationMiddleware.verifiBodyFieldsErrors,
        commonPermissionMiddleware.roleCanCreatePaper,
        papersMiddleware.validateSamePaperCodeDoiDoesntExist,
        papersMiddleware.validateSamePaperCodeWosDoesntExist,
        papersMiddleware.validateSamePaperTitleDoesntExist,
        papersController.createPaper
      )

    this.app.param("paperId", papersMiddleware.extractPaperId)

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
      body('year').isInt().notEmpty(),
      body('codeWos').isAlphanumeric().notEmpty(),
      body('codeDoi').isAlphanumeric().notEmpty(),
      body('typePaper').isIn(typePaper).notEmpty(),
      body('journalName').isString().notEmpty(),
      body('journalNumber').isInt(),
      body('journalVolume').isInt(),
      body('title').isString().notEmpty(),
      body('chapterPage').isInt(),
      body('numberOfPage').isInt(),
      body('initialPage').isInt(),
      body('endPage').isInt(),
      bodyValidationMiddleware.verifiBodyFieldsErrors,
      papersMiddleware.validateSameCodeDoiBelongToSamePaper,
      papersMiddleware.validateSameCodeWosBelongToSamePaper,
      papersMiddleware.validateSameTitleBelongToSamePaper,
      commonPermissionMiddleware.roleCanUpdatePaper,
      papersController.put
    ])

    this.app.patch('/papers/:paperId', [
      body('year').isInt().notEmpty().optional(),
      body('codeWos').isAlphanumeric().notEmpty().optional(),
      body('codeDoi').isAlphanumeric().notEmpty().optional(),
      body('typePaper').isIn(typePaper).notEmpty().optional(),
      body('journalName').isString().notEmpty().optional(),
      body('journalNumber').isInt().optional(),
      body('journalVolume').isInt().optional(),
      body('title').isString().notEmpty().optional(),
      body('chapterPage').isInt().optional(),
      body('numberOfPage').isInt().optional(),
      body('initialPage').isInt().optional(),
      body('endPage').isInt().optional(),
      bodyValidationMiddleware.verifiBodyFieldsErrors,
      papersMiddleware.validatePatchPaperCodeDoi,
      papersMiddleware.validatePatchPaperCodeWos,
      papersMiddleware.validatePatchPaperTitle,
      commonPermissionMiddleware.roleCanUpdatePaper,
      papersController.patch
    ])

    return this.app;
  }
}
