import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import ApiError from "../exeptions/api.error";
import TokenService from "../services/token.service";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tokenService = new TokenService();
    const headerToken = req?.headers?.authorization;
    if (!headerToken) {
      return next(ApiError.UnauthorizedError());
    }
    const accessToken = headerToken.split(" ")[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }
    const isValid = await tokenService.validateAccessToken(accessToken);
    if (!isValid) {
      return next(ApiError.UnauthorizedError());
    }
    req.app.set("user", isValid);

    next();
  } catch (e: any) {
    return next(new ApiError(e.status | StatusCodes.UNAUTHORIZED, e.message));
  }
};
