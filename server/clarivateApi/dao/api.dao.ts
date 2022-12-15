import config from 'config'
import { categoryDetail } from '../dto/category.detail.response.dto'
import { categoryReport } from '../dto/category.report.response.dto'
import { journalDetail } from '../dto/journal.detail.response.dto'
import { journalReport } from '../dto/journal.report.response.dto'
import { journalApi } from '../dto/journal.response.dto'

class ApiDao {
    private token: string
    private baseUrl: string
    private response: any

    constructor() {
        this.token = config.get('clarivateToken')
        this.baseUrl = "https://api.clarivate.com/apis/wos-journals/v1"
    }

    async requestUrl(url: string) {
        try {
            this.response = await fetch(`${this.baseUrl}` + url, {
                method: 'GET',
                headers: {
                    'X-ApiKey': `${this.token}`,
                    'Accept': 'application/json'
                },
            })
            const res = await this.response.json()
            return res
        } catch (error) {
            console.log({ message: error })
        }
    }

    async requestJournal(journalName: string): Promise<journalApi | undefined> {
        try {
            const url = `${this.baseUrl}/journals?q=${journalName}`
            this.response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-ApiKey': `${this.token}`,
                    'Accept': 'application/json'
                },
            })
            const res = await this.response.json()
            return res
        } catch (error) {
            console.log({ message: error })
        }
    }

    async requestDetail(entity: string, id: string): Promise<journalDetail | categoryDetail | undefined> {
        try {
            this.response = await fetch(`${this.baseUrl}/${entity}/${id}`, {
                method: 'GET',
                headers: {
                    'X-ApiKey': `${this.token}`,
                    'Accept': 'application/json'
                },
            })
            const res = await this.response.json()
            return res
        } catch (error) {
            console.log({ message: error })
        }
    }

    async requestReport(entity: string, id: string, year: number): Promise<journalReport | categoryReport | undefined> {
        try {
            const url = `${this.baseUrl}/${entity}/${id}/reports/year/${year}`
            this.response = await fetch(url, {
                method: 'GET',
                headers: {
                    'X-ApiKey': `${this.token}`,
                    'Accept': 'application/json'
                },
            })
            const res = await this.response.json()
            return res
        } catch (error) {
            console.log({ message: error })
        }
    }

    instanceOfJournalReport(object: any): object is journalReport {
        return 'metrics' in object;
    }

    instanceOfCategoryReport(object: any): object is categoryReport {
        return 'categoryData' in object;
    }
}

export default new ApiDao()