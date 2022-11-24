import { CRUD } from '../../common/interfaces/crud.interface'
import quartileDao from '../daos/quartile.dao'
import { CreateQuartileDto } from '../dto/create.quartile.dto'
import { PatchQuartileDto } from '../dto/patch.quartile.dto'
import { PutQuartileDto } from '../dto/put.quartile.dto'

class QuartileService implements CRUD {
  async list (limit: number, page: number) {
  };

  async listQuartilesByJournal (journalId: string, limit: number, page: number) {
    return await quartileDao.getQuartiles(journalId, limit, page)
  }

  async create (resource: CreateQuartileDto) {
    return await quartileDao.addQuartile(resource)
  };

  async putById (id: string, resource: PutQuartileDto) {
    return await quartileDao.updateQuartileById(id, resource)
  };

  async readById (id: string) {
    return await quartileDao.getQuartileById(id)
  };

  async readByJournalAndArea (journalId: string, area: string) {
    return await quartileDao.getQuartileByJournalAndArea(journalId, area)
  }

  async readByJournalAndYear (journalId: string, year: number) {
    return await quartileDao.getQuartileByJournalAndYear(journalId, year)
  }

  async readByJournalAndYearAndArea (journalId: string, year: number, area: string) {
    return await quartileDao.getQuartileByJournalAndYearAndArea(journalId, year, area)
  }

  async deleteById (id: string) {
    return await quartileDao.removeQuartilelById(id)
  };

  async patchById (id: string, resource: PatchQuartileDto) {
    return await quartileDao.updateQuartileById(id, resource)
  };
}

export default new QuartileService()
