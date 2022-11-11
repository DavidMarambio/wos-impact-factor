import userModel from "../../models/User";
import { CreateUserDto } from "../dto/create.user.dto";
import { PatchUserDto } from "../dto/patch.user.dto";
import { PutUserDto } from "../dto/put.user.dto";
import shortid from "shortid";
import debug from "debug";


const log: debug.IDebugger = debug("app:in-memory-dao");

class UsersDao {
  users: Array<CreateUserDto> = [];

  constructor() {
    log("Created new instance of UsersDao");
  }

  async addUser(userFields: CreateUserDto) {
    const userId = shortid.generate();
    const user = new userModel({
      _id: userId,
      ...userFields,
      permissionFlags: 1,
    });
    await user.save();
    return userId;
  }

  async getUsers(limit = 25, page = 0) {
    return await userModel.find()
      .limit(limit)
      .skip(limit * page)
      .exec();
  }

  async getUserById(userId: string) {
    return await userModel.findOne({ _id: userId }).exec();
  }

  async getUserByEmail(email: string) {
    return await userModel.findOne({ email: email }).exec();
  }

  async updateUserById(userId: string, userFields: PatchUserDto | PutUserDto) {
    const existingUser = await userModel.findOneAndUpdate(
      { _id: userId },
      { $set: userFields },
      { new: true }
    ).exec();
    return existingUser;
  }

  async removeUserById(userId: string) {
    return await userModel.deleteOne({ _id: userId }).exec();
  }

  async getUserByEmailWithPassword(email: string) {
    return await userModel.findOne({ email: email })
      .select("_id email permissionFlags +password")
      .exec();
  }
}

export default new UsersDao();
