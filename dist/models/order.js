import mongoose from "mongoose";
const schema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: [true, "Please Enter Address"],
        },
        city: {
            type: String,
            required: [true, "Please Enter city"],
        },
        state: {
            type: String,
            required: [true, "Please Enter state"],
        },
        country: {
            type: String,
            required: [true, "Please Enter country"],
        },
        pinCode: {
            type: Number,
            required: [true, "Please Enter pinCode"],
        },
    },
    user: {
        type: String,
        ref: "User",
        required: [true, "Please Enter user-id"],
    },
    subTotal: {
        type: Number,
        required: [true, "Please Enter subTotal"],
    },
    tax: {
        type: Number,
        required: true,
    },
    shippingCharges: {
        type: Number,
        required: true,
        default: 0,
    },
    discount: {
        type: Number,
        required: true,
        default: 0,
    },
    Total: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["Processing", "Shipped", "Deliverd"],
        default: "Processing",
    },
    orderItem: [
        {
            name: String,
            photo: String,
            price: Number,
            quantity: Number,
            productId: {
                type: mongoose.Types.ObjectId,
                ref: "Products",
            },
        },
    ],
}, { timestamps: true });
const Order = mongoose.model("Order", schema);
export default Order;
