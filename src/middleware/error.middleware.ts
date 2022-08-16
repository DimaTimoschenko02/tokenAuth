import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import ApiError from "../exeptions/api.error";

export default function errorMiddleware(
  error: ApiError,
  request: Request,
  response: Response,
  next: NextFunction
) {
  const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
  const message = error.message || "Something went wrong";
  response.status(status).send({ status, message });
}
