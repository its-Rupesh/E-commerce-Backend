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
            Createdcoupon: Createdcoupon,
        });
    }
    catch (error) {
        console.log(error);
        next(new ErrorHandler(error));
    }
};
export { newCoupon };
