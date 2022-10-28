import { CRUD } from "../../common/interfaces/crud.interface";
import PapersDao from "../daos/papers.dao";
import { CreatePaperDto } from "../dto/create.paper.dto";
import { PatchPaperDto } from "../dto/patch.paper.dto";
import { PutPaperDto } from "../dto/put.paper.dto";

class PapersService implements CRUD {
  async create(resource: CreatePaperDto) {
    return PapersDao.addPaper(resource);
  }

  async deleteById(id: string) {
    return PapersDao.removePaperById(id);
  }

  async list(limit: number, page: number) {
    return PapersDao.getPapers(limit, page);
  }

  async patchById(id: string, resource: PatchPaperDto) {
    return PapersDao.updatePaperById(id, resource);
  }

  async readById(id: string) {
    return PapersDao.getPaperById(id);
  }

  async putById(id: string, resource: PutPaperDto) {
    return PapersDao.updatePaperById(id, resource);
  }

  async getPaperByTitle(title: string) {
    return PapersDao.getPaperByTitle(title);
  }

  async getPapersByCodeDoi(codeDoi: string) {
    return PapersDao.getPapersByCodeDoi(codeDoi);
  }

  async getPapersByCodeWos(codeWos: string) {
    return PapersDao.getPapersByCodeWos(codeWos);
  }
  
  async getPapersByJournalName(journalName: string) {
    return PapersDao.getPapersByJournalName(journalName);
  }

  async getPapersByTypePaper(typePaper: string) {
    return PapersDao.getPapersByTypePaper(typePaper);
  }

  async getPapersByYear(year: number) {
    return PapersDao.getPapersByYear(year);
  }
}

export default new PapersService();
