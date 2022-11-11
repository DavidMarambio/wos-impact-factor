import { CreateQuartileDto } from "../../quartile/dto/create.quartile.dto"

interface ImpactFactor{
    year: number
    value: number
}

export interface CreateJournalDto{
    wosId?: string
    name: string
    quartile?: Array<CreateQuartileDto>
    impactFactor?: Array<ImpactFactor>
}