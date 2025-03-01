import mongoose from "mongoose";
import {
  invalidateCache as invalidateCacheProps,
  OrderItemType,
} from "../types/types.js";
import Products from "../models/product.js";
import { myCache } from "../app.js";
import { ErrorHandler } from "../middleware/error_object.js";
import Order from "../models/order.js";

// Connect MongoDB
export const connectDb = (url: string) => {
  mongoose
    .connect(url, { dbName: "QuickMart" })
    .then((c) => console.log(`DB Connected to ${c.connection.host}`))
    .catch((e) => console.log(e));
};

// Expires NodeCaching
export const invalidateCache = ({
  products,
  order,
  admin,
  userId,
  orderId,
  productId,
}: Partial<invalidateCacheProps>) => {
  if (products) {
    const productKeys: string[] = [
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
    const orderKeys: string[] = [
      "getAllOrder",
      `getMyOrder-${userId}`,
      `getSingleOrder-${orderId}`,
    ];
    myCache.del(orderKeys);
  }
  if (admin) {
    myCache.del([
      "admin-stats",
      "admin-pie-charts",
      "admin-bar-charts",
      "admin-line-charts",
    ]);
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

export const calaculatePercentage = (thisMonth: number, lastMonth: number) => {
  if (lastMonth === 0) return thisMonth * 100;
  const precent = (thisMonth / lastMonth) * 100;
  return Number(precent.toFixed(0));
};

export const getCategory = async ({
  categories,
  ProductCount,
}: {
  categories: string[];
  ProductCount: number;
}) => {
  const categoriescountPromise = categories.map((category) =>
    Products.countDocuments({ category })
  );
  const categoriescount = await Promise.all(categoriescountPromise);

  const categoryCount: Array<{ [key: string]: number }> = [];

  categories.forEach((category, i) => {
    categoryCount.push({
      [category]: Math.round((categoriescount[i] / ProductCount) * 100),
    });
  });
  return categoryCount;
};
interface myDocuemnet extends Document {
  createdAt: Date;
}
type FuncProps = { length: number; docArr: myDocuemnet[]; today: Date };

export const getChartData = ({ length, docArr, today }: FuncProps) => {
  const data = new Array(length).fill(0);

  docArr.forEach((i) => {
    const creationDate = i.createdAt;
    const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;

    if (monthDiff < length) {
      data[length - monthDiff - 1] += 1;
    }
  });
  return data;
};
