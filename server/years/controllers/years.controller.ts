import express from 'express'
import debug from 'debug'
import yearsService from '../services/years.service'

const log: debug.IDebugger = debug('app:years-controller')
class YearsController {
  async listYears(_req: express.Request, res: express.Response) {
    const years = await yearsService.list(5, 0)
    res.status(200).send(years)
  }

  async getYearById(req: express.Request, res: express.Response) {
    const year = await yearsService.readById(req.body._id)
    res.status(200).send(year)
  }

  async getYearByYear(req: express.Request, res: express.Response) {
    const year = await yearsService.getYearByYear(req.body.year)
    res.status(200).send(year)
  }

  async createNewYear(_req: express.Request, res: express.Response) {
    const year = await yearsService.getYearEnable()
    if (year !== null) {
      const yearDisabled = await yearsService.disableYear(year.year)
      log(`Year disabled: ${yearDisabled?.year}`)
      if (yearDisabled !== null && yearDisabled !== undefined) {
        const nextYear = Number(yearDisabled.year) + 1
        const newYear = await yearsService.create({ year: nextYear })
        res.status(200).send({ year: newYear })
      }
      res.status(204).send()
    } else {
      const newYear = await yearsService.create({ year: (new Date().getFullYear() - 1) })
      res.status(200).send({ year: newYear })
    }
    res.status(400).send()
  }
}

export default new YearsController()
