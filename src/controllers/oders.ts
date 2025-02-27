import { Request, Response, NextFunction } from "express";
import { NewOrderRequestFeild } from "../types/types.js";
import Order from "../models/order.js";
import { ErrorHandler } from "../middleware/error_object.js";
import { invalidateCache, reduceStock } from "../utils/feature.js";
import { myCache } from "../app.js";
import { json } from "stream/consumers";

const newOrder = async (
  req: Request<{}, {}, NewOrderRequestFeild>,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      shippingInfo,
      user,
      subTotal,
      tax,
      shippingCharges,
      discount,
      Total,
      orderItem,
    } = req.body;
    if (
      !shippingInfo ||
      !user ||
      !subTotal ||
      !tax ||
      !shippingCharges ||
      !discount ||
      !Total ||
      !orderItem
    ) {
      return next(new ErrorHandler("Please Enter All Feilds", 400));
    }
    await Order.create({
      shippingInfo,
      user,
      subTotal,
      tax,
      shippingCharges,
      discount,
      Total,
      orderItem,
    });
    await reduceStock(orderItem);
    await invalidateCache({ products: true, order: true, admin: true });

    return res.status(200).json({
      success: true,
      message: "Ordered Placed Successfully",
    });
  } catch (error) {
    next(new ErrorHandler(error as Error));
  }
};

const getMyOrder = async (
  req: Request<{}, {}, {}, { id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    let { id } = req.query;
    if (!id) next(new ErrorHandler("Please Enter Id", 400));

    let orders = [];

    if (myCache.has(`getMyOrder-${id}`))
      orders = JSON.parse(myCache.get(`getMyOrder-${id}`)!);
    else {
      orders = await Order.find({ user: id });
      myCache.set(`getMyOrder-${id}`, JSON.stringify(orders));
    }
    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(new ErrorHandler(error as Error));
  }
};

const allOrder = async (
  req: Request<{}, {}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    let allOrder = [];
    if (myCache.has(`getAllOrder`))
      allOrder = JSON.parse(myCache.get(`getAllOrder`)!);
    else {
      allOrder = await Order.find({}).populate("user", "name");
      myCache.set(`getAllOrder`, JSON.stringify(allOrder));
    }
    return res.status(200).json({
      success: true,
      allOrder,
    });
  } catch (error) {
    next(new ErrorHandler(error as Error));
  }
};
export { newOrder, getMyOrder, allOrder };
