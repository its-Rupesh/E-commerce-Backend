import { config } from "dotenv";
config();

import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../middleware/error_object.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import Order from "../models/order.js";
import { invalidateCache, reduceStock } from "../utils/feature.js";

type optionsType = {
  amount: number;
  currency: string;
  receipt: string;
};

type orderType = {
  productId: string;
  stock: number;
  name: string;
  photo: string;
  price: number;
  quantity: number;
};

type placedOrderDataType = {
  shippingInfo: {
    address: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
  };
  user: string;
  subTotal: number;
  tax: number;
  shippingCharges: number;
  discount: number;
  Total: number;
  orderItem: orderType[];
};

orderItem: [];

// Payment verification interface
interface PaymentVerificationBody {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  placedOrderData: placedOrderDataType;
}

const createOrder = async (
  req: Request<{}, {}, { amount: string; currency: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Verify environment variables
    const key_id = "rzp_test_rUfmF2MjJhTH93";
    const key_secret = "Qqw2cySRM1cKRu40ZGfw6Mvy";

    if (!key_id || !key_secret) {
      return res.status(500).json({
        error: "Razorpay credentials are not properly configured",
      });
    }

    // Initialize Razorpay with correct credentials
    const razorpayInstance = new Razorpay({
      key_id: key_id,
      key_secret: key_secret,
    });

    const { amount, currency = "INR" } = req.body;

    // Validate amount
    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        error: "Invalid amount provided",
      });
    }

    const options: optionsType = {
      amount: Math.round(parsedAmount * 100), // Convert to paisa/cents
      currency,
      receipt: `order_receipt_${Date.now()}`, // Use timestamp for unique receipt
    };

    // Create order with proper error handling
    const order = await razorpayInstance.orders.create(options);

    return res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay Order Creation Error:", error);

    // More detailed error handling
    if (error instanceof Error) {
      return res.status(401).json({
        error: "Authentication failed",
        details: error.message,
      });
    }
    next(new ErrorHandler(error as Error));
  }
};

const verifyPayment = async (
  req: Request<{}, {}, PaymentVerificationBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      placedOrderData,
    } = req.body;

    console.log(placedOrderData);

    // Validate input
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification details",
      });
    }

    // Retrieve Razorpay key secret from environment
    const razorpay_key_secret = "Qqw2cySRM1cKRu40ZGfw6Mvy";
    if (!razorpay_key_secret) {
      return res.status(500).json({
        success: false,
        message: "Razorpay secret key not configured",
      });
    }

    // Create signature
    const generated_signature = crypto
      .createHmac("sha256", razorpay_key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // Compare signatures
    const isSignatureValid = generated_signature === razorpay_signature;

    if (!isSignatureValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Optional: Save payment details to database
    // You might want to create a new transaction or update order status here
    // For example:
    // await Order.findOneAndUpdate(
    //   { razorpay_order_id },
    //   {
    //     payment_status: 'completed',
    //     razorpay_payment_id,
    //     payment_date: new Date()
    //   }
    // );

    const {
      shippingInfo,
      user,
      subTotal,
      tax,
      shippingCharges,
      discount,
      Total,
      orderItem,
    } = placedOrderData;

    const order = await Order.create({
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

    invalidateCache({
      products: true,
      order: true,
      admin: true,
      userId: user,
      productId: order.orderItem.map((i) => String(i.productId)),
    });

    // Respond with success
    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error("Payment Verification Error:", error);
    next(new ErrorHandler(error as Error));
  }
};

export { createOrder, verifyPayment };
