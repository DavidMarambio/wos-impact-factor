import { getModelForClass, ReturnModelType } from '@typegoose/typegoose'
import { Journal } from './Journal.model'
import { Quartile } from './Quartile.model'

export const journalModel: ReturnModelType<typeof Journal> = getModelForClass(Journal)
export const quartileModel: ReturnModelType<typeof Quartile> = getModelForClass(Quartile)