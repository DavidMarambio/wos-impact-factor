import { prop, Ref, modelOptions } from '@typegoose/typegoose'
import mongoose from 'mongoose'
import { Quartile } from './Quartile.model'

@modelOptions({
  schemaOptions: {
    _id: false
  }
})
class ImpactFactor {
  @prop({ required: true })
  public year: number

  @prop({ required: true })
  public value: number
}

@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
export class Journal {
  readonly _id: mongoose.Types.ObjectId;

  @prop({ unique: true })
  public wosId?: string

  @prop({ required: true, uppercase: true, trim: true })
  public name: string

  @prop({
    ref: () => Quartile,
    localField: "_id",
    foreignField: "journal",
    justOne: false
  })
  public quartile?: Array<Ref<Quartile>>

  @prop({ type: () => ImpactFactor })
  public impactFactor?: ImpactFactor[]
}