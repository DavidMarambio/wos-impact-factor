import express from 'express'
import debug from 'debug'
import papersService from '../services/papers.service'

const log: debug.IDebugger = debug('app:papers-controller')
class PapersController {
  async listPapers(_req: express.Request, res: express.Response) {
    const papers = await papersService.list(100, 0)
    res.status(200).send(papers)
  }

  async getPaperById(req: express.Request, res: express.Response) {
    const paper = await papersService.readById(req.body.paperId)
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
      await papersService.importPapers(req.body.papers)
      res.status(204).send()
    } catch (error) {
      console.log(error)
    }
  }
}
export default new PapersController()
