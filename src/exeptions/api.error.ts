import { StatusCodes } from "http-status-codes";

class ApiError extends Error {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
  static UnauthorizedError() {
    return new ApiError(StatusCodes.UNAUTHORIZED, "User is not authorized");
  }
  static BadRequest(message: string) {
    return new ApiError(StatusCodes.BAD_REQUEST, message);
  }
}

export default ApiError;
