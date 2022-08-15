import { NextFunction, Request, Response } from "express";
import ApiError from "../exeptions/api.error";
import TokenService from "../services/token.service";


export default function () {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenService = new TokenService();
      const headerToken = req?.headers?.authorization;

      if (!headerToken) {
        console.log("err");
        return next(new ApiError(403, "user is not authorized"));
      }
      const accessToken = headerToken.split(" ")[1];
      if (!accessToken) {
        return next(new ApiError(403, "user is not authorized"));
      }
      const isValid = await tokenService.validateAccessToken(accessToken);
      if (!isValid) {
        return next(new ApiError(403, "user is not authorized"));
      }
      req.app.set("user", isValid);

      next();
    } catch (e: any) {
      return next(new ApiError(e.status, e.message));
    }
  };
}
