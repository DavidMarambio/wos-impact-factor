import mongoose from 'mongoose'
import debug from 'debug'

const log: debug.IDebugger = debug('app:mongoose-service')
class MongooseService {
  private count = 0
  private readonly mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
  }

  private readonly USER = process.env.DB_USER || 'dev'
  private readonly PASS = process.env.DB_PASS || 'dev'
  private readonly HOST = process.env.DB_HOST || 'localhost'
  private readonly PORT = process.env.DB_PORT || 27017
  private readonly DB = process.env.DB_NAME || 'paper-wos-dev'
  private readonly stringConnection

  constructor () {
    if (this.USER === 'dev') {
      this.stringConnection = `mongodb://${this.HOST}:${this.PORT}/${this.DB}`
    } else {
      this.stringConnection = `mongodb://${this.USER}:${this.PASS}@${this.HOST}:${this.PORT}/${this.DB}`
    }
    this.connectWithRetry()
  }

  getMongoose () {
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
