import express from "express";
import { newCoupon } from "../controllers/payement.js";
const app = express.Router();

app.post("/coupon/new", newCoupon);

export default app;
