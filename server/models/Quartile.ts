import { prop, Ref, modelOptions, getModelForClass, ReturnModelType } from '@typegoose/typegoose'
import { Journal } from './Journal';

@modelOptions({
    schemaOptions: {
        _id: false,
    },
})
class Area {
    @prop({ unique: true })
    public name: string;
}

@modelOptions({
    schemaOptions: {
        timestamps: true,
    },
})
export class Quartile {
    @prop({ required: true, ref: () => Journal })
    public journal: Ref<Journal>
    @prop({ required: true, type: () => Area })
    public area: Ref<Area>
    @prop({ required: true })
    public year: number;
    @prop({ required: true })
    public ranking: string;
    @prop({ required: true })
    public quartile: string;
    @prop({ required: true })
    public percentile: number;
}

const quartileModel: ReturnModelType<typeof Quartile> = getModelForClass(Quartile);
export default quartileModel;