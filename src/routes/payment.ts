import express from "express";
import {
  applyDiscount,
  newCoupon,
  getAllCoupon,
  deleteCoupon,
} from "../controllers/payement.js";
import { paramsChecker } from "../middleware/feature.js";
import { adminOnly } from "../middleware/auth.js";
const app = express.Router();

app.post("/coupon/new", adminOnly, newCoupon);
app.get("/discount", adminOnly, applyDiscount);
app.get("/coupon/all", adminOnly, getAllCoupon);
app.delete("/coupon/delete/:id?", adminOnly, paramsChecker, deleteCoupon);

export default app;
