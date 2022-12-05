import { object, string, TypeOf, number } from "zod";

export interface CreateQuartileDto {
  journal: string
  area: string
  year: number
  ranking: string
  quartile: string
  percentile: number
}

export const createQuartileFromJournalSchema = object({
  area: string(),
  year: number(),
  ranking: string(),
  quartile: string(),
  percentile: number()
});

export type CreateQuartileFromJournalInput = TypeOf<typeof createQuartileFromJournalSchema>;