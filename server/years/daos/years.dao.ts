import { CreateYearDto } from '../dto/create.year.dto'
import yearModel from '../../models/Year.model'
import debug from 'debug'

const log: debug.IDebugger = debug('app:in-memory-dao')

class YearsDao {
  years: CreateYearDto[] = []

  constructor () {
    log('Created new instance of YearsDao')
  }

  async addYear (yearFields: CreateYearDto) {
    const yearInstance = new yearModel({
      ...yearFields
    })
    await yearInstance.save()
    return yearInstance.year
  }

  async getYears (limit = 25, page = 0) {
    return await yearModel.find().limit(limit).skip(limit * page).exec()
  }

  async getYearById (yearId: String) {
    return await yearModel.findOne({ _id: yearId }).populate('Year').exec()
  }

  async getYearByYear (year: Number) {
    return await yearModel.findOne({ year }).exec()
  }

  async getYearEnable () {
    return await yearModel.findOne({ disabled: false }).exec()
  }

  async disableYear (year: Number) {
    const yearEnabled = await this.getYearByYear(year)
    if ((yearEnabled != null) && yearEnabled.disabled === false) {
      const yearDisabled = await yearModel.findOneAndUpdate(
        { year: yearEnabled.year },
        { $set: { disabled: true } },
        { new: true }
      ).exec()
      return yearDisabled
    }
  }
}

export default new YearsDao()
