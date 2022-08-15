import jwt from "jsonwebtoken";
import config from "config";
import { DocumentDefinition, FilterQuery } from "mongoose";
import Token, { ITokenDocument } from "../models/token.model";
import { IUserDocument } from "../models/user.model";
import UserDto from "../dtos/user.dto";

export default class TokenService {
  accessExpiration: number;
  refreshExpiration: number;
  jwtSecret: string;
  jwtSecretRefresh: string;
  constructor() {
    this.accessExpiration = config.get("jwtExpiration") as number;
    this.refreshExpiration = config.get("jwtExpirationRefresh") as number;
    this.jwtSecret = config.get("jwtSecret") as string;
    this.jwtSecretRefresh = config.get("jwtSecretRefresh") as string;
  }
  generateTokens(payload: UserDto) {
    return {
      accessToken: jwt.sign({ ...payload }, this.jwtSecret, {
        expiresIn: this.accessExpiration,
      }),
      refreshToken: jwt.sign({ ...payload }, this.jwtSecretRefresh, {
        expiresIn: this.refreshExpiration,
      }),
    };
  }
  
  async saveToken(data: DocumentDefinition<ITokenDocument>) {
    const token = await Token.findOne({ user: data.user });
    if (token) {
      token.accessToken = data.accessToken
      token.refreshToken = data.refreshToken;
      return await token.save();
    }
    return await Token.create(data);
  }

  async findToken(query: FilterQuery<ITokenDocument>):Promise<ITokenDocument> {
    return await Token.findOne(query)
  }

  async removeToken(refreshToken: string) {
    return await Token.deleteOne({refreshToken})
  }

  async removeAllTokens() {
    return await Token.deleteMany();
  }

  async validateAccessToken(token:string){
    try{
      const decoded:IUserDocument = jwt.verify(token, this.jwtSecret) as IUserDocument;
      return decoded
    }catch(err){
      return null
    }
    
  }
   async validateRefreshToken(token:string){
    try{
      const decoded:IUserDocument = jwt.verify(token, this.jwtSecretRefresh) as IUserDocument;
      return decoded
    }catch(err){
      return null
    }
  }
}


