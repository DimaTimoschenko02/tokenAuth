import { DocumentDefinition } from "mongoose";
import UserDto from "../dtos/user.dto";
import User, { IUserDocument } from "../models/user.model";
import TokenService from "./token.service";

export default class AuthService {
  constructor(private tokenService: TokenService) {}
  async create(user: DocumentDefinition<IUserDocument>) {
    return await User.create(user);
  }
  async find(id: string) {
    return await User.findOne({ id });
  }

  async refresh(refreshToken: string) {
    const tokenFromDB = await this.tokenService.findToken({ refreshToken });
    const user = await User.findOne({ id: tokenFromDB.user });
    const userDto = new UserDto(user);
    const tokens = this.tokenService.generateTokens(userDto);
    const tokensFromDB = await this.tokenService.saveToken({user:user.id , ...tokens})
    return {accessToken:tokensFromDB.accessToken , refreshToken:tokensFromDB.refreshToken}
  }
}
