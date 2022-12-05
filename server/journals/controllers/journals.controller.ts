import express from 'express'
import debug from 'debug'
import journalsService from '../services/journals.service'
import quartilesService from '../../quartile/services/quartiles.service'

const log: debug.IDebugger = debug('app:journals-controller')
class JournalsController {
  async listJournals(_req: express.Request, res: express.Response) {
    const journals = await journalsService.list(100, 0)
    res.status(200).send(journals)
  }

  async getJournalById(req: express.Request, res: express.Response) {
    const journal = await journalsService.readById(req.params.journalId)
    res.status(200).send(journal)
  }

  async getJournalByWosId(req: express.Request, res: express.Response) {
    const journal = await journalsService.readByWosId(req.params.wosId)
    res.status(200).send(journal)
  }

  async getJournalByName(req: express.Request, res: express.Response) {
    const journal = await journalsService.readByName(req.params.name)
    res.status(200).send(journal)
  }

  async createJournal(req: express.Request, res: express.Response) {
    const journalId = await journalsService.create(req.body)
    res.status(201).send({ id: journalId })
  }

  async patch(req: express.Request, res: express.Response) {
    if (req.params.id) {
      log(await journalsService.patchById(req.params.id, req.body))
    }
    if (req.params.wosId) {
      log(await journalsService.patchByWosId(req.params.wosId, req.body))
    }
    res.status(204).send()
  }

  async put(req: express.Request, res: express.Response) {
    try {
      if (req.params.wosId) {
        const put = await journalsService.putByWosId(req.params.wosId, req.body)
        console.log(put)
        log(put)
      } else if (req.params.name) {
        const journal = await journalsService.readByName(req.params.name)
        if (journal) {
          let quartiles = req.body.quartile
          for (const quartile of quartiles) {
            await quartilesService.create({
              journal: journal._id.toString(),
              area: quartile.area,
              year: quartile.year,
              ranking: quartile.ranking,
              quartile: quartile.quartile,
              percentile: quartile.percentile
            })
          }
          const put = await journalsService.putById(journal._id.toString(), req.body)
          // const journalUpdate = await journalsService.journalWithQuartilesById(journal._id.toString())
          // console.log(journalUpdate)
          log(put)
        }
      }
      res.status(204).send()
    } catch (error) {
      console.log({ message: error })
      res.status(400).send({ message: error })
    }
  }

  async removeJournal(req: express.Request, res: express.Response) {
    if (req.params.id) {
      log(await journalsService.deleteById(req.params.id))
    }
    if (req.params.wosId) {
      log(await journalsService.deleteByWosId(req.params.wosId))
    }
    res.status(204).send()
  }
}
export default new JournalsController()
