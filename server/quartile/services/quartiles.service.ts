import { CRUD } from '../../common/interfaces/crud.interface'
import yearsService from '../../years/services/years.service'
import quartileDao from '../daos/quartile.dao'
import { CreateApiQuartileDto } from '../dto/create.api.quartile.dto'
import { CreateQuartileDto } from '../dto/create.quartile.dto'
import { PatchQuartileDto } from '../dto/patch.quartile.dto'
import { PutQuartileDto } from '../dto/put.quartile.dto'

class QuartileService implements CRUD {
  create: (resource: any) => Promise<any>

  async list(limit: number, page: number) {
  };

  async listQuartilesByJournal(journalId: string, limit: number, page: number) {
    return await quartileDao.getQuartiles(journalId, limit, page)
  }

  async createQuartile(quartile: CreateQuartileDto | CreateApiQuartileDto, journalId: string) {
    let quartileObject: CreateQuartileDto
    if ('area' in quartile && "year" in quartile && "ranking" in quartile && "quartile" in quartile && "percentile" in quartile) {
      quartileObject = {
        journal: journalId,
        area: String(quartile.area),
        year: Number(quartile.year),
        ranking: String(quartile.ranking),
        quartile: String(quartile.quartile),
        percentile: Number(quartile.percentile)
      }
    } else {
      const yearActive = await yearsService.getYearEnable()
      quartileObject = {
        journal: journalId,
        area: String(quartile.category),
        year: yearActive ? Number(yearActive.year) : 0,
        ranking: String(quartile.rank),
        quartile: String(quartile.quartile),
        percentile: Number(quartile.jifPercentile)
      }
    }
    return await quartileDao.addQuartile(quartileObject)
  }

  async putById(id: string, resource: PutQuartileDto) {
    return await quartileDao.updateQuartileById(id, resource)
  };

  async readById(id: string) {
    return await quartileDao.getQuartileById(id)
  };

  async readByJournalAndArea(journalId: string, area: string) {
    return await quartileDao.getQuartileByJournalAndArea(journalId, area)
  }

  async readByJournalAndYear(journalId: string, year: number) {
    return await quartileDao.getQuartileByJournalAndYear(journalId, year)
  }

  async readByJournalAndYearAndArea(journalId: string, year: number, area: string) {
    return await quartileDao.getQuartileByJournalAndYearAndArea(journalId, year, area)
  }

  async deleteById(id: string) {
    return await quartileDao.removeQuartilelById(id)
  };

  async patchById(id: string, resource: PatchQuartileDto) {
    return await quartileDao.updateQuartileById(id, resource)
  };
}

export default new QuartileService()
