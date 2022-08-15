import { Request , Response , NextFunction } from 'express'
import ApiError from '../exeptions/api.error';

export default function errorMiddleware(error: ApiError, request: Request, response: Response, next: NextFunction) {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';
    response.status(status).send({status,message,})
  }