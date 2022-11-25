import debug from 'debug'
import sessionModel from '../../models/Session.model'
import { CreateSessionDto } from '../dto/create.session.dto'

const log: debug.IDebugger = debug('app:in-memory-dao')

class SessionsDao {
  sessions: CreateSessionDto[] = []

  constructor() {
    log('Created new instance of SessionsDao')
  }

  async addSession(sessionFields: CreateSessionDto) {
    const session = new sessionModel({ ...sessionFields })
    await session.save()
    return session.user
  }

  async getSessionsById(id: string) {
    return await sessionModel.findById({ id }).exec()
  }

  async getSessionByUser(session: string) {
    return await sessionModel.findOne({ user: session }).exec()
  }

  async removeSessionById(id: string) {
    return await sessionModel.findOneAndRemove({ _id: id }).exec()
  }

  async removeSessionsByUser(session: string) {
    return await sessionModel.deleteMany({ user: session }).exec()
  }
}

export default new SessionsDao()