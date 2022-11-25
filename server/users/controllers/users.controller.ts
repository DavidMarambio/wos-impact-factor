import express from 'express'
import usersService from '../services/users.service'
import debug from 'debug'
import { ForgotPasswordInput, ResetPasswordInput, VerifyUserInput } from '../dto/create.user.dto'
import { PatchUserDto } from '../dto/patch.user.dto'
import { Roles } from '../../models/User.model'
import sendEmail from '../../common/utils/mailer'
import { randomString } from '../../common/utils/random.string'

const log: debug.IDebugger = debug('app:users-controller')
class UsersController {
  async listUsers(_req: express.Request, res: express.Response) {
    const users = await usersService.list(100, 0)
    res.status(200).send(users)
  }

  async getUserById(req: express.Request, res: express.Response) {
    const user = await usersService.readById(req.body.id)
    res.status(200).send(user)
  }

  async createUser(req: express.Request, res: express.Response) {
    try {
      const userId = await usersService.create(req.body)
      const user = await usersService.readById(userId.toString())
      if (user) {
        const messageEmail = await sendEmail({
          to: user.email,
          from: "test@example.com",
          subject: "Verify your email",
          text: `verification code: ${user.verificationCode}. Id: ${user._id}`,
        });

        res.status(201).send({
          id: userId,
          verificationCode: user.verificationCode,
          message: "User successfully created"
        })
      }
    } catch (error) {
      return res.status(500).send({ message: error });
    }
  }

  async patch(req: express.Request, res: express.Response) {
    log(await usersService.patchById(req.body.id, req.body))
    // HTTP 204 No Content
    res.status(204).send()
  }

  async put(req: express.Request, res: express.Response) {
    log(await usersService.putById(req.body.id, req.body))
    // HTTP 204 No Content
    res.status(204).send()
  }

  async removeUser(req: express.Request, res: express.Response) {
    log(await usersService.deleteById(req.body.id))
    // HTTP 204 No Content
    res.status(204).send()
  }

  async updateRole(req: express.Request, res: express.Response) {
    try {
      const roleEnum = req.params.role as Roles;
      const patchUserDto: PatchUserDto = { role: roleEnum }
      const updateUser = await usersService.patchById(req.params.userId, patchUserDto)
      res.status(204).send(updateUser)
    } catch (error) {
      res.status(400).send({ message: error })
    }
  }

  async verifyUser(req: express.Request<VerifyUserInput>, res: express.Response) {
    const id = req.params.id;
    const verificationCode = req.params.verificationCode;
    const user = await usersService.readById(id);
    if (!user) return res.send("Could not verify user");
    if (user.verified) return res.send("User is already verified");
    if (user.verificationCode === verificationCode) {
      user.verified = true;
      await user.save();
      return res.status(200).send("User successfully verified");
    }
    return res.status(401).send("Could not verify user");
  }

  async forgotPassword(req: express.Request<ForgotPasswordInput>, res: express.Response) {
    const message =
      "If a user with that email is registered you will receive a password reset email";
    const email = req.params.email;
    const user = await usersService.getUserByEmail(email);
    if (!user) return res.status(400).send({ message: "User is not register" })
    if (!user.verified) return res.status(400).send({ message: "User is not verified" });
    const passwordResetCode = randomString(15);
    user.passwordResetCode = passwordResetCode;
    await user.save();
    await sendEmail({
      to: user.email,
      from: "test@example.com",
      subject: "Reset your password",
      text: `Password reset code: ${passwordResetCode}. Id ${user._id.toString()}`,
    });
    return res.status(200).send({ passwordResetCode: passwordResetCode, message: message });
  }

  async resetPassword(
    req: express.Request<ResetPasswordInput["params"], {}, ResetPasswordInput["body"]>,
    res: express.Response
  ) {
    const { id, passwordResetCode } = req.params;
    const { password } = req.body;
    const user = await usersService.readById(id);
    if (!user || !user.passwordResetCode || user.passwordResetCode !== passwordResetCode) {
      return res.status(400).send("Could not reset user password");
    }
    user.passwordResetCode = null;
    user.password = password;
    await user.save();
    return res.status(200).send("Successfully updated password");
  }

}

export default new UsersController()
