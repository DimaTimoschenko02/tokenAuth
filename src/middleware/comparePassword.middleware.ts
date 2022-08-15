import { NextFunction, Response, Request } from "express";
import ApiError from "../exeptions/api.error";
import User from "../models/user.model";

export default function () {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, password } = req.body;
      const user = await User.findOne({ id });
      const isValid = await user.comparePassword(password);
      if (!isValid) throw new ApiError(400, "Invalid password");
      next();
    } catch (err) {
      next(new ApiError(err.status, err.message));
    }
  };
}