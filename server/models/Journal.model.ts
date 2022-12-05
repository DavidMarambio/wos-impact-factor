import { prop, modelOptions, ReturnModelType, getModelForClass } from '@typegoose/typegoose'
import mongoose from 'mongoose'

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

  @prop({ type: () => ImpactFactor })
  public impactFactor?: ImpactFactor[]
}
export const journalModel: ReturnModelType<typeof Journal> = getModelForClass(Journal)