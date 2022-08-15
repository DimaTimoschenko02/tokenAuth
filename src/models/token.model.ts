import mongoose, { Schema, ObjectId } from "mongoose";
import User, { IUserDocument } from "./user.model";

export interface ITokenDocument extends mongoose.Document {
  user: IUserDocument["id"];
  refreshToken: string;
  accessToken: string;
}

const tokenSchema: Schema = new Schema({
  user: {
    type: String,
    ref: "User",
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
},
{timestamps:true});

const Token = mongoose.model<ITokenDocument>("Token", tokenSchema);

export default Token;
