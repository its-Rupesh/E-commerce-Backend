import express from "express";
import { applyDiscount, newCoupon, getAllCoupon, deleteCoupon,
// createPayementRequest,
 } from "../controllers/payement.js";
import { paramsChecker } from "../middleware/feature.js";
import { adminOnly } from "../middleware/auth.js";
const app = express.Router();
//NewCoupon
app.post("/coupon/new", adminOnly, newCoupon);
// Apply Discount
app.get("/discount", applyDiscount);
// All Coupon
app.get("/coupon/all", adminOnly, getAllCoupon);
// Delete Coupon
app.delete("/coupon/delete/:id?", adminOnly, paramsChecker, deleteCoupon);
export default app;
