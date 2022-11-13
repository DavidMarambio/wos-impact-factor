import { CreateYearDto } from "../dto/create.year.dto";
import yearModel from "../../models/Year";
import debug from 'debug'

const log: debug.IDebugger = debug("app:in-memory-dao")

class YearsDao {
    years: Array<CreateYearDto> = [];

    constructor() {
        log("Created new instance of YearsDao")
    }

    async addYear(yearFields: CreateYearDto) {
        const yearInstance = new yearModel({
            ...yearFields
        });
        await yearInstance.save();
        return yearInstance.year;
    }

    async getYears(limit = 25, page = 0) {
        return yearModel.find().limit(limit).skip(limit * page).exec();
    }

    async getYearById(yearId: String) {
        return yearModel.findOne({ _id: yearId }).populate("Year").exec();
    }

    async getYearByYear(year: Number) {
        return yearModel.findOne({ year: year }).exec();
    }

    async getYearEnable() {
        return yearModel.findOne({ disabled: false }).exec();
    }

    async disableYear(year: Number) {
        const yearEnabled = await this.getYearByYear(year);
        if (yearEnabled && yearEnabled.disabled === false) {
            const yearDisabled = await yearModel.findOneAndUpdate(
                { year: yearEnabled.year },
                { $set: { disabled: true } },
                { new: true }
            ).exec();
            return yearDisabled;
        }
        return;
    }
}

export default new YearsDao();