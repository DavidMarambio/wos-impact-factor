import { prop, Ref, modelOptions } from '@typegoose/typegoose'
import mongoose from 'mongoose';
import { Journal } from './Journal.model'

@modelOptions({
  schemaOptions: {
    _id: false
  }
})
class Area {
  @prop({ unique: true })
  public name: string
}

@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})

export class Quartile {
  readonly _id: mongoose.Types.ObjectId;

  @prop({ required: true, ref: () => Journal })
  public journal: Ref<Journal>

  @prop({ required: true, type: () => Area })
  public area: Ref<Area>

  @prop({ required: true })
  public year: number

  @prop({ required: true })
  public ranking: string

  @prop({ required: true })
  public quartile: string

  @prop({ required: true })
  public percentile: number
}