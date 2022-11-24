import express from 'express'
import quartilesService from '../services/quartiles.service'
import debug from 'debug'

const log: debug.IDebugger = debug('app:quartiles-middleware')
class QuartilesMiddleware {
  async validateRequiredQuartileBodyFields (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (
      req.body &&
            req.body.journalId &&
            req.body.area &&
            req.body.year &&
            req.body.ranking &&
            req.body.quartile &&
            req.body.percentile
    ) {
      next()
    } else {
      const fields = [{
        journalId: req.body.journalId,
        area: req.body.area,
        year: req.body.year,
        ranking: req.body.ranking,
        quartile: req.body.quartile,
        percentile: req.body.percentile
      }]
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

  async validateSameQuartileWithJournalAreaAndYearDoesntExist (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    const quartile = await quartilesService.readByJournalAndYearAndArea(req.body.journalId, parseInt(req.body.year), req.body.area)
    if (quartile != null) {
      res.status(400).send({
        error: 'Quartile for journal, area and year already exists'
      })
    } else {
      next()
    }
  }

  async validateSameJournalAreaAndYearBelongToSameQuartile (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (
      res.locals.quartile.journalId === req.params.journalId &&
            res.locals.quartile.area === req.params.area &&
            res.locals.quartile.year === req.params.year
    ) {
      next()
    } else {
      res.status(400).send({
        error: 'Invalid quartile for journal, area and year'
      })
    }
  }

  async validatePatchQuartile (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (req.params.journalId && req.params.area && req.params.year) {
      log('Validating quartile for journal, area and year', req.body.journalId, req.body.area, req.body.year)
      this.validateSameJournalAreaAndYearBelongToSameQuartile(req, res, next)
    } else {
      next()
    }
  }

  async validateQuartileExists (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    let quartile
    switch (true) {
      case (
        (typeof req.params.year !== undefined) &&
                (typeof req.params.area !== undefined) &&
                (typeof req.params.journalId !== undefined)
      ):
        quartile = await quartilesService.readByJournalAndYearAndArea(
          req.params.journalId,
          parseInt(req.params.year),
          req.params.area
        )
        break
      case (
        (typeof req.params.area !== undefined) &&
                (typeof req.params.journalId !== undefined)
      ):
        quartile = await quartilesService.readByJournalAndArea(
          req.params.journalId,
          req.params.area
        )
        break
      case (
        (typeof req.params.year !== undefined) &&
                (typeof req.params.journalId !== undefined)
      ):
        quartile = await quartilesService.readByJournalAndYear(
          req.params.journalId,
          parseInt(req.params.year)
        )
        break
      default:
        quartile = await quartilesService.readById(req.params.quartileId)
        break
    }
    if (quartile != null) {
      res.locals.quartile = quartile
      next()
    } else {
      res.status(404).send({ error: `Quartile ${req.params.quartileId} not found` })
    }
  }

  async extractQuartileId (
    req: express.Request,
    _res: express.Response,
    next: express.NextFunction
  ) {
    req.body.id = req.params.quartileId
    next()
  }
}
export default new QuartilesMiddleware()
