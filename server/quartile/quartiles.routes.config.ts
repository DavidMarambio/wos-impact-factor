import express from "express";
import { body } from "express-validator";
import jwtMiddleware from "../auth/middleware/jwt.middleware";
import { CommonRoutesConfig } from "../common/common.routes.config";
import commonPermissionMiddleware from "../common/middleware/common.permission.middleware";
import { PermissionFlag } from "../common/middleware/common.permissionflag.enum";
import quartilesController from "./controllers/quartiles.controller";
import bodyValidationMiddleware from "../common/middleware/body.validation.middleware";
import quartilesMiddleware from "./middleware/quartiles.middleware";

export class QuartilesRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, "QuartilesRoutes");
    }

    configureRoutes(): express.Application {
        this.app
            .route('/quartiles')
            .get(
                jwtMiddleware.validJwtNeeded,
                commonPermissionMiddleware.permissionFlagRequired(
                    PermissionFlag.ALL_PERMISSIONS
                ),
                quartilesController.listQuartiles
            )
            .post(
                body('journalId').isString(),
                body('area').isString(),
                body('year').isNumeric(),
                body('ranking').isString(),
                body('quartile').isString(),
                body('percentile').isDecimal(),
                bodyValidationMiddleware.verifiBodyFieldsErrors,
                quartilesMiddleware.validateSameQuartileWithJournalAreaAndYearDoesntExist,
                quartilesController.createQuartile
            )

        this.app.param("quartileId", quartilesMiddleware.extractQuartileId)

        this.app
            .route('/quartiles/:quartileId')
            .all(
                quartilesMiddleware.validateQuartileExists,
                jwtMiddleware.validJwtNeeded,
                commonPermissionMiddleware.onlySameUserOrAdminCanDoThisAction
            )
            .get(quartilesController.getQuartileById)
            .delete(quartilesController.removeQuartile)

        this.app
            .route('/quartiles/:quartileId')
            .put(
                body('journalId').isString(),
                body('area').isString(),
                body('year').isNumeric(),
                body('ranking').isString(),
                body('quartile').isString(),
                body('percentile').isDecimal(),
                bodyValidationMiddleware.verifiBodyFieldsErrors,
                quartilesMiddleware.validateSameJournalAreaAndYearBelongToSameQuartile,
                commonPermissionMiddleware.permissionFlagRequired(
                    PermissionFlag.ALL_PERMISSIONS
                ),
                quartilesController.put
            )

        this.app
            .route('/quartiles/journal/:journalId/area/:area/year/:year')
            .get(
                quartilesMiddleware.validateQuartileExists,
                jwtMiddleware.validJwtNeeded,
                commonPermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
                quartilesController.getQuartileByJournalYearAndArea
            )

        this.app
            .route('/quartiles/journal/:journalId/area/:area')
            .get(
                quartilesMiddleware.validateQuartileExists,
                jwtMiddleware.validJwtNeeded,
                commonPermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
                quartilesController.getQuartileByJournalAndArea
            )

        this.app
            .route('/quartiles/journal/:journalId/year/:year')
            .get(
                quartilesMiddleware.validateQuartileExists,
                jwtMiddleware.validJwtNeeded,
                commonPermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
                quartilesController.getQuartileByJournalAndYear
            )

        this.app.patch('/quartiles/:quartileId', [
            body('journalId').isString().optional(),
            body('area').isString().optional(),
            body('year').isNumeric().optional(),
            body('ranking').isString().optional(),
            body('quartile').isString().optional(),
            body('percentile').isDecimal().optional(),
            bodyValidationMiddleware.verifiBodyFieldsErrors,
            quartilesMiddleware.validatePatchQuartile,
            commonPermissionMiddleware.permissionFlagRequired(
                PermissionFlag.ALL_PERMISSIONS
            ),
            quartilesController.patch
        ])

        return this.app;
    }
}
