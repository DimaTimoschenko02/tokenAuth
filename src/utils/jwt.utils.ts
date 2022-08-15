import config from "config";
import jwt from "jsonwebtoken";
import { IUserDocument } from "../models/user.model";

const secretKey = config.get("jwtSecret") as jwt.Secret;

export function sign(obj: Object, options?: jwt.SignOptions | undefined) {
  return jwt.sign(obj, secretKey, options);
}

export function decode(token: string) {
  try {
    const decoded:IUserDocument = jwt.verify(token, secretKey) as IUserDocument;
    console.log(decoded)
    return {
      decoded: decoded,
      valid: true,
      expired: false,
    };
  } catch (err: any) {
    console.log(err.message)
    //console.log(decoded)
    return {
      decoded: null,
      valid: false,
      expired: err.message === 'jwt expired',
    };
  }
}
