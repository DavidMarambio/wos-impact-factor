interface publisher{
    name: string
    address: string
    countryRegion: string
}

interface categories{
    url: string
    name: string
    edition: string
}

export interface citationReports{
    year: number
    url: string
}

export interface journalDetail{
    id: string
    name: string
    jcrTitle: string
    isoTitle: string
    issn: string
    previousIssn: []
    eIssn: string
    publisher: publisher
    frequency: number
    firstIssueYear: number
    language: string
    categories: Array<categories>
    journalCitationReports: Array<citationReports>
}