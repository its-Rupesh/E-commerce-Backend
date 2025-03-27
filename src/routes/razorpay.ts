import express from "express";
import { createOrder, verifyPayment } from "../controllers/razorpay.js";

const app = express.Router();

// Dashboard Stats
app.post("/", createOrder);

app.post("/verify-payment", verifyPayment);

export default app;
