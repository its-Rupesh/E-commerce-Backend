import Order from "../models/order.js";
import { ErrorHandler } from "../middleware/error_object.js";
import { invalidateCache, reduceStock } from "../utils/feature.js";
import { myCache } from "../app.js";
const newOrder = async (req, res, next) => {
    try {
        const { shippingInfo, user, subTotal, tax, shippingCharges, discount, Total, orderItem, } = req.body;
        if (!shippingInfo ||
            !user ||
            !subTotal ||
            !tax ||
            !shippingCharges ||
            !discount ||
            !Total ||
            !orderItem) {
            return next(new ErrorHandler("Please Enter All Feilds", 400));
        }
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
        await invalidateCache({
            products: true,
            order: true,
            admin: true,
            userId: user,
            productId: order.orderItem.map((i) => String(i.productId)),
        });
        return res.status(200).json({
            success: true,
            message: "Ordered Placed Successfully",
        });
    }
    catch (error) {
        next(new ErrorHandler(error));
    }
};
const getMyOrder = async (req, res, next) => {
    try {
        let { id } = req.query;
        if (!id)
            next(new ErrorHandler("Please Enter Id", 400));
        let orders = [];
        if (myCache.has(`getMyOrder-${id}`))
            orders = JSON.parse(myCache.get(`getMyOrder-${id}`));
        else {
            orders = await Order.find({ user: id });
            myCache.set(`getMyOrder-${id}`, JSON.stringify(orders));
        }
        return res.status(200).json({
            success: true,
            orders,
        });
    }
    catch (error) {
        next(new ErrorHandler(error));
    }
};
const allOrder = async (req, res, next) => {
    try {
        let allOrder = [];
        if (myCache.has(`getAllOrder`))
            allOrder = JSON.parse(myCache.get(`getAllOrder`));
        else {
            allOrder = await Order.find({}).populate("user", "name");
            myCache.set(`getAllOrder`, JSON.stringify(allOrder));
        }
        return res.status(200).json({
            success: true,
            allOrder,
        });
    }
    catch (error) {
        next(new ErrorHandler(error));
    }
};
const getSingleOrder = async (req, res, next) => {
    try {
        const id = req.params.id;
        let order;
        const key = `getSingleOrder-${id}`;
        if (myCache.has(key)) {
            order = JSON.parse(myCache.get(key));
        }
        else {
            order = await Order.findById(id);
            if (!order)
                return next(new ErrorHandler("Order Not Found!!", 400));
            myCache.set(key, JSON.stringify(order));
        }
        return res.status(200).json({
            success: true,
            order,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error));
    }
};
const processOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);
        if (!order)
            return next(new ErrorHandler("Order Not Found", 404));
        // Changing product feild
        if (order.status === "Processing") {
            order.status = "Shipped";
        }
        else if (order.status === "Shipped")
            order.status = "Deliverd";
        else {
            order.status = "Deliverd";
        }
        await order.save();
        invalidateCache({
            products: false,
            order: true,
            admin: true,
            userId: order.user,
            orderId: String(order._id),
        });
        return res.status(200).json({
            success: true,
            message: "Ordered Processed Successfully",
        });
    }
    catch (error) {
        next(new ErrorHandler(error));
    }
};
const deleteOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);
        if (!order)
            return next(new ErrorHandler("Order Not Found", 404));
        // Changing product feild
        await order.deleteOne();
        invalidateCache({
            products: false,
            order: true,
            admin: true,
            userId: order.user,
            orderId: String(order._id),
        });
        return res.status(200).json({
            success: true,
            message: "Ordered Deleted Successfully",
        });
    }
    catch (error) {
        next(new ErrorHandler(error));
    }
};
export { newOrder, getMyOrder, allOrder, getSingleOrder, processOrder, deleteOrder, };
