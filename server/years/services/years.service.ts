import { CRUD } from "../../common/interfaces/crud.interface";
import yearsDao from "../daos/years.dao";
import { CreateYearDto } from "../dto/create.year.dto";

class YearsService implements CRUD {
    async create(resource: CreateYearDto) {
        return yearsDao.addYear(resource);
    }

    async deleteById(id: String) {
        const year = await yearsDao.getYearById(id);;
        if (year) {
            return yearsDao.disableYear(year.year);
        }
        return;
    }

    async list(limit: number, page: number) {
        return yearsDao.getYears(limit, page);
    }

    async patchById(_id: String, _resource: any) {

    }

    async readById(id: String) {
        return yearsDao.getYearById(id);
    }

    async putById(_id: String, _resource: any) {

    }

    async disableYear(year: Number) {
        return yearsDao.disableYear(year);
    }

    async getYearEnable() {
        return yearsDao.getYearEnable();
    }

    async getYearByYear(year: Number) {
        return yearsDao.getYearByYear(year);
    }
}

export default new YearsService();