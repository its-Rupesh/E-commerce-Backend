import mongoose from "mongoose";
import {
  invalidateCache as invalidateCacheProps,
  OrderItemType,
} from "../types/types.js";
import Products from "../models/product.js";
import { myCache } from "../app.js";
import { ErrorHandler } from "../middleware/error_object.js";

// Connect MongoDB
export const connectDb = (url: string) => {
  mongoose
    .connect(url, { dbName: "QuickMart" })
    .then((c) => console.log(`DB Connected to ${c.connection.host}`))
    .catch((e) => console.log(e));
};

// Expires NodeCaching
export const invalidateCache = async ({
  products,
  order,
  admin,
}: Partial<invalidateCacheProps>) => {
  if (products) {
    const productKeys: string[] = [
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
// Reduce Stock
export const reduceStock = async (orderItem: OrderItemType[]) => {
  for (let i = 0; i < orderItem.length; i++) {
    const order = orderItem[i];
    const product = await Products.findById(order.productId);
    if (!product) throw new ErrorHandler("No Product");
    product.stock -= order.quantity;
    await product.save();
  }
};
