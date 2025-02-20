import { NextFunction, Request, Response } from "express";
import { NewProductRequestBody } from "../types/types.js";
import Products from "../models/product.js";
import { ErrorHandler } from "../middleware/error_object.js";

const newproduct = async (
  req: Request<{}, {}, NewProductRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, price, category, stock } = req.body;
    const photo = req.file;
    await Products.create({
      name,
      price,
      category: category.toLowerCase(),
      stock,
      photo: photo?.path,
    });
    res.json({
      success: true,
      message: "Product Added Succesffully..!!",
    });
  } catch (error) {
    console.log(error);
    next(new ErrorHandler(error as Error));
  }
};

export { newproduct };
