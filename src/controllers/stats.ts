import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../middleware/error_object.js";
import { myCache } from "../app.js";
import Products from "../models/product.js";
import { User } from "../models/user.js";
import Order from "../models/order.js";
import {
  calaculatePercentage,
  getCategory,
  getChartData,
} from "../utils/feature.js";

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
        const monthDiff =
          (today.getMonth() - creationDate.getMonth() + 12) % 12;

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
    let charts;
    if (myCache.has("admin-pie-charts")) {
      charts = JSON.parse(myCache.get("admin-pie-charts")!);
    } else {
      const [
        ProcessingCount,
        ShippedCount,
        DeliverdCount,
        categories,
        ProductCount,
        ProductOutofStock,
        allOrder,
        allUser,
        allUserwithadmin,
        customerUser,
      ] = await Promise.all([
        Order.countDocuments({ status: "Processing" }),
        Order.countDocuments({ status: "Shipped" }),
        Order.countDocuments({ status: "Deliverd" }),
        Products.distinct("category"),
        Products.countDocuments(),
        Products.countDocuments({ stock: 0 }),
        Order.find({}).select([
          "Total",
          "discount",
          "subTotal",
          "tax",
          "shippingCharges",
        ]),
        User.find({}).select(["dob"]),
        User.countDocuments({ role: "admin" }),
        User.countDocuments({ role: "user" }),
      ]);
      const orderFullFillement = {
        processing: ProcessingCount,
        shipped: ShippedCount,
        delivered: DeliverdCount,
      };
      const categoryCount: Array<{ [key: string]: number }> = await getCategory(
        { categories, ProductCount }
      );
      const stockAvailablity = {
        inStock: ProductCount - ProductOutofStock,
        outOfStock: ProductOutofStock,
      };
      const grossIncome = allOrder.reduce(
        (prev, order) => prev + order.Total || 0,
        0
      );
      const discount = allOrder.reduce(
        (prev, order) => prev + order.discount || 0,
        0
      );
      const productionCost = allOrder.reduce(
        (prev, order) => prev + order.shippingCharges || 0,
        0
      );
      const burnt = allOrder.reduce((prev, order) => prev + order.tax || 0, 0);

      const marketingCost = Math.round(grossIncome * (30 / 100));

      const netMargin =
        grossIncome - discount - productionCost - burnt - marketingCost;

      const revenueDistribution = {
        netMargin,
        discount,
        productionCost,
        burnt,
        marketingCost,
      };

      const userAgeGroup = {
        teen: allUser.filter((i) => i.age < 20).length,
        adult: allUser.filter((i) => i.age >= 20 && i.age <= 40).length,
        old: allUser.filter((i) => i.age > 40).length,
      };

      const adminCustomer = { admin: allUserwithadmin, customer: customerUser };
      charts = {
        orderFullFillement,
        categoryCount,
        stockAvailablity,
        revenueDistribution,
        userAgeGroup,
        adminCustomer,
      };
      myCache.set("admin-pie-charts", JSON.stringify(charts));
    }
    return res.status(200).json({
      succes: true,
      charts,
    });
  } catch (error) {
    next(new ErrorHandler(error as Error));
  }
};
const getBarStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let charts;
    const key = "admin-bar-charts";

    if (myCache.has(key)) {
      charts = JSON.parse(myCache.get(key)!);
    } else {
      const today = new Date();

      const sixMonthAgo = new Date();
      sixMonthAgo.setMonth(today.getMonth() - 6);

      const twelveMonthAgo = new Date(); // Corrected spelling
      twelveMonthAgo.setMonth(today.getMonth() - 12); // Corrected calculation

      const twelveMonthOrdersPromise = Order.find({
        createdAt: { $gte: twelveMonthAgo, $lte: today },
      })
        .select("createdAt")
        .lean();

      const SixMonthProductPromise = Products.find({
        createdAt: { $gte: sixMonthAgo, $lte: today },
      })
        .select("createdAt")
        .lean(); // .lean() ensures plain JavaScript objects

      const SixMonthUserPromise = User.find({
        createdAt: { $gte: sixMonthAgo, $lte: today },
      })
        .select("createdAt")
        .lean();

      const [SixMonthProduct, SixMonthUser, twelveMonthOrders] =
        await Promise.all([
          SixMonthProductPromise,
          SixMonthUserPromise,
          twelveMonthOrdersPromise,
        ]);

      // Calculate product data counts
      const Productdata = new Array(6).fill(0);
      SixMonthProduct.forEach((i) => {
        const creationDate = new Date(i.createdAt); // Ensure it's a Date object
        const monthDiff =
          (today.getMonth() - creationDate.getMonth() + 12) % 12;
        if (monthDiff < 6) {
          Productdata[6 - monthDiff - 1] += 1;
        }
      });

      // Calculate user data counts
      const Userdata = new Array(6).fill(0);
      SixMonthUser.forEach((i) => {
        const creationDate = new Date(i.createdAt);
        const monthDiff =
          (today.getMonth() - creationDate.getMonth() + 12) % 12;
        if (monthDiff < 6) {
          Userdata[6 - monthDiff - 1] += 1;
        }
      });

      // Calculate order data counts
      const Orderdata = new Array(12).fill(0);
      twelveMonthOrders.forEach((i) => {
        const creationDate = new Date(i.createdAt);
        const monthDiff =
          (today.getMonth() - creationDate.getMonth() + 12) % 12;
        if (monthDiff < 12) {
          Orderdata[6 - monthDiff - 1] += 1;
        }
      });

      charts = {
        products: Productdata,
        users: Userdata,
        orders: Orderdata,
      };

      myCache.set(key, JSON.stringify(charts));
    }

    return res.status(200).json({
      success: true,
      charts,
    });
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
    let charts;
    const key = "admin-line-charts";

    if (myCache.has(key)) {
      charts = JSON.parse(myCache.get(key)!);
    } else {
      const today = new Date();

      const twelveMonthAgo = new Date(); // Corrected spelling
      twelveMonthAgo.setMonth(today.getMonth() - 12); // Corrected calculation

      const baseQuery = {
        createdAt: {
          $gte: twelveMonthAgo,
          $lte: today,
        },
      };

      const twelveMonthOrdersPromise = Order.find({
        createdAt: { $gte: twelveMonthAgo, $lte: today },
      })
        .select("createdAt")
        .lean();
      const twelveMonthProductsPromise = Products.find({
        createdAt: { $gte: twelveMonthAgo, $lte: today },
      })
        .select("createdAt")
        .lean();
      const twelveMonthUsrsPromise = User.find({
        createdAt: { $gte: twelveMonthAgo, $lte: today },
      })
        .select("createdAt")
        .lean();

      const [twelveMonthProduct, twelveMonthUser, twelveMonthOrders] =
        await Promise.all([
          twelveMonthProductsPromise,
          twelveMonthUsrsPromise,
          twelveMonthOrdersPromise,
        ]);

      // Calculate product data counts
      const Productdata = new Array(12).fill(0);
      twelveMonthProduct.forEach((i) => {
        const creationDate = new Date(i.createdAt); // Ensure it's a Date object
        const monthDiff =
          (today.getMonth() - creationDate.getMonth() + 12) % 12;
        if (monthDiff < 12) {
          Productdata[12 - monthDiff - 1] += 1;
        }
      });

      // Calculate user data counts
      const Userdata = new Array(12).fill(0);
      twelveMonthUser.forEach((i) => {
        const creationDate = new Date(i.createdAt);
        const monthDiff =
          (today.getMonth() - creationDate.getMonth() + 12) % 12;
        if (monthDiff < 12) {
          Userdata[12 - monthDiff - 1] += 1;
        }
      });

      // Calculate order data counts
      const Orderdata = new Array(12).fill(0);
      twelveMonthOrders.forEach((i) => {
        const creationDate = new Date(i.createdAt);
        const monthDiff =
          (today.getMonth() - creationDate.getMonth() + 12) % 12;
        if (monthDiff < 12) {
          Orderdata[12 - monthDiff - 1] += 1;
        }
      });

      const Discountdata = new Array(12).fill(0);
      twelveMonthOrders.forEach((i) => {
        const creationDate = new Date(i.createdAt);
        const monthDiff =
          (today.getMonth() - creationDate.getMonth() + 12) % 12;
        if (monthDiff < 12) {
          Discountdata[12 - monthDiff - 1] += i.discount;
        }
      });

      const Totaldata = new Array(12).fill(0);
      twelveMonthOrders.forEach((i) => {
        const creationDate = new Date(i.createdAt);
        const monthDiff =
          (today.getMonth() - creationDate.getMonth() + 12) % 12;
        if (monthDiff < 12) {
          Totaldata[12 - monthDiff - 1] += i.Total;
        }
      });

      charts = {
        products: Productdata,
        users: Userdata,
        orders: Orderdata,
        Discountdata,
        revenue: Totaldata,
      };

      myCache.set(key, JSON.stringify(charts));
    }

    return res.status(200).json({
      success: true,
      charts,
    });
  } catch (error) {
    next(new ErrorHandler(error as Error));
  }
};
export { getDashboardStats, getPieStats, getLineStats, getBarStats };
