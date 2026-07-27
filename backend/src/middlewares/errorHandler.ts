import type { Request, Response, NextFunction } from "express";
import { AppError } from "../core/error.response.js";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      metadata: err.metadata,
    });
  }

  console.error("[Unhandled Error]", err);

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
}
