import { prop, modelOptions, getModelForClass, ReturnModelType } from '@typegoose/typegoose'

enum Roles {
  guest = "guest",
  member = "member",
  admin = "admin"
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class User {
  @prop({ trim: true })
  public firstName: string
  @prop({ trim: true })
  public lastName: string
  @prop({ required: true, unique: true })
  public userName: string
  @prop({ required: true })
  public password: string
  @prop({ required: true, unique: true })
  public email: string
  @prop({ default: Roles.member })
  public role: Roles
}

const userModel: ReturnModelType<typeof User> = getModelForClass(User);
export default userModel;

