import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "./error_object.js";

const errorMiddleware = (
  err: ErrorHandler | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof ErrorHandler ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    message,
  });
};
export default errorMiddleware;
