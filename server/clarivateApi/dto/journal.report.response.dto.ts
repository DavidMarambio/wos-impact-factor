import { journalInfo } from "./journal.response.dto"

interface metrics {
    impactMetrics: impactMetrics
    influenceMetrics: influenceMetrics
    sourceMetrics: sourceMetrics
    citationDistribution: citationDistribution
}

interface impactMetrics {
    totalCites: number
    jif: string
    jifWithoutSelfCitations: string
    jif5Years: number
    immediacyIndex: number
}

interface influenceMetrics {
    eigenFactor: eigenFactor
    articleInfluence: number
}

interface eigenFactor {
    score: number
    normalized: number
}

interface sourceMetrics {
    citableItems: citableItems
    jifPercentile: number
    halfLife: halfLife
}

interface citableItems {
    total: number
    articlesPercentage: number
}

interface halfLife {
    cited: number
    citing: number
}

interface citationDistribution {
    articleCitationMedian: number
    reviewCitationMedian: number
    unlinkedCitations: number
    timesCited: number
    articles: number
    reviews: number
    other: number
}

interface ranks {
    jif: Array<category>
    articleInfluence: Array<category>
    eigenFactorScore: Array<category>
    immediacyIndex: Array<category>
    jci: Array<category>
    esiCitations: Array<category>
}

interface category {
    category: string
    edition?: string
    self?: string
    rank: string
    quartile: string
    jifPercentile?: number
    jciPercentile?: number
}

export interface sourceData {
    articles: accounting
    reviews: accounting
    other: accounting
}

interface accounting {
    count: number
    references?: number
}

interface journalProfile {
    startYear: number
    endYear: number
    citableItems: citableItems
    citations: citableItems
    occurrenceCountries: Array<countryRegion>
    occurrenceOrganizations: Array<countryRegion>
}

interface citableItems {
    goldOA: number
    subscription: number
    other: number
    unlinked?: number
}

interface countryRegion {
    countryRegion?: string
    organization?: string
    occurrence: number
}

export interface detailData {
    cited: citesInformation
    citing: citesInformation
}

interface citesInformation {
    url: string
    count: number
}

export interface journalReport {
    year: number
    suppressed: boolean
    journal: journalInfo
    metrics: metrics
    ranks: ranks
    sourceData: sourceData
    journalProfile?: journalProfile
    journalData: detailData
}