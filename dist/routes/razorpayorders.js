import express from "express";
import { createOrder } from "../controllers/razorpay.js";
const app = express.Router();
app.post("/working", createOrder);
export default app;
