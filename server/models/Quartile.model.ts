import { prop, Ref, modelOptions, ReturnModelType, getModelForClass } from '@typegoose/typegoose'
import mongoose from 'mongoose';
import { Journal } from './Journal.model'

@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
export class Quartile {
  readonly _id: mongoose.Types.ObjectId;

  @prop({ required: true, ref: () => Journal })
  public journal: Ref<Journal>

  @prop({ required: true })
  public area: string

  @prop({ required: true })
  public year: number

  @prop({ required: true })
  public ranking: string

  @prop({ required: true })
  public quartile: string

  @prop({ required: true })
  public percentile: number
}

export const quartileModel: ReturnModelType<typeof Quartile> = getModelForClass(Quartile)