import express from "express";
import { body } from "express-validator";
import { CommonRoutesConfig } from "../common/common.routes.config";
import bodyValidationMiddleware from "../common/middleware/body.validation.middleware";
import authController from "./controllers/auth.controller";
import authMiddleware from "./middleware/auth.middleware";
import jwtMiddleware from "./middleware/jwt.middleware";

export class AuthRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "AuthRoutes");
  }

  configureRoutes(): express.Application {
    this.app.post("/auth", [
      body("email").isEmail(),
      body("password").isString(),
      bodyValidationMiddleware.verifiBodyFieldsErrors,
      authMiddleware.verifyUserpassword,
      authController.createJWT,
    ]);

    this.app.post("/auth/refresh-token", [
      (jwtMiddleware.validJwtNeeded,
      jwtMiddleware.verifyRefreshBodyField,
      jwtMiddleware.validRefreshNeeded,
      authController.createJWT),
    ]);

    return this.app;
  }
}
