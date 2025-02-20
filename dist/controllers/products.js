import Products from "../models/product.js";
import { ErrorHandler } from "../middleware/error_object.js";
import { rm } from "fs";
//Request<Params, ResBody, ReqBody, ReqQuery>
const newproduct = async (req, res, next) => {
    try {
        const { name, price, category, stock } = req.body;
        const photo = req.file;
        if (!photo)
            return next(new ErrorHandler("Please Attach image", 400));
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
    }
    catch (error) {
        console.log(error);
        next(new ErrorHandler(error));
    }
};
const getlatestProduct = async (req, res, next) => {
    try {
        const products = await Products.find({}).sort({ createdAt: -1 }).limit(5);
        return res.status(200).json({
            success: true,
            message: products,
        });
    }
    catch (error) {
        console.log(error);
        next(new ErrorHandler(error));
    }
};
export { newproduct, getlatestProduct };
