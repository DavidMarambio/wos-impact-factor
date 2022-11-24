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

  @prop()
    journalNumber: Number

  @prop()
    journalVolume: Number

  @prop({ required: true, trim: true, unique: true })
    title: String

  @prop()
    chapterPage: Number

  @prop()
    numberOfPages: Number

  @prop()
    initialPage: Number

  @prop()
    endPage: Number
}

const paperModel: ReturnModelType<typeof Paper> = getModelForClass(Paper)
export default paperModel
