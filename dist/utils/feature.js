import mongoose from "mongoose";
import Products from "../models/product.js";
import { myCache } from "../app.js";
import { ErrorHandler } from "../middleware/error_object.js";
// Connect MongoDB
export const connectDb = (url) => {
    mongoose
        .connect(url, { dbName: "QuickMart" })
        .then((c) => console.log(`DB Connected to ${c.connection.host}`))
        .catch((e) => console.log(e));
};
// Expires NodeCaching
export const invalidateCache = async ({ products, order, admin, userId, orderId, productId, }) => {
    if (products) {
        const productKeys = [
            "getlatestProduct",
            "getAllCategories",
            "getAdminproducts",
        ];
        if (typeof productId === "string") {
            productKeys.push(`getSingleProducts-${productId}`);
        }
        if (typeof productId === "object") {
            productId.forEach((i) => productKeys.push(`getSingleProducts-${i}`));
        }
        myCache.del(productKeys);
    }
    if (order) {
        const orderKeys = [
            "getAllOrder",
            `getMyOrder-${userId}`,
            `getSingleOrder-${orderId}`,
        ];
        myCache.del(orderKeys);
    }
};
// Reduce Stock
export const reduceStock = async (orderItem) => {
    for (let i = 0; i < orderItem.length; i++) {
        const order = orderItem[i];
        const product = await Products.findById(order.productId);
        if (!product)
            throw new ErrorHandler("No Product");
        product.stock -= order.quantity;
        await product.save();
    }
};
export const calaculatePercentage = (thisMonth, lastMonth) => {
    if (lastMonth === 0)
        return thisMonth * 100;
    const precent = ((thisMonth - lastMonth) / lastMonth) * 100;
    return Number(precent.toFixed(0));
};
