import express from 'express'
import debug from 'debug'
import papersService from '../services/papers.service'
import journalsService from '../../journals/services/journals.service'

const log: debug.IDebugger = debug('app:papers-controller')
class PapersController {
  async listPapers(_req: express.Request, res: express.Response) {
    const papers = await papersService.list(100, 0)
    res.status(200).send(papers)
  }

  async getPaperById(req: express.Request, res: express.Response) {
    const paper = await papersService.readById(req.params.paperId)
    res.status(200).send(paper)
  }

  async createPaper(req: express.Request, res: express.Response) {
    const paperId = await papersService.create(req.body)
    res.status(201).send({ id: paperId })
  }

  async patch(req: express.Request, res: express.Response) {
    log(await papersService.patchById(req.body.id, req.body))
    res.status(204).send()
  }

  async put(req: express.Request, res: express.Response) {
    log(await papersService.putById(req.body.id, req.body))
    res.status(204).send()
  }

  async removePaper(req: express.Request, res: express.Response) {
    log(await papersService.deleteById(req.body.id))
    res.status(204).send()
  }

  async importPapers(req: express.Request, res: express.Response) {
    try {
      let journalIds = []
      const papers = await papersService.importPapers(req.body)
      if (papers) {
        const allJournalsNames = await papersService.getJournalNameFromAllPapers()
        for (const journalName of allJournalsNames) {
          if ('journalName' in journalName) {
            journalIds.push(await journalsService.create({ name: journalName.journalName.toString() }))
          }
        }
        res.status(204).send({ message: `${journalIds.length} journals saved` })
      }
    } catch (error) {
      console.log(error)
      res.status(403).send({ Error: error })
    }
  }
}
export default new PapersController()
