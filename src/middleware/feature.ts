import { NextFunction, Request, Response } from "express";

const paramsChecker = (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.id) {
    return res.status(400).json({
      success: false,
      message: "Coupon ID is required!",
    });
  }
  next();
};

export { paramsChecker };
