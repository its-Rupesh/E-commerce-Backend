import { ErrorHandler } from "../middleware/error_object.js";
import Coupon from "../models/coupon.js";
const newCoupon = async (req, res, next) => {
    try {
        const { coupon, amount } = req.body;
        console.log(typeof coupon);
        console.log(typeof amount);
        console.log(req.body);
        const Createdcoupon = await Coupon.create({ coupon, amount });
        return res.status(201).json({
            success: true,
            Createdcoupon: Createdcoupon,
        });
    }
    catch (error) {
        console.log(error);
        next(new ErrorHandler(error));
    }
};
const applyDiscount = async (req, res, next) => {
    try {
        if (!req.query.coupon)
            return next(new ErrorHandler("Please Enter Coupon!!!"));
        const { coupon: CouponCode } = req.query;
        const discount = await Coupon.findOne({ coupon: CouponCode });
        if (!discount)
            return next(new ErrorHandler("Invalid Coupon Code", 400));
        return res.status(200).json({
            success: true,
            discount: discount.amount,
        });
    }
    catch (error) {
        console.log(error);
        next(new ErrorHandler(error));
    }
};
const getAllCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.find({});
        return res.status(200).json({
            success: true,
            message: coupon,
        });
    }
    catch (error) {
        console.log(error);
        next(new ErrorHandler(error));
    }
};
const deleteCoupon = async (req, res, next) => {
    try {
        const { id } = req.params;
        const deletecoupon = await Coupon.findByIdAndDelete(id);
        return res.status(200).json({
            success: true,
            message: `${deletecoupon?.coupon} Deleted Successfully!!`,
        });
    }
    catch (error) {
        console.log(error);
        next(new ErrorHandler(error));
    }
};
export { applyDiscount, deleteCoupon, getAllCoupon, newCoupon };
