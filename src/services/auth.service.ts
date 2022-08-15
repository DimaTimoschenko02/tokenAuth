import { DocumentDefinition } from "mongoose";
import UserDto from "../dtos/user.dto";
import ApiError from "../exeptions/api.error";
import User, { IUserDocument } from "../models/user.model";
import { ISignUp } from "../types/user.types";
import TokenService from "./token.service";

export default  class AuthService{
    constructor(private tokenService:TokenService){}
    async create(user: DocumentDefinition<IUserDocument>){
        return await User.create(user)
    }
    async find(id:string){
        return await User.findOne({id})
    }

    async refresh(refreshToken:string){
        if(!refreshToken){
            throw new ApiError(400 , 'v midlu')
        }
        const isValid = this.tokenService.validateRefreshToken(refreshToken)
        const tokenFromDB = await this.tokenService.findToken({refreshToken})
        if(!isValid || !tokenFromDB){
            throw new ApiError(400 , 'v midlu 2')
        }
        const user = await User.findOne({id:tokenFromDB.user})
        const userDto = new UserDto(user)
        return this.tokenService.generateTokens(userDto)
        
    }
}