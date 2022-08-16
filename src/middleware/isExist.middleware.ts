import { NextFunction, Request, Response } from "express";
//import { MyRequest } from "../controllers/auth.controller";
import ApiError from "../exeptions/api.error";
import User from "../models/user.model";

export default function (isNew: boolean) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.body.id;
      const user = await User.findOne({ id });
      if (isNew && user) return next(ApiError.BadRequest(`user with id ${id} alreay exist`))
      if (!isNew && !user) return next (ApiError.BadRequest(`user with id ${id} does not exist`));
      next();
    } catch (err:any) {

      return next(ApiError.BadRequest(err.message));
    }
  };
}