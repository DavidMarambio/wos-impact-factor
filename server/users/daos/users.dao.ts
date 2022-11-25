import userModel from'../../models/User.model'
import { CreateUserDto } from '../dto/create.user.dto'
import { PatchUserDto } from '../dto/patch.user.dto'
import { PutUserDto } from '../dto/put.user.dto'
import debug from 'debug'

const log: debug.IDebugger = debug('app:in-memory-dao')

class UsersDao {
  users: CreateUserDto[] = []

  constructor() {
    log('Created new instance of UsersDao')
  }

  async addUser(userFields: CreateUserDto) {
    const user = new userModel({
      ...userFields
    })
    await user.save()
    return user._id
  }

  async getUsers(limit = 25, page = 0) {
    return await userModel.find()
      .limit(limit)
      .skip(limit * page)
      .exec()
  }

  async getUserById(userId: string) {
    return await userModel.findOne({ _id: userId }).exec()
  }

  async getUserByEmail(mail: string) {
    return await userModel.findOne({ email: mail }).exec()
  }

  async updateUserById(userId: string, userFields: PatchUserDto | PutUserDto) {
    const existingUser = await userModel.findOneAndUpdate(
      { _id: userId },
      { $set: userFields },
      { new: true }
    ).exec()
    return existingUser
  }

  async removeUserById(userId: string) {
    return await userModel.deleteOne({ _id: userId }).exec()
  }

  async getUserByEmailWithPassword(email: string) {
    return await userModel.findOne({ email })
      .exec()
  }
}

export default new UsersDao()
