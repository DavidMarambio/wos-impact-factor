import express from "express";
import { body } from "express-validator";
import jwtMiddleware from "../auth/middleware/jwt.middleware";
import { CommonRoutesConfig } from "../common/common.routes.config";
import commonPermissionMiddleware from "../common/middleware/common.permission.middleware";
import { PermissionFlag } from "../common/middleware/common.permissionflag.enum";
import journalsController from "./controllers/journals.controller";
import bodyValidationMiddleware from "../common/middleware/body.validation.middleware";
import journalsMiddleware from "./middleware/journals.middleware";

export class JournalsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, "JournalsRoutes");
    }

    configureRoutes(): express.Application {
        this.app
            .route('/journals')
            .get(
                jwtMiddleware.validJwtNeeded,
                commonPermissionMiddleware.permissionFlagRequired(
                    PermissionFlag.ALL_PERMISSIONS
                ),
                journalsController.listJournals
            )
            .post(
                body('wosId').isString(),
                body('name').isString().notEmpty(),
                body('impactFactor').isArray(),
                bodyValidationMiddleware.verifiBodyFieldsErrors,
                journalsMiddleware.validateSameJournalNameDoesntExist,
                journalsMiddleware.validateSameJournalWosIdDoesntExist,
                journalsController.createJournal
            )

        this.app.param("journalId", journalsMiddleware.extractJournalId)

        this.app
            .route('/journals/:journalId')
            .all(
                journalsMiddleware.validateJournalExists,
                jwtMiddleware.validJwtNeeded,
                commonPermissionMiddleware.onlySameUserOrAdminCanDoThisAction
            )
            .get(journalsController.getJournalById)
            .delete(journalsController.removeJournal)

        this.app
            .route('/journals/:wosId')
            .get(
                journalsMiddleware.validateJournalExists,
                jwtMiddleware.validJwtNeeded,
                commonPermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
                journalsController.getJournalByWosId
            )
            .put(
                body('wosId').isString().notEmpty(),
                body('name').isString().notEmpty(),
                body('impactFactor').isArray(),
                body('quartile').isArray(),
                bodyValidationMiddleware.verifiBodyFieldsErrors,
                journalsMiddleware.validateSameWosIdBelongToSameJournal,
                commonPermissionMiddleware.permissionFlagRequired(
                    PermissionFlag.ALL_PERMISSIONS
                ),
                journalsController.put
            )

        this.app
            .route('/journals/:name')
            .get(
                journalsMiddleware.validateJournalExists,
                jwtMiddleware.validJwtNeeded,
                commonPermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
                journalsController.getJournalByName
            )
            .put(
                body('wosId').isString().notEmpty(),
                body('name').isString().notEmpty(),
                body('impactFactor').isArray(),
                body('quartile').isArray(),
                bodyValidationMiddleware.verifiBodyFieldsErrors,
                journalsMiddleware.validateSameNameBelongToSameJournal,
                commonPermissionMiddleware.permissionFlagRequired(
                    PermissionFlag.ALL_PERMISSIONS
                ),
                journalsController.put
            )


        this.app.patch('/journals/:name', [
            body('wosId').isString().notEmpty().optional(),
            body('name').isString().notEmpty().optional(),
            body('impactFactor').isArray().optional(),
            body('quartile').isArray().optional(),
            bodyValidationMiddleware.verifiBodyFieldsErrors,
            journalsMiddleware.validatePatchJournalName,
            commonPermissionMiddleware.permissionFlagRequired(
                PermissionFlag.ALL_PERMISSIONS
            ),
            journalsController.patch
        ])

        this.app.patch('/journals/:wosId', [
            body('wosId').isString().notEmpty().optional(),
            body('name').isString().notEmpty().optional(),
            body('impactFactor').isArray().optional(),
            body('quartile').isArray().optional(),
            bodyValidationMiddleware.verifiBodyFieldsErrors,
            journalsMiddleware.validatePatchJournalWosId,
            commonPermissionMiddleware.permissionFlagRequired(
                PermissionFlag.ALL_PERMISSIONS
            ),
            journalsController.patch
        ])

        return this.app;
    }
}
