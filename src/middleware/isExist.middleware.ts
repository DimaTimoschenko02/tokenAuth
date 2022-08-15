import { NextFunction, Request, Response } from "express";
//import { MyRequest } from "../controllers/auth.controller";
import ApiError from "../exeptions/api.error";
import User from "../models/user.model";

export default function (isNew: boolean) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {

      const id = req.body.id;
      const user = await User.findOne({ id });
      if (isNew && user) throw new ApiError(400, `user with id ${id} alreay exist`);
      if (!isNew && !user) throw new ApiError(400, `user with id ${id} does not exist`);
      next();
    } catch (err) {

      next(new ApiError(err.status, err.message));
    }
  };
}