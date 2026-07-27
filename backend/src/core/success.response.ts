import type { Response } from "express";

interface SuccessResponseParams<T> {
  message?: string;
  data?: T;
  statusCode?: number;
}

export function sendSuccess<T>(
  res: Response,
  { message = "Success", data, statusCode = 200 }: SuccessResponseParams<T>
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function Success<T>(res: Response, data: T, message = "Success") {
  return sendSuccess(res, { message, data, statusCode: 200 });
}

export function Created<T>(res: Response, data: T, message = "Created Successfully") {
  return sendSuccess(res, { message, data, statusCode: 201 });
}
