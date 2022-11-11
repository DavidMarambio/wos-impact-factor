import { prop, Ref, modelOptions, getModelForClass, ReturnModelType } from '@typegoose/typegoose'
import { Quartile } from './Quartile';

@modelOptions({
    schemaOptions: {
        _id: false,
    },
})
class ImpactFactor {
    @prop({ required: true })
    public year: number
    @prop({ required: true })
    public value: number
}

@modelOptions({
    schemaOptions: {
        timestamps: true,
    },
})
export class Journal {
    @prop({ unique: true })
    public wosId?: string;
    @prop({ required: true, uppercase: true, trim: true })
    public name: string;
    @prop({ ref: () => Quartile })
    public quartile?: Ref<Quartile>[];
    @prop({ type: () => ImpactFactor })
    public impactFactor?: ImpactFactor[]
}

const journalModel: ReturnModelType<typeof Journal> = getModelForClass(Journal);
export default journalModel;