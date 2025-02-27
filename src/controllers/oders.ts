import { Request, Response, NextFunction } from "express";
import { NewOrderRequestFeild } from "../types/types.js";
import Order from "../models/order.js";
import { ErrorHandler } from "../middleware/error_object.js";
import { invalidateCache, reduceStock } from "../utils/feature.js";

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
      Total ,
      orderItem,
    });
    await reduceStock(orderItem);
    await invalidateCache({ products: true, order: true, admin: true });

    return res.status(201).json({
      success: true,
      message: "Ordered Placed Successfully",
    });
  } catch (error) {
    next(new ErrorHandler(error as Error));
  }
};
export { newOrder };
