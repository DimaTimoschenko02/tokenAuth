import { IUserDocument } from "../models/user.model";

export default class UserDto{
    id:string;
    id_type:string
    constructor(model:IUserDocument){
        this.id = model.id
        this.id_type = model.id_type
    }
}