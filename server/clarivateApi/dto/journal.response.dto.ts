interface information {
    total: number
    page: number
    limit: number
}

interface matches {
    field: string
    value: Array<string>
}

export interface journalInfo {
    id: string
    self: string
    name: string
    matches?: Array<matches>
}

export interface journalApi {
    metadata: information
    hits: Array<journalInfo>
}