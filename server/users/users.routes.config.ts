import express from "express";
import { body } from "express-validator";
import { CommonRoutesConfig } from "../common/common.routes.config";
import usersController from "./controllers/users.controller";
import commonPermissionMiddleware from "../common/middleware/common.permission.middleware";
import bodyValidationMiddleware from "../common/middleware/body.validation.middleware";
import usersMiddleware from "./middleware/users.middleware";
import jwtMiddleware from "../auth/middleware/jwt.middleware";
import { PermissionFlag } from "../common/middleware/common.permissionflag.enum";

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "UsersRoutes");
  }

  configureRoutes(): express.Application {
    this.app
      .route("/users")
      .get(
        jwtMiddleware.validJwtNeeded,
        commonPermissionMiddleware.roleCanReadUser,
        usersController.listUsers
      )
      .post(
        body("email").isEmail(),
        body("password")
          .isLength({ min: 5 })
          .withMessage("Must include password (5+ characters)"),
        bodyValidationMiddleware.verifiBodyFieldsErrors,
        commonPermissionMiddleware.roleCanCreateUser,
        usersMiddleware.validateSameEmailDoesntExist,
        usersController.createUser
      );

    this.app.param("userId", usersMiddleware.extractUserId);

    this.app
      .route("/users/:userId")
      .all(
        usersMiddleware.validateUserExists,
        jwtMiddleware.validJwtNeeded,
        commonPermissionMiddleware.onlySameUserOrAdminCanDoThisAction
      )
      .get(
        commonPermissionMiddleware.roleCanReadUser,
        usersController.getUserById
      )
      .delete(
        commonPermissionMiddleware.roleCanDeleteUser,
        usersController.removeUser
      );

    this.app.put("/users/:userId", [
      body("email").isEmail(),
      body("password")
        .isLength({ min: 5 })
        .withMessage("Must include password (5+ characters)"),
      body("firstName").isString(),
      body("lastName").isString(),
      body("permissionFlags").isInt(),
      bodyValidationMiddleware.verifiBodyFieldsErrors,
      usersMiddleware.validateSameEmailBelongToSameUser,
      usersMiddleware.userCantChangePermission,
      commonPermissionMiddleware.roleCanUpdateUser,
      usersController.put,
    ]);

    this.app.patch("/users/:userId", [
      body("email").isEmail().optional(),
      body("password")
        .isLength({ min: 5 })
        .withMessage("Password must be 5+ characters")
        .optional(),
      body("firstName").isString().optional(),
      body("lastName").isString().optional(),
      body("permisssionFlags").isInt().optional(),
      bodyValidationMiddleware.verifiBodyFieldsErrors,
      usersMiddleware.validatePatchEmail,
      usersMiddleware.userCantChangePermission,
      commonPermissionMiddleware.roleCanUpdateUser,
      usersController.patch,
    ]);

    this.app.put("users/:userId/permissionFlags/:permissionFlags", [
      jwtMiddleware.validJwtNeeded,
      commonPermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
      commonPermissionMiddleware.roleCanUpdateUser,
      usersController.updatePermissionFlags,
    ]);

    return this.app;
  }
}
