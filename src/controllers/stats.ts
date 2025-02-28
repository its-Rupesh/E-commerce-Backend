import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../middleware/error_object.js";
import { myCache } from "../app.js";
import Products from "../models/product.js";
import { User } from "../models/user.js";
import Order from "../models/order.js";
import { calaculatePercentage } from "../utils/feature.js";

const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let stats = {};
    if (myCache.has("admin-stats")) {
      stats = JSON.parse(myCache.get("admin-stats")!);
    } else {
      const today = new Date();
      const sixMonthAgo = new Date();
      sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);

      const thisMonth = {
        start: new Date(today.getFullYear(), today.getMonth(), 1),
        end: today,
      };
      const lastMonth = {
        start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        end: new Date(today.getFullYear(), today.getMonth(), 1),
      };

      const thisMonthProductsPromise = Products.find({
        createdAt: { $gte: thisMonth.start, $lte: thisMonth.end },
      });
      const lastMonthProductsPromise = Products.find({
        createdAt: { $gte: lastMonth.start, $lte: lastMonth.end },
      });

      const thisMonthUserPromise = User.find({
        createdAt: { $gte: thisMonth.start, $lte: thisMonth.end },
      });
      const lastMonthUserPromise = User.find({
        createdAt: { $gte: lastMonth.start, $lte: lastMonth.end },
      });

      const thisMonthOrderPromise = Order.find({
        createdAt: { $gte: thisMonth.start, $lte: thisMonth.end },
      });
      const lastMonthOrderPromise = Order.find({
        createdAt: { $gte: lastMonth.start, $lte: lastMonth.end },
      });

      const MonthOrderPromise = Order.find({
        createdAt: { $gte: thisMonth.start, $lte: thisMonth.end },
      });
      const lastSixMonthOrderPromise = Order.find({
        createdAt: { $gte: sixMonthAgo, $lte: today },
      });
      const lastTransactionPromise = Order.find({})
        .select(["orderItem", "discount", "Total", "status"])
        .limit(4);

      const [
        thisMonthProducts,
        lastMonthProducts,
        thisMonthUser,
        lastMonthUser,
        thisMonthOrder,
        lastMonthOrder,
        ProductCount,
        UserCount,
        allOrder,
        lastSixMonthOrder,
        categories,
        femaleUserCount,
        lastTransaction,
      ] = await Promise.all([
        thisMonthProductsPromise,
        lastMonthProductsPromise,
        thisMonthUserPromise,
        lastMonthUserPromise,
        thisMonthOrderPromise,
        lastMonthOrderPromise,
        Products.countDocuments(),
        User.countDocuments(),
        Order.find({}).select("Total"),
        lastSixMonthOrderPromise,
        Products.distinct("category"),
        User.countDocuments({ gender: "female" }),
        lastTransactionPromise,
      ]);

      const thisMonthRevenue = thisMonthOrder.reduce(
        (total, order) => total + (order?.Total || 0),
        0
      );
      const lastMonthRevenue = lastMonthOrder.reduce(
        (total, order) => total + (order?.Total || 0),
        0
      );
      const Revenue = allOrder.reduce(
        (total, order) => total + (order?.Total || 0),
        0
      );
      const count = {
        Revenue,
        user: UserCount,
        product: ProductCount,
        order: allOrder.length,
      };

      const orderMonthCounts = new Array(6).fill(0);
      const orderMonthRevenue = new Array(6).fill(0);

      lastSixMonthOrder.forEach((order) => {
        const creationDate = order.createdAt;
        const monthDiff = today.getMonth() - creationDate.getMonth();

        if (monthDiff < 6) {
          orderMonthCounts[6 - monthDiff - 1] += 1;
          orderMonthRevenue[6 - monthDiff - 1] += order.Total;
        }
      });
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

      const Useratio = {
        male: UserCount - femaleUserCount,
        female: femaleUserCount,
      };
      const modifyLatestTransaction = lastTransaction.map((i) => ({
        _id: i._id,
        discount: i.discount,
        amount: i.Total,
        quantity: i.orderItem.length,
        status: i.status,
      }));
      stats = {
        categoryCount,
        revenue: calaculatePercentage(thisMonthRevenue, lastMonthRevenue),
        product: calaculatePercentage(
          thisMonthProducts.length,
          lastMonthProducts.length
        ),
        user: calaculatePercentage(thisMonthUser.length, lastMonthUser.length),
        order: calaculatePercentage(
          thisMonthOrder.length,
          lastMonthOrder.length
        ),
        count,
        chart: {
          order: orderMonthCounts,
          revenue: orderMonthRevenue,
        },
        Useratio,
        lastTransaction: modifyLatestTransaction,
      };

      myCache.set("admin-stats", JSON.stringify(stats));
    }
    return res.status(200).json({
      succes: true,
      stats,
    });
  } catch (error) {
    next(new ErrorHandler(error as Error));
  }
};
const getPieStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {
    next(new ErrorHandler(error as Error));
  }
};
const getBarStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {
    next(new ErrorHandler(error as Error));
  }
};
const getLineStats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  } catch (error) {
    next(new ErrorHandler(error as Error));
  }
};
export { getDashboardStats, getPieStats, getLineStats, getBarStats };
