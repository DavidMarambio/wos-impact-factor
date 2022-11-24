import { CreateQuartileDto } from '../../quartile/dto/create.quartile.dto'

interface ImpactFactor {
  year: number
  value: number
}

export interface PutJournalDto {
  wosId: string
  name: string
  quartile?: CreateQuartileDto[]
  impactFactor?: ImpactFactor[]
}
