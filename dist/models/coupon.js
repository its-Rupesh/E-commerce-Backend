import mongoose from "mongoose";
const schema = new mongoose.Schema({
    coupon: {
        type: String,
        required: [true, "Please Enter Coupon Code"],
        unique: true,
    },
    amount: {
        type: Number,
        required: [true, "Please Enter Discount Amount"],
    },
});
const Coupon = mongoose.model("coupon", schema);
export default Coupon;
