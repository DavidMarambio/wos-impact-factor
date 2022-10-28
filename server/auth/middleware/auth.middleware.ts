import express from "express";
import * as argon2 from "argon2";
import usersService from "../../users/services/users.service";

class AuthMiddleware {
  async verifyUserpassword(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const user: any = await usersService.getUserByEmailWithPassword(
      req.body.email
    );
    if (user) {
      const passwordhash = user.password;
      if (await argon2.verify(passwordhash, req.body.password)) {
        req.body = {
          userid: user._id,
          email: user.email,
          permissionFlags: user.permissionFlags,
        };
        return next();
      }
    }
    res.status(400).send({ errors: ["Invalid email and/or password"] });
  }
}

export default new AuthMiddleware();
