import { CRUD } from '../../common/interfaces/crud.interface'
import PapersDao from '../daos/papers.dao'
import { CreatePaperDto } from '../dto/create.paper.dto'
import { PatchPaperDto } from '../dto/patch.paper.dto'
import { PutPaperDto } from '../dto/put.paper.dto'

class PapersService implements CRUD {
  async create(resource: CreatePaperDto) {
    return await PapersDao.addPaper(resource)
  }

  async deleteById(id: string) {
    return await PapersDao.removePaperById(id)
  }

  async list(limit: number, page: number) {
    return await PapersDao.getPapers(limit, page)
  }

  async patchById(id: string, resource: PatchPaperDto) {
    return await PapersDao.updatePaperById(id, resource)
  }

  async readById(id: string) {
    return await PapersDao.getPaperById(id)
  }

  async putById(id: string, resource: PutPaperDto) {
    return await PapersDao.updatePaperById(id, resource)
  }

  async getPaperByTitle(title: string) {
    return await PapersDao.getPaperByTitle(title)
  }

  async getPapersByCodeDoi(codeDoi: string) {
    return await PapersDao.getPapersByCodeDoi(codeDoi)
  }

  async getPapersByCodeWos(codeWos: string) {
    return await PapersDao.getPapersByCodeWos(codeWos)
  }

  async getPapersByJournalName(journalName: string) {
    return await PapersDao.getPapersByJournalName(journalName)
  }

  async getPapersByTypePaper(typePaper: string) {
    return await PapersDao.getPapersByTypePaper(typePaper)
  }

  async getPapersByYear(year: number) {
    return await PapersDao.getPapersByYear(year)
  }

  async getJournalNameFromAllPapers() {
    return await PapersDao.getJournalsNames()
  }

  async importPapers(papers: CreatePaperDto[]) {
    return await PapersDao.insertManyPapers(papers)
  }
}

export default new PapersService()
