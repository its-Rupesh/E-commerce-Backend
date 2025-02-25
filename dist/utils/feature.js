import mongoose from "mongoose";
import Products from "../models/product.js";
import { myCache } from "../app.js";
export const connectDb = (url) => {
    mongoose
        .connect(url, { dbName: "QuickMart" })
        .then((c) => console.log(`DB Connected to ${c.connection.host}`))
        .catch((e) => console.log(e));
};
export const invalidateCache = async ({ products, order, admin, }) => {
    if (products) {
        const productKeys = [
            "getlatestProduct",
            "getAllCategories",
            "getAdminproducts",
        ];
        const products_id = await Products.find({}).select("_id");
        products_id.forEach((i) => {
            productKeys.push(`getSingleProducts-${i._id}`);
        });
        myCache.del(productKeys);
    }
};
