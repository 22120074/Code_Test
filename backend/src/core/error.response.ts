export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public metadata?: any;

  constructor(message: string, statusCode: number, metadata?: any) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.metadata = metadata;
    Error.captureStackTrace(this, this.constructor);
  }

  static BadRequest(message = "Bad Request", metadata?: any) {
    return new AppError(message, 400, metadata);
  }

  static Unauthorized(message = "Unauthorized", metadata?: any) {
    return new AppError(message, 401, metadata);
  }

  static Forbidden(message = "Forbidden", metadata?: any) {
    return new AppError(message, 403, metadata);
  }

  static NotFound(message = "Not Found", metadata?: any) {
    return new AppError(message, 404, metadata);
  }

  static Conflict(message = "Conflict", metadata?: any) {
    return new AppError(message, 409, metadata);
  }

  static InternalServer(message = "Internal Server Error", metadata?: any) {
    return new AppError(message, 500, metadata);
  }
}
