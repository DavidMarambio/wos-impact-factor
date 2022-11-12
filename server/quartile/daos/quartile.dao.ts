import quartileModel from "../../models/Quartile"
import { CreateQuartileDto } from "../dto/create.quartile.dto"
import { PutQuartileDto } from "../dto/put.quartile.dto"
import { PatchQuartileDto } from "../dto/patch.quartile.dto"
import debug from 'debug'

const log: debug.IDebugger = debug("app:in-memory-dao")

class QuartileDao {
    constructor() {
        log("Created new instance of QuartileDao")
    }

    async addQuartile(quartileFields: CreateQuartileDto) {
        const quartile = new quartileModel({
            ...quartileFields
        })
        await quartile.save()
        return quartile._id
    }

    async getQuartiles(journalId: String, limit = 25, page = 0) {
        return quartileModel.find({ journal: journalId })
            .limit(limit)
            .skip(limit * page)
            .exec()
    }

    async getQuartileById(quartileId: String) {
        return quartileModel.findOne({ _id: quartileId })
            .exec()
    }

    async getQuartileByJournalAndArea(journalId: String, area: String, limit = 25, page = 0) {
        return quartileModel.find({
            journal: journalId,
            area: area
        }).limit(limit)
            .skip(limit * page)
            .exec()
    }

    async getQuartileByJournalAndYear(journalId: String, year: Number, limit = 25, page = 0) {
        return quartileModel.find({
            journal: journalId,
            year: year
        }).limit(limit)
            .skip(limit * page)
            .exec()
    }

    async getQuartileByJournalAndYearAndArea(journalId: String, year: Number, area: String) {
        return quartileModel.findOne({
            journal: journalId,
            area: area,
            year: year
        }).exec()
    }

    async updateQuartileById(quartileId: String, quartileFields: PutQuartileDto | PatchQuartileDto) {
        try {
            const existingQuartile = await quartileModel.findByIdAndUpdate(
                { _id: quartileId },
                { $set: quartileFields },
                { new: true }
            ).exec()
            return existingQuartile;
        } catch (error) {
            if (error instanceof Error) {
                console.log({ message: error.message })
            }
        }
    }

    async removeQuartilelById(quartilelId: string) {
        try {
            return quartileModel.deleteOne({ _id: quartilelId }).exec();
        } catch (error) {
            if (error instanceof Error) {
                console.log({ message: error.message })
            }
        }
    }


}

export default new QuartileDao()