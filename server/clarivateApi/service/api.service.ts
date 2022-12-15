import apiDao from "../dao/api.dao";
import { journalReport } from '../dto/journal.report.response.dto'

class ApiService {
    async getJournalId(journalName: string) {
        const response = await apiDao.requestJournal(journalName)
        if (response) {
            return response.hits[0].id
        }
    }

    async getImpactFactor(id: string, year: number) {
        const response = await apiDao.requestReport('journals', id, year)
        if (apiDao.instanceOfJournalReport(response)) {
            return {
                jif: response.metrics.impactMetrics.jif,
                categories: response.ranks.jif
            }
        }
    }
}

export default new ApiService()