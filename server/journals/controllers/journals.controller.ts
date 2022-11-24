import express from 'express'
import debug from 'debug'
import journalsService from '../services/journals.service'

const log: debug.IDebugger = debug('app:journals-controller')
class JournalsController {
  async listJournals (_req: express.Request, res: express.Response) {
    const journals = await journalsService.list(100, 0)
    res.status(200).send(journals)
  }

  async getJournalById (req: express.Request, res: express.Response) {
    const journal = await journalsService.readById(req.body.journalId)
    res.status(200).send(journal)
  }

  async getJournalByWosId (req: express.Request, res: express.Response) {
    const journal = await journalsService.readByWosId(req.body.wosId)
    res.status(200).send(journal)
  }

  async getJournalByName (req: express.Request, res: express.Response) {
    const journal = await journalsService.readByName(req.body.name)
    res.status(200).send(journal)
  }

  async createJournal (req: express.Request, res: express.Response) {
    const journalId = await journalsService.create(req.body)
    res.status(201).send({ id: journalId })
  }

  async patch (req: express.Request, res: express.Response) {
    if (req.body.id) {
      log(await journalsService.patchById(req.body.id, req.body))
    }
    if (req.body.wosId) {
      log(await journalsService.patchByWosId(req.body.wosId, req.body))
    }
    res.status(204).send()
  }

  async put (req: express.Request, res: express.Response) {
    if (req.body.id) {
      log(await journalsService.putById(req.body.id, req.body))
    }
    if (req.body.wosId) {
      log(await journalsService.putByWosId(req.body.wosId, req.body))
    }
    res.status(204).send()
  }

  async removeJournal (req: express.Request, res: express.Response) {
    if (req.body.id) {
      log(await journalsService.deleteById(req.body.id))
    }
    if (req.body.wosId) {
      log(await journalsService.deleteByWosId(req.body.wosId))
    }
    res.status(204).send()
  }
}
export default new JournalsController()
