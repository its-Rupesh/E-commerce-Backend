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
            type: Number,
            required: [true, "Please Enter state"],
        },
        country: {
            type: String,
            required: [true, "Please Enter country"],
        },
        pinCode: {
            type: Number,
            required: [true, "Please Enter pinCode"],
            trim: true,
        },
    },
    user: {
        type
    }
}, { timestamps: true });
const Order = mongoose.model("Order", schema);
export default Order;
