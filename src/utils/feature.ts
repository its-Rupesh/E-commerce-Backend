import mongoose from "mongoose";
import { invalidateCache as invalidateCacheProps } from "../types/types.js";
import Products from "../models/product.js";
import { myCache } from "../app.js";
export const connectDb = () => {
  mongoose
    .connect("mongodb://localhost:27017", { dbName: "QuickMart" })
    .then((c) => console.log(`DB Connected to ${c.connection.host}`))
    .catch((e) => console.log(e));
};
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
