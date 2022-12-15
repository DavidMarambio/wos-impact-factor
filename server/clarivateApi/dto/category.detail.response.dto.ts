import { citationReports } from "./journal.detail.response.dto"

export interface categoryDetail{
    id:string
    name:string
    categoryCode: string
    edition: string
    description: string
    categoryCitationReports: Array<citationReports>
}