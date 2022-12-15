import express from 'express'
import debug from 'debug'
import journalsService from '../services/journals.service'
import quartilesService from '../../quartile/services/quartiles.service'
import apiService from '../../clarivateApi/service/api.service'

const log: debug.IDebugger = debug('app:journals-controller')
class JournalsController {
  async listJournals(_req: express.Request, res: express.Response) {
    const journals = await journalsService.list()
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
        log(put)
      } else if (req.params.name) {
        const journal = await journalsService.readByName(req.params.name)
        if (journal) {
          let quartiles = req.body.quartile
          for (const quartile of quartiles) {
            await quartilesService.createQuartile(quartile, journal._id.toString())
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

  async searchWosId(req: express.Request, res: express.Response) {
    if (req.params.name) {
      const id = await apiService.getJournalId(req.params.name)
      res.status(200).send({ wosId: id })
    }
    res.status(204).send({ message: "No data found" })
  }

  async bringJournalData(req: express.Request, res: express.Response) {
    if (req.params.wosId && req.params.year) {
      const impactFactor = await apiService.getImpactFactor(req.params.wosId, Number(req.params.year))
      impactFactor ?
        res.status(200).send({ journal: impactFactor }) :
        res.status(400).send({ message: "No data foud" })
    }
  }
}
export default new JournalsController()
