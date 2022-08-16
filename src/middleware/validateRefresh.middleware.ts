import { NextFunction, Request, Response } from "express";
import { get } from "lodash";
import ApiError from "../exeptions/api.error";
import TokenService from "../services/token.service";
export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const tokenService = new TokenService();
    const refreshToken = get(req.cookies, "refreshToken");
    if (!refreshToken) {
      return next(ApiError.UnauthorizedError());
    }
    const isValid = await tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await tokenService.findToken({ refreshToken });
    if (!isValid || !tokenFromDB) {
      return next(ApiError.UnauthorizedError());
    }
    next();
  } catch (err) {
    return next(ApiError.UnauthorizedError());
  }
}
