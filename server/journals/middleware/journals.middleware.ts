import express from 'express'
import journalsService from '../services/journals.service'
import debug from 'debug'

const log: debug.IDebugger = debug('app:journals-middleware')
class JournalsMiddleware {
  async validateRequiredJournalBodyFields (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.body && req.body.name) {
      next()
    } else {
      const fields = [{ name: req.body.name }]
      fields.forEach((field, index) => {
        switch (field) {
          case null:
            res.status(400).send({ error: `Missing required field ${index}` })
            break
        }
      })
      res.status(400).send({ error: 'Missing required fields' })
    }
  }

  async validateSameJournalNameDoesntExist (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const journal = await journalsService.readByName(req.body.name)
    if (journal != null) {
      res.status(400).send({
        error: 'Journal name already exists'
      })
    } else {
      next()
    }
  }

  async validateSameJournalWosIdDoesntExist (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const journal = await journalsService.readByWosId(req.body.wosId)
    if (journal != null) {
      res.status(400).send({
        error: 'Journal wosId already exists'
      })
    } else {
      next()
    }
  }

  async validateSameNameBelongToSameJournal (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (res.locals.journal.name === req.params.name) {
      next()
    } else {
      res.status(400).send({
        error: 'Invalid journal name'
      })
    }
  }

  async validateSameWosIdBelongToSameJournal (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (res.locals.journal.wosId === req.params.wosId) {
      next()
    } else {
      res.status(400).send({
        error: 'Invalid journal wosId'
      })
    }
  }

  async validatePatchJournalName (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.body.name) {
      log('Validating journal name', req.body.name)
      this.validateSameNameBelongToSameJournal(req, res, next)
    } else {
      next()
    }
  }

  async validatePatchJournalWosId (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.body.wosId) {
      log('Validating journal wosId', req.body.wosId)
      this.validateSameWosIdBelongToSameJournal(req, res, next)
    } else {
      next()
    }
  }

  async validateJournalExists (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    let journal
    let param
    if (req.params.wosId) {
      journal = await journalsService.readByWosId(req.params.wosId)
      param = req.params.wosId
    }
    if (req.params.name) {
      journal = await journalsService.readByName(req.params.name)
      param = req.params.name
    }
    if (req.params.journalId) {
      journal = await journalsService.readById(req.params.journalId)
      param = req.params.journalId
    }
    if (journal != null) {
      res.locals.journal = journal
      next()
    } else {
      res.status(404).send({ error: `Journal ${param} not found` })
    }
  }

  async extractJournalId (
    req: express.Request,
    _res: express.Response,
    next: express.NextFunction
  ) {
    req.body.id = req.params.journalId
    next()
  }
}
export default new JournalsMiddleware()
