import express from 'express'
import debug from 'debug'
import quartilesService from '../services/quartiles.service'

const log: debug.IDebugger = debug('app:quartiles-controller')
class QuartilesController {
  async listQuartiles (req: express.Request, res: express.Response) {
    const quartiles = await quartilesService.listQuartilesByJournal(
      req.body.journalId,
      100,
      0
    )
    res.status(200).send(quartiles)
  }

  async getQuartileById (req: express.Request, res: express.Response) {
    const quartile = await quartilesService.readById(req.body.quartileId)
    res.status(200).send(quartile)
  }

  async getQuartileByJournalAndArea (req: express.Request, res: express.Response) {
    const quartiles = await quartilesService.readByJournalAndArea(
      req.body.journalId,
      req.body.area
    )
    res.status(200).send(quartiles)
  }

  async getQuartileByJournalAndYear (req: express.Request, res: express.Response) {
    const quartiles = await quartilesService.readByJournalAndYear(
      req.body.journalId,
      parseInt(req.body.year)
    )
    res.status(200).send(quartiles)
  }

  async getQuartileByJournalYearAndArea (req: express.Request, res: express.Response) {
    const quartile = await quartilesService.readByJournalAndYearAndArea(
      req.body.journalId,
      parseInt(req.body.year),
      req.body.area
    )
    res.status(200).send(quartile)
  }

  async createQuartile (req: express.Request, res: express.Response) {
    const quartileId = await quartilesService.create(req.body)
    res.status(201).send({ id: quartileId })
  }

  async patch (req: express.Request, res: express.Response) {
    log(await quartilesService.patchById(req.body.id, req.body))
    res.status(204).send()
  }

  async put (req: express.Request, res: express.Response) {
    log(await quartilesService.putById(req.body.id, req.body))
    res.status(204).send()
  }

  async removeQuartile (req: express.Request, res: express.Response) {
    log(await quartilesService.deleteById(req.body.id))
    res.status(204).send()
  }
}
export default new QuartilesController()
