interface Area {
    name: string
}

export interface CreateQuartileDto {
    area: Area
    year: number
    ranking: string
    quartile: string
    percentile: number
}