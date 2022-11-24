import { prop, Ref, index, modelOptions, getModelForClass, ReturnModelType } from "@typegoose/typegoose";
import mongoose from 'mongoose';
import { User } from "./User.model";

@index({ user: 1 })
@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
export class Session {
  readonly _id: mongoose.Types.ObjectId;

  @prop({ required: true, ref: () => User })
  public user: Ref<User>;

  @prop({ default: true })
  public valid: boolean;
}

const sessionModel: ReturnModelType<typeof Session> = getModelForClass(Session)
export default sessionModel