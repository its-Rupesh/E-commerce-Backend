import { NextFunction, Request, Response } from "express";
import fs, { rm } from "fs";
import path from "path";
import { ErrorHandler } from "../middleware/error_object.js";
import Products from "../models/product.js";
import { NewProductRequestBody, UpdateproductFeilds } from "../types/types.js";

import { fileURLToPath } from "url";

// Manually define `__dirname`
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    const product = await Products.create({
      name,
      price,
      category: category.toLowerCase(),
      stock,
      photo: photo.path,
    });
    res.json({
      success: true,
      message: "Product Added Succesffully..!!",
      product,
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
const updateSingleProduct = async (
  req: Request<{ id: string }, {}, Partial<UpdateproductFeilds>>,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    const updateFeilds: Partial<UpdateproductFeilds> = req.body;

    const product = await Products.findById(id);
    if (!product) return next(new ErrorHandler("Invalid Product Id..!!", 404));

    if (req.file) {
      const newPhoto = req.file.path;
      if (product.photo) {
        const oldphoto = path.join(__dirname, "../upload", product.photo);
        if (fs.existsSync(oldphoto)) {
          fs.unlinkSync(oldphoto);
        }
      }
      updateFeilds.photo = newPhoto;
    }
    const updateProduct = await Products.findByIdAndUpdate(
      id,
      { $set: updateFeilds },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updateProduct,
    });
  } catch (error) {
    next(new ErrorHandler(error as Error));
  }
};
const deleteProduct = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    const product = await Products.findById(id);
    if (!product) return next(new ErrorHandler("Invalid Product Id..!!", 404));

    rm(product.photo!, () => {
      console.log("Old Photo Deleted");
    });

    await Products.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    next(new ErrorHandler(error as Error));
  }
};
export {
  getAdminProducts,
  getAllCategories,
  getlatestProduct,
  getSingleProducts,
  newproduct,
  updateSingleProduct,
  deleteProduct,
};
