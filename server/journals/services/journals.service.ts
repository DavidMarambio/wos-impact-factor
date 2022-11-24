import { CRUD } from '../../common/interfaces/crud.interface'
import JournalsDao from '../daos/journals.dao'
import { CreateJournalDto } from '../dto/create.journal.dto'
import { PatchJournalDto } from '../dto/patch.journal.dto'
import { PutJournalDto } from '../dto/put.journal.dto'

class JournalService implements CRUD {
  async list (limit: number, page: number) {
    return await JournalsDao.getJournals(limit, page)
  }

  async create (resource: CreateJournalDto) {
    return await JournalsDao.addJournal(resource)
  };

  async putById (id: string, resource: PutJournalDto) {
    return await JournalsDao.updateJournalById(id, resource)
  };

  async putByWosId (wosId: string, resource: PutJournalDto) {
    return await JournalsDao.updateJournalByWosId(wosId, resource)
  };

  async readById (id: string) {
    return await JournalsDao.getJournalById(id)
  };

  async readByWosId (wosId: string) {
    return await JournalsDao.getJournalByWosId(wosId)
  };

  async readByName (name: string) {
    return await JournalsDao.getJournalByName(name)
  };

  async deleteById (id: string) {
    return await JournalsDao.removeJournalById(id)
  };

  async deleteByWosId (wosId: string) {
    return await JournalsDao.removeJournalByWosId(wosId)
  };

  async patchById (id: string, resource: PatchJournalDto) {
    return await JournalsDao.updateJournalById(id, resource)
  };

  async patchByWosId (wosId: string, resource: PatchJournalDto) {
    return await JournalsDao.updateJournalByWosId(wosId, resource)
  };
}

export default new JournalService()
