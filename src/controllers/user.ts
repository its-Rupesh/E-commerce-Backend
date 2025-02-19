import { NextFunction, Request, Response } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";
import { ErrorHandler } from "../middleware/error_object.js";

export const newUser = async (
  req: Request<{}, {}, NewUserRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    // next(new CustomError("Custom error", 404));
    // next(new CustomError("Error"));
    // next(new ErrorHandler());
    const { name, email, photo, _id, gender, dob } = req.body;
    const user = await User.create({
      name,
      email,
      photo,
      _id,
      gender,
      dob: new Date(dob),
    });

    return res.status(200).json({
      success: true,
      message: user,
    });
  } catch (error) {
    next(new ErrorHandler(error as Error, 404));
  }
};
