export interface CreatePaperDto {
    year: number
    codeWos:string
    codeDoi: string
    typePaper: string
    journalName: string
    journalNumber?:number
    journalVolume?: number
    title: string
    chapterPage?: number
    numberOfPages?: number
    initialPage?: number
    endPage?: number
  }
  