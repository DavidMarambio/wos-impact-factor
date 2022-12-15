import { prop, modelOptions, getModelForClass, ReturnModelType } from '@typegoose/typegoose'
@modelOptions({
  schemaOptions: {
    timestamps: true
  }
})
export class Year {
  @prop({ type: Number, required: true, unique: true })
  public year: Number

  @prop({ default: false })
  public disabled?: Boolean
}

const yearModel: ReturnModelType<typeof Year> = getModelForClass(Year)
export default yearModel
