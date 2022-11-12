interface Area {
    name: string
}

export interface PutQuartileDto{
    area: Area
    year: number
    ranking: string
    quartile: string
    percentile: number
}