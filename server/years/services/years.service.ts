import { CRUD } from '../../common/interfaces/crud.interface'
import yearsDao from '../daos/years.dao'
import { CreateYearDto } from '../dto/create.year.dto'

class YearsService implements CRUD {
  async create (resource: CreateYearDto) {
    return await yearsDao.addYear(resource)
  }

  async deleteById (id: String) {
    const year = await yearsDao.getYearById(id)
    if (year != null) {
      return await yearsDao.disableYear(year.year)
    }
  }

  async list (limit: number, page: number) {
    return await yearsDao.getYears(limit, page)
  }

  async patchById (_id: String, _resource: any) {

  }

  async readById (id: String) {
    return await yearsDao.getYearById(id)
  }

  async putById (_id: String, _resource: any) {

  }

  async disableYear (year: Number) {
    return await yearsDao.disableYear(year)
  }

  async getYearEnable () {
    return await yearsDao.getYearEnable()
  }

  async getYearByYear (year: Number) {
    return await yearsDao.getYearByYear(year)
  }
}

export default new YearsService()
