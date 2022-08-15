class ApiError extends Error {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
  static UnauthorizedError() {
    return new ApiError(401, "User is not authorized");
  }
  static BadRequest(message:string){
    return new ApiError(400 , message)
}
}

export default ApiError;
