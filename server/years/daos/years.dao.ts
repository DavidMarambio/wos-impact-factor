import { CreateYearDto } from "../dto/create.year.dto";
import mongooseService from "../../common/services/mongoose.service";
import shortid from 'shortid'
import debug from 'debug'

const log: debug.IDebugger = debug("app:in-memory-dao")

class YearsDao {
    years: Array<CreateYearDto> = [];
    Schema = mongooseService.getMongoose().Schema;

    yearSchema = new this.Schema({
        _id: String,
        year: {
            type: Number,
            unique: true,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        }
    }, {
        id: false, versionKey: false
    });

    Year = mongooseService.getMongoose().model("Years", this.yearSchema);

    constructor() {
        log("Created new instance of YearsDao")
    }

    async addYear(yearFields: CreateYearDto) {
        const yearId = shortid.generate();
        const year = new this.Year({
            _id: yearId,
            ...yearFields
        });
        await year.save();
        return yearId;
    }

    async getYears(limit = 25, page = 0) {
        return this.Year.find().limit(limit).skip(limit * page).exec();
    }

    async getYearById(yearId: string) {
        return this.Year.findOne({ _id: yearId }).populate("Year").exec();
    }

    async getYearByYear(year: Number) {
        return this.Year.findOne({ year: year }).exec();
    }

    async getYearEnable() {
        return this.Year.findOne({ disabled: false }).exec();
    }

    async disableYear(year: Number) {
        const yearEnabled = await this.getYearByYear(year);
        if (yearEnabled && yearEnabled.disabled === false) {
            const yearDisabled = await this.Year.findOneAndUpdate(
                { _id: yearEnabled._id },
                { $set: { disabled: true } },
                { new: true }
            ).exec();
            return yearDisabled;
        }
        return;
    }
}

export default new YearsDao();