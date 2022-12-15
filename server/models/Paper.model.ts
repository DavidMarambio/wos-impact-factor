import { prop, getModelForClass, ReturnModelType } from '@typegoose/typegoose'
import mongoose from 'mongoose';

export enum typePapers {
  Review = 'Revisión',
  Article = 'Artículo'
}

export class Paper {
  readonly _id: mongoose.Types.ObjectId;

  @prop({ required: true })
  year: Number

  @prop({ requiered: true, unique: true })
  codeWos: String

  @prop({ requiered: true, unique: true })
  codeDoi: String

  @prop()
  typePaper: typePapers

  @prop({ required: true })
  journalName: String

  @prop({ default: 0 })
  journalNumber: Number

  @prop({ default: 0 })
  journalVolume: Number

  @prop({ required: true, trim: true, unique: true })
  title: String

  @prop({ default: 0 })
  chapterPage: Number

  @prop({ default: 0 })
  numberOfPages: Number

  @prop({ default: 0 })
  initialPage: Number

  @prop({ default: 0 })
  endPage: Number
}

const paperModel: ReturnModelType<typeof Paper> = getModelForClass(Paper)
export default paperModel
