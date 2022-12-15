import { detailData, sourceData } from "./journal.report.response.dto"

interface jif{
    median: number
    aggregate: aggregate
}

interface aggregate{
    count: string
    citesYearAgo: number
    citesTwoYearsAgo: number
    publishedYearAgo: number
    publishedTwoYearsAgo: number
}

interface immediacy{
    count: number
    citesCurrentYear: number
    publishedCurrentYear: number
}

interface frequency{
    annual: number
    hemiannual: number
    triannual: number
    semiannual: number
    quarterly: number
    bimonthly: number
    monthly: number
    biweekly: number
    weekly: number
    daily: number
    irregular: number
}

export interface categoryReport {
    year: number
    journals: { count: number, url: string }
    articles: number
    cites: number
    jif: jif
    immediacy: immediacy
    halfLife: {cited: number, citing: number}
    frequency: frequency
    sourceData: sourceData
    categoryData: detailData
}