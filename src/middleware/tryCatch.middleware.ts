import { NextFunction, Request, Response } from "express";
import ApiError from "../exeptions/api.error";

const tryCatchMiddleware = (controller: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, data } = await controller(req, res, next);
      res.status(status).json(data);
    } catch (err: any) {
      next(new ApiError(err.status , err.message));
    }
  };
};
export default tryCatchMiddleware;
