import { journalModel } from '../../models/JournalWithQuartile'
import { CreateJournalDto } from '../dto/create.journal.dto'
import { PutJournalDto } from '../dto/put.journal.dto'
import { PatchJournalDto } from '../dto/patch.journal.dto'
import debug from 'debug'

const log: debug.IDebugger = debug('app:in-memory-dao')

class JournalsDao {
  Journals: CreateJournalDto[] = []

  constructor() {
    log('Created new instance of JournalsDao')
  }

  async addJournal(journalFields: CreateJournalDto) {
    const journal = new journalModel({
      ...journalFields
    })
    await journal.save()
    return journal._id
  }

  async getJournals(limit = 25, page = 0) {
    return await journalModel.find().limit(limit).skip(limit * page).exec()
  }

  async getJournalById(journalId: String) {
    return await journalModel.findOne({ _id: journalId })
      .populate('quartile')
      .exec()
  }

  async getJournalByWosId(wosId: String) {
    return await journalModel.findOne({ wosId })
      .populate('quartile')
      .exec()
  }

  async getJournalByName(nameJournal: String) {
    return await journalModel.findOne({ name: nameJournal })
      .populate('quartile')
      .exec()
  }

  async updateJournalById(journalId: String, journalFields: PatchJournalDto | PutJournalDto) {
    try {
      const existingJournal = await journalModel.findOneAndUpdate(
        { _id: journalId },
        { $set: journalFields },
        { new: true }
      ).exec()
      return existingJournal
    } catch (error) {
      if (error instanceof Error) {
        return console.log({ message: error.message })
      }
    }
  }

  async updateJournalByName(nameJournal: String, journalFields: PatchJournalDto | PutJournalDto) {
    try {
      const existingJournal = await journalModel.findOneAndUpdate(
        { name: nameJournal },
        { $set: journalFields },
        { new: true }
      ).exec()
      return existingJournal
    } catch (error) {
      if (error instanceof Error) {
        return console.log({ message: error.message })
      }
    }
  }

  async updateJournalByWosId(wosId: String, journalFields: PatchJournalDto | PutJournalDto) {
    try {
      const existingJournal = await journalModel.findOneAndUpdate(
        { wosId },
        { $set: journalFields },
        { new: true }
      ).exec()
      return existingJournal
    } catch (error) {
      if (error instanceof Error) {
        return console.log({ message: error.message })
      }
    }
  }

  async removeJournalById(journalId: string) {
    try {
      return await journalModel.deleteOne({ _id: journalId }).exec()
    } catch (error) {
      if (error instanceof Error) {
        console.log({ message: error.message })
      }
    }
  }

  async removeJournalByWosId(wosId: string) {
    try {
      return await journalModel.deleteOne({ wosId }).exec()
    } catch (error) {
      if (error instanceof Error) {
        console.log({ message: error.message })
      }
    }
  }
}

export default new JournalsDao()
