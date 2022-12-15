import paperModel from '../../models/Paper.model'
import { CreatePaperDto } from '../dto/create.paper.dto'
import { PatchPaperDto } from '../dto/patch.paper.dto'
import { PutPaperDto } from '../dto/put.paper.dto'
import debug from 'debug'

const log: debug.IDebugger = debug('app:in-memory-dao')

class PapersDao {
  papers: CreatePaperDto[] = []

  constructor() {
    log('Created new instance of PapersDao')
  }

  async addPaper(paperFields: CreatePaperDto) {
    const paper = new paperModel({ ...paperFields })
    await paper.save()
    return paper._id.toString()
  }

  async getPapers(limit = 25, page = 0) {
    return await paperModel.find()
      .limit(limit)
      .skip(limit * page)
      .exec()
  }

  async getJournalsNames() {
    return await paperModel.find().select({ _id: 0, journalName: 1 }).exec()
  } 

  async getPapersByYear(year: number, limit = 25, page = 0) {
  return await paperModel.find({ year: year })
    .limit(limit)
    .skip(limit * page)
    .exec()
}

  async getPapersByCodeWos(codeWos: string) {
  return await paperModel.findOne({ codeWos: codeWos })
    .exec()
}

  async getPapersByCodeDoi(codeDoi: string) {
  return await paperModel.findOne({ codeDoi: codeDoi })
    .exec()
}

  async getPapersByTypePaper(typePaper: string, limit = 25, page = 0) {
  return await paperModel.find({ typePaper: typePaper })
    .limit(limit)
    .skip(limit * page)
    .exec()
}

  async getPapersByJournalName(journalName: string) {
  return await paperModel.findOne({ journalName: journalName })
    .exec()
}

  async getPaperById(paperId: string) {
  return await paperModel.findOne({ _id: paperId }).exec()
}

  async getPaperByTitle(title: string) {
  try {
    return await paperModel.findOne({ title: title }).exec()
  } catch (error) {
    if (error instanceof Error) {
      console.log({ message: error.message })
    }
  }
}

  async updatePaperById(
  paperId: string,
  paperFields: PatchPaperDto | PutPaperDto
) {
  try {
    const existingPaper = await paperModel.findOneAndUpdate(
      { _id: paperId },
      { $set: paperFields },
      { new: true }
    ).exec()
    return existingPaper
  } catch (error) {
    if (error instanceof Error) {
      console.log({ message: error.message })
    }
  }
}

  async removePaperById(paperId: string) {
  try {
    return await paperModel.deleteOne({ _id: paperId }).exec()
  } catch (error) {
    if (error instanceof Error) {
      console.log({ message: error.message })
    }
  }
}

  async insertManyPapers(papers: CreatePaperDto[]) {
  try {
    return await paperModel.insertMany(
      papers,
      { ordered: false }
    )
  } catch (error) {
    if (error instanceof Error) {
      console.log(papers)
      console.log({ message: error.message })
    }
  }
}
}

export default new PapersDao()
