import Razorpay from "razorpay";
import { config } from "dotenv";

config({ path: "./.env" });

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_SECRET || "",
});

console.log(razorpay);

export default razorpay;
