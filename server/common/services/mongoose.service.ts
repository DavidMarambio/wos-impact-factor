import mongoose from 'mongoose'
import config from 'config'
import debug from 'debug'

const log: debug.IDebugger = debug('app:mongoose-service')
class MongooseService {
  private stringConnection
  private count = 0
  private readonly mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
  }

  constructor() {
    this.stringConnection = config.get<string>('dbUri')
    this.connectWithRetry()
  }

  getMongoose() {
    return mongoose
  }

  connectWithRetry = () => {
    log('Attempting MongoDB connection (will retry if needed)')
    mongoose
      .connect(
        this.stringConnection,
        this.mongooseOptions
      )
      .then(() => {
        log('MongoDB is connected')
      })
      .catch((err) => {
        const retrySeconds = 5
        log(
          `MongoDB connection unsuccessful (will retry #${++this
            .count} after ${retrySeconds}):`,
          err
        )
        setTimeout(this.connectWithRetry, retrySeconds * 1000)
      })
  }
}
export default new MongooseService()
