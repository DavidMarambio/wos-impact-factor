import { prop, modelOptions, getModelForClass, ReturnModelType, index, Severity, pre, DocumentType } from '@typegoose/typegoose'
import argon2 from 'argon2'
import mongoose from 'mongoose'
import { randomString } from '../common/utils/random.string';

export enum Roles {
  GUEST = 'guest',
  MEMBER = 'member',
  ADMIN = 'admin'
}

export const privateFields = [
  "password",
  "__v",
  "verificationCode",
  "passwordResetCode",
  "verified",
];

@pre<User>("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const hash = await argon2.hash(this.password);
  this.password = hash;
  return;
})
@index({ email: 1 })
@modelOptions({
  schemaOptions: {
    timestamps: true
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class User {
  readonly _id: mongoose.Types.ObjectId;

  @prop({ required: true, trim: true })
  public firstName: string

  @prop({ required: true, trim: true })
  public lastName: string

  @prop({ required: true })
  public password: string

  @prop({ required: true, unique: true })
  public email: string

  @prop({ required: true, default: () => randomString(30) })
  verificationCode: string;

  @prop()
  passwordResetCode: string | null;

  @prop({ default: false })
  public verified: boolean;

  @prop({ default: Roles.MEMBER })
  public role: Roles

  async validatePassword(this: DocumentType<User>, candidatePassword: string) {
    try {
      return await argon2.verify(this.password, candidatePassword);
    } catch (e) {
      console.log("Could not validate password")
      return false;
    }
  }
}

const userModel: ReturnModelType<typeof User> = getModelForClass(User)
export default userModel
