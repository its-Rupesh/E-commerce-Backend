import fs, { rm } from "fs";
import path from "path";
import { ErrorHandler } from "../middleware/error_object.js";
import Products from "../models/product.js";
import { fileURLToPath } from "url";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/feature.js";
// Manually define `__dirname`
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
        const product = await Products.create({
            name,
            price,
            category: category.toLowerCase(),
            stock,
            photo: photo.path,
        });
        invalidateCache({ products: true, admin: true });
        res.json({
            success: true,
            message: "Product Added Succesffully..!!",
            product,
        });
    }
    catch (error) {
        console.log(error);
        next(new ErrorHandler(error));
    }
};
// Revaluate Cache on New or Update,New Order,Delete Product
const getlatestProduct = async (req, //Request<Params, ResBody, ReqBody, ReqQuery>
res, next) => {
    try {
        let products;
        if (myCache.has("getlatestProduct")) {
            let productData = myCache.get("getlatestProduct");
            products = JSON.parse(productData);
        }
        else {
            products = await Products.find({}).sort({ createdAt: -1 }).limit(5);
            myCache.set("getlatestProduct", JSON.stringify(products), 600);
        }
        // stringify-->converts a JavaScript object or array into a JSON-formatted (string)
        //JSON.parse() converts a JSON string back into a JavaScript object or array.
        invalidateCache({ products: true });
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
// Revaluate Cache on New or Update,New Order,Delete Product
const getAllCategories = async (req, res, next) => {
    try {
        let category;
        if (myCache.has("getAllCategories")) {
            category = JSON.parse(myCache.get("getAllCategories"));
        }
        else {
            category = await Products.distinct("category");
            myCache.set("getAllCategories", JSON.stringify(category), 600);
        }
        invalidateCache({ products: true });
        return res.status(200).json({
            success: true,
            message: category,
        });
    }
    catch (error) {
        console.log(error);
        next(new ErrorHandler(error));
    }
};
// Revaluate Cache on New or Update,New Order,Delete Product
//Request<Params, ResBody, ReqBody, ReqQuery>
const getAdminProducts = async (req, res, next) => {
    try {
        let products;
        if (myCache.has("getAdminproducts")) {
            products = JSON.parse(myCache.get("getAdminproducts"));
        }
        else {
            products = await Products.find({});
            myCache.set("getAdminproducts", JSON.stringify(products), 600);
        }
        invalidateCache({ products: true });
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
const getSingleProducts = async (req, res, next) => {
    try {
        const id = req.params.id;
        let product;
        if (myCache.has(`getSingleProducts-${id}`)) {
            product = JSON.parse(myCache.get(`getSingleProducts-${id}`));
        }
        else {
            product = await Products.findById(id);
            if (!product)
                return next(new ErrorHandler("Product Not Found", 404));
            myCache.set(`getSingleProducts-${id}`, JSON.stringify(product), 600);
        }
        invalidateCache({ products: true });
        return res.status(200).json({
            success: true,
            message: product,
        });
    }
    catch (error) {
        console.log(error);
        next(new ErrorHandler(error));
    }
};
//Request<Params, ResBody, ReqBody, ReqQuery>
const updateSingleProduct = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const updateFeilds = req.body;
        const product = await Products.findById(productId);
        if (!product)
            return next(new ErrorHandler("Invalid Product Id..!!", 404));
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
        const updateProduct = await Products.findByIdAndUpdate(productId, { $set: updateFeilds }, { new: true, runValidators: true });
        invalidateCache({
            products: true,
            productId: String(product._id),
            admin: true,
        });
        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            // product: updateProduct,
        });
    }
    catch (error) {
        next(new ErrorHandler(error));
    }
};
//Request<Params, ResBody, ReqBody, ReqQuery>
const deleteProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        const product = await Products.findById(id);
        if (!product)
            return next(new ErrorHandler("Product Not Found..!!", 404));
        rm(product.photo, () => {
            console.log("Old Photo Deleted");
        });
        await Products.findByIdAndDelete(id);
        invalidateCache({
            products: true,
            productId: String(product._id),
            admin: true,
        });
        return res.status(200).json({
            success: true,
            message: "Product Deleted successfully",
        });
    }
    catch (error) {
        next(new ErrorHandler(error));
    }
};
//Request<Params, ResBody, ReqBody, ReqQuery>
const searchProduct = async (req, res, next) => {
    try {
        // const product = await Products.find({}).sort({ createdAt: -1 }).limit(5);
        const { search, price, category, sort } = req.query;
        let page = Number(req.query.page) || 1;
        let limit = Number(process.env.PRODUCT_PER_PAGE) || 6;
        let skip = (page - 1) * limit;
        const baseQuery = {};
        if (search)
            baseQuery.name = { $regex: search, $options: "i" };
        if (price)
            baseQuery.price = { $lte: Number(price) };
        if (category)
            baseQuery.category = category;
        const productsPromise = Products.find(baseQuery)
            .sort(sort && { price: sort === "asc" ? 1 : -1 })
            .limit(limit)
            .skip(skip);
        const [product, filteredProducts] = await Promise.all([
            productsPromise,
            Products.find(baseQuery),
        ]);
        const totalPage = Math.ceil(filteredProducts.length / limit);
        return res.status(200).json({
            success: true,
            message: product,
            totalPage,
        });
    }
    catch (error) {
        next(new ErrorHandler(error));
    }
};
export { getAdminProducts, getAllCategories, getlatestProduct, getSingleProducts, newproduct, updateSingleProduct, deleteProduct, searchProduct, };
