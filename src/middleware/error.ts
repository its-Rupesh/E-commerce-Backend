import { NextFunction, Request, Response } from "express";
import { CustomError } from "./error_object.js";

const errorMiddleware = (
  err: CustomError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }
  return res.status(500).json({
    success: false,
    message: err.message,
  });
};
export default errorMiddleware;
