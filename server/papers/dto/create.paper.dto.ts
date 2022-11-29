import { object, string, TypeOf, number } from "zod";

export interface CreatePaperDto {
  year: number
  codeWos: string
  codeDoi: string
  typePaper: string
  journalName: string
  journalNumber?: number
  journalVolume?: number
  title: string
  chapterPage?: number
  numberOfPages?: number
  initialPage?: number
  endPage?: number
}

export const createPaperSchema = object({
  body: object({
    year: number(),
    codeWos: string(),
    codeDoi: string(),
    typePaper: string(),
    journalName: string(),
    title: string(),
  })
});

export const updatePaperSchema = object({
  body: object({
    year: number(),
    codeWos: string(),
    codeDoi: string(),
    typePaper: string(),
    journalName: string(),
    journalNumber: number(),
    journalVolume: number(),
    title: string(),
    chapterPage: number(),
    numberOfPages: number(),
    initialPage: number(),
    endPage: number()
  })
});

export type CreatePaperInput = TypeOf<typeof createPaperSchema>["body"];
export type UpdatePaperInput = TypeOf<typeof updatePaperSchema>["body"];
