import { CreateQuartileDto } from '../dto/create.quartile.dto'
import { PutQuartileDto } from '../dto/put.quartile.dto'
import { PatchQuartileDto } from '../dto/patch.quartile.dto'
import debug from 'debug'
import { quartileModel } from '../../models/Quartile.model'

const log: debug.IDebugger = debug('app:in-memory-dao')

class QuartileDao {
  constructor() {
    log('Created new instance of QuartileDao')
  }

  async addQuartile(quartileFields: CreateQuartileDto) {
    const quartile = new quartileModel({
      ...quartileFields
    })
    await quartile.save()
    return quartile._id
  }

  async getQuartiles(journalId: String, limit = 25, page = 0) {
    return await quartileModel.find({ journal: journalId })
      .limit(limit)
      .skip(limit * page)
      .exec()
  }

  async getQuartileById(quartileId: String) {
    return await quartileModel.findOne({ _id: quartileId })
      .exec()
  }

  async getQuartileByJournalAndArea(journalId: String, area: String, limit = 25, page = 0) {
    return await quartileModel.find({
      journal: journalId,
      area
    }).limit(limit)
      .skip(limit * page)
      .exec()
  }

  async getQuartileByJournalAndYear(journalId: String, year: Number, limit = 25, page = 0) {
    return await quartileModel.find({
      journal: journalId,
      year
    }).limit(limit)
      .skip(limit * page)
      .exec()
  }

  async getQuartileByJournalAndYearAndArea(journalId: String, year: Number, area: String) {
    return await quartileModel.findOne({
      journal: journalId,
      area,
      year
    }).exec()
  }

  async updateQuartileById(quartileId: String, quartileFields: PutQuartileDto | PatchQuartileDto) {
    try {
      const existingQuartile = await quartileModel.findByIdAndUpdate(
        { _id: quartileId },
        { $set: quartileFields },
        { new: true }
      ).exec()
      return existingQuartile
    } catch (error) {
      if (error instanceof Error) {
        console.log({ message: error.message })
      }
    }
  }

  async removeQuartilelById(quartilelId: string) {
    try {
      return await quartileModel.deleteOne({ _id: quartilelId }).exec()
    } catch (error) {
      if (error instanceof Error) {
        console.log({ message: error.message })
      }
    }
  }
}

export default new QuartileDao()
