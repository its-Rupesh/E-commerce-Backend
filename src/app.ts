import express from "express";

//Routes
import userRoute from "./routes/user.js";
import products from "./routes/products.js";
import orders from "./routes/order.js";
import payement from "./routes/payment.js";
import stats from "./routes/stats.js"; //Dashboard

//Middleware
import errorMiddleware from "./middleware/error.js";

// Utils
import { connectDb } from "./utils/feature.js";
import NodeCache from "node-cache";
import { config } from "dotenv";
import morgan from "morgan";

import Stripe from "stripe"; // Stripe

const app = express();

//Env Setting
config({
  path: "./.env",
});

// .env Variable
const MongoDbUrl = process.env.MONGO_URL || "";
const stripeKey = process.env.STRIPE_KEY || "";

//Mongo Connection
connectDb(MongoDbUrl);

const PORT = process.env.PORT || 8000;

//Stripe
export const stripe = new Stripe(stripeKey);

//Caching
export const myCache = new NodeCache();

//Middleware...
app.use(express.json());
app.use(morgan("dev"));

// Routes...
app.use("/api/v1/user", userRoute);
app.use("/api/v1/products", products);
app.use("/api/v1/orders", orders);
app.use("/api/v1/payment", payement);
app.use("/api/v1/dashboard", stats);

//Middleware
app.use("/upload", express.static("upload")); //Fetching img from upload folder
app.use(errorMiddleware); // Error Middleware

app.listen(PORT, () => {
  console.log(`Server is Working on http:localhost:${PORT}`);
});
