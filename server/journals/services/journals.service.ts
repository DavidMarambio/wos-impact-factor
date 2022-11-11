import { CRUD } from "../../common/interfaces/crud.interface";
import JournalsDao from "../daos/journals.dao";
import { CreateJournalDto } from "../dto/create.journal.dto";
import { PatchJournalDto } from "../dto/patch.journal.dto";
import { PutJournalDto } from "../dto/put.journal.dto";

class JournalService implements CRUD {
    async list(limit: number, page: number) {
        return JournalsDao.getJournals(limit, page);
    }

    async create(resource: CreateJournalDto) {
        return JournalsDao.addJournal(resource);
    };

    async putById(id: string, resource: PutJournalDto) {
        return JournalsDao.updateJournalById(id, resource);
    };

    async putByWosId(wosId: string, resource: PutJournalDto) {
        return JournalsDao.updateJournalByWosId(wosId, resource);
    };

    async readById(id: string) {
        return JournalsDao.getJournalById(id);
    };

    async readByWosId(wosId: string) {
        return JournalsDao.getJournalByWosId(wosId);
    };

    async readByName(name: string) {
        return JournalsDao.getJournalByName(name);
    };

    async deleteById(id: string) {
        return JournalsDao.removeJournalById(id);
    };

    async deleteByWosId(wosId: string) {
        return JournalsDao.removeJournalByWosId(wosId);
    };

    async patchById(id: string, resource: PatchJournalDto) {
        return JournalsDao.updateJournalById(id, resource)
    };

    async patchByWosId(wosId: string, resource: PatchJournalDto) {
        return JournalsDao.updateJournalByWosId(wosId, resource)
    };

}

export default new JournalService()