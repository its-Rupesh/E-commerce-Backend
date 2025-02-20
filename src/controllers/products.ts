import { NextFunction, Request, Response } from "express";
import { NewProductRequestBody } from "../types/types.js";
import Products from "../models/product.js";
import { ErrorHandler } from "../middleware/error_object.js";
import { rm } from "fs";

//Request<Params, ResBody, ReqBody, ReqQuery>
const newproduct = async (
  req: Request<{}, {}, NewProductRequestBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, price, category, stock } = req.body;
    const photo = req.file;

    if (!photo) return next(new ErrorHandler("Please Attach image", 400));
    if (!name || !price || !category || !stock) {
      rm(photo.path, () => {
        console.log("File Removed");
      });
      return next(new ErrorHandler("Please Enter All Feild", 400));
    }
    await Products.create({
      name,
      price,
      category: category.toLowerCase(),
      stock,
      photo: photo.path,
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

const getlatestProduct = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await Products.find({}).sort({ createdAt: -1 }).limit(5);
    return res.status(200).json({
      success: true,
      message: products,
    });
  } catch (error) {
    console.log(error);
    next(new ErrorHandler(error as Error));
  }
};
const getAllCategories = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const category = await Products.distinct("category");
    return res.status(200).json({
      success: true,
      message: category,
    });
  } catch (error) {
    console.log(error);
    next(new ErrorHandler(error as Error));
  }
};
const getAdminProducts = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await Products.find({});
    return res.status(200).json({
      success: true,
      message: products,
    });
  } catch (error) {
    console.log(error);
    next(new ErrorHandler(error as Error));
  }
};
const getSingleProducts = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const product = await Products.findById(id);
    if (!product) return next(new ErrorHandler("Product Not Found", 404));
    return res.status(200).json({
      success: true,
      message: product,
    });
  } catch (error) {
    console.log(error);
    next(new ErrorHandler(error as Error));
  }
};
export {
  newproduct,
  getlatestProduct,
  getAllCategories,
  getAdminProducts,
  getSingleProducts,
};
