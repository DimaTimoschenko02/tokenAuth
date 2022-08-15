import { NextFunction, Response, Request } from "express";
import ApiError from "../exeptions/api.error";
import User from "../models/user.model";

export default function () {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, password } = req.body;
      const user = await User.findOne({ id });
      const isValid = await user.comparePassword(password);
      if (!isValid) return next(ApiError.BadRequest('uncorrect password'));
      next();
    } catch (err) {
      return next(ApiError.BadRequest('uncorrect password'));
    }
  };
}