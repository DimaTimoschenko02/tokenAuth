import config from "config";
import { NextFunction, Request, Response } from "express";
import ApiError from "../exeptions/api.error";
import Token from "../models/token.model";

const tryCatchMiddleware = (
  controller: Function,
  setCookie: boolean = true
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, data } = await controller(req, res, next);
      res.status(status).json(data);
    } catch (err: any) {
      next(err);
    }
  };
};
export default tryCatchMiddleware;
