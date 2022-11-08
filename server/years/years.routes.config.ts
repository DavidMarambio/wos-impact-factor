import express from 'express'
import jwtMiddleware from "../auth/middleware/jwt.middleware";
import commonPermissionMiddleware from "../common/middleware/common.permission.middleware";
import { CommonRoutesConfig } from "../common/common.routes.config";
import { PermissionFlag } from '../common/middleware/common.permissionflag.enum';
import yearsController from './controllers/years.controller';

export class YearsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'YearsRoutes');
    }
    configureRoutes(): express.Application {

        this.app
            .route("/years")
            .get(
                jwtMiddleware.validJwtNeeded,
                commonPermissionMiddleware.permissionFlagRequired(
                    PermissionFlag.ADMIN_PERMISSION
                ),
                yearsController.listYears
            );

        this.app
        .route("/years/:yearId")
        .get(
            jwtMiddleware.validJwtNeeded,
            commonPermissionMiddleware.permissionFlagRequired(
                PermissionFlag.ADMIN_PERMISSION
            ),
            yearsController.getYearById
        )

        this.app
        .route("/years/:year")
        .get(
            jwtMiddleware.validJwtNeeded,
            commonPermissionMiddleware.permissionFlagRequired(
                PermissionFlag.ADMIN_PERMISSION
            ),
            yearsController.getYearByYear
        )


        this.app
            .route("/years/createNewYear")
            .post(
                jwtMiddleware.validJwtNeeded,
                commonPermissionMiddleware.permissionFlagRequired(
                    PermissionFlag.ADMIN_PERMISSION
                ),
                yearsController.createNewYear
            )

        return this.app;
    }
}