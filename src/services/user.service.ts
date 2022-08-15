import { DocumentDefinition } from "mongoose";
import User, { IUserDocument } from "../models/user.model";

export default class UserService {
  constructor() {}
  async getUserInfo(user:DocumentDefinition<IUserDocument>){
    return await User.findOne({id:user.id}).select([
        "id",
        "id_type"
    ])
  }
}
