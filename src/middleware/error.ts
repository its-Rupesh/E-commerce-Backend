import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "./error_object.js";

const errorMiddleware = (
  err: ErrorHandler | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err instanceof ErrorHandler ? err.statusCode : 500;
  let message = err.message || "Internal Server Error";
  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid ID format";
  }
  return res.status(statusCode).json({
    success: false,
    message,
  });
};
export default errorMiddleware;
