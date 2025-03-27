import express from "express";

//Routes
import orders from "./routes/order.js";
import payement from "./routes/payment.js";
import products from "./routes/products.js";
import stats from "./routes/stats.js"; //Dashboard
import userRoute from "./routes/user.js";
import razorpayRoute from "./routes/razorpay.js";
//Middleware
import errorMiddleware from "./middleware/error.js";

// Utils
import { config } from "dotenv";
import morgan from "morgan";
import NodeCache from "node-cache";
import { connectDb } from "./utils/feature.js";

// Cors
import cors from "cors";

const app = express();

//Env Setting
config({
  path: "./.env",
});

// .env Variable
const MongoDbUrl = process.env.MONGO_URL || "";
const vercel_url =
  process.env.VERCEL_URL || "https://e-commerce-frontend-wheat.vercel.app/";

//Mongo Connection
connectDb(MongoDbUrl);

const PORT = process.env.PORT || 8000;

//Caching
export const myCache = new NodeCache();

//Middleware...
app.use(express.json());
app.use(morgan("dev"));
app.use(cors({ origin: [vercel_url, "http://localhost:8000"] }));

// Routes...
app.use("/api/v1/user", userRoute);
app.use("/api/v1/products", products);
app.use("/api/v1/orders", orders);
app.use("/api/v1/payment", payement);
app.use("/api/v1/dashboard", stats);
app.use("/api/v1/create-order", razorpayRoute);

//Middleware
app.use(errorMiddleware); // Error Middleware
app.use("/upload", express.static("upload")); //Fetching img from upload folder

app.listen(PORT, () => {
  console.log(`Server is Working on http:localhost:${PORT}`);
});
