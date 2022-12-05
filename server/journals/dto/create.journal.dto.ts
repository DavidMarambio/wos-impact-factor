import { object, string, TypeOf, array, number } from "zod";
import { createQuartileFromJournalSchema } from '../../quartile/dto/create.quartile.dto'

interface ImpactFactor {
  year: number
  value: number
}

const impactFactorSchema = object({
  year: number(),
  value: number()
})

export interface CreateJournalDto {
  wosId?: string
  name: string
  impactFactor?: ImpactFactor[]
}

export const createJournalSchema = object({
  body: object({
    name: string()
  })
});

export const updateJournalSchema = object({
  body: object({
    wosId: string(),
    name: string(),
    impactFactor: array(impactFactorSchema)
  })
});

export type CreateJournalInput = TypeOf<typeof createJournalSchema>["body"];
export type UpdateJournalInput = TypeOf<typeof updateJournalSchema>["body"];