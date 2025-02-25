import express from "express";

//Routes
import userRoute from "./routes/user.js";
import products from "./routes/products.js";
import orders from "./routes/order.js";

//Middleware
import errorMiddleware from "./middleware/error.js";

// Utils
import { connectDb } from "./utils/feature.js";
import NodeCache from "node-cache";
import { config } from "dotenv";
import morgan from "morgan";
const app = express();

//Env Setting
config({
  path: "./.env",
});

//Mongo Connection
const MongoDbUrl = process.env.MONGO_URL || "";
connectDb(MongoDbUrl);

const PORT = process.env.PORT || 8000;

export const myCache = new NodeCache();

//Middleware...
app.use(express.json());
app.use(morgan("dev"));

// Routes...
app.use("/api/v1/user", userRoute);
app.use("/api/v1/products", products);
app.use("/api/v1/orders", orders);
//Middleware
app.use("/upload", express.static("upload")); //Fetching img from upload folder
app.use(errorMiddleware); // Error Middleware

app.listen(PORT, () => {
  console.log(`Server is Working on http:localhost:${PORT}`);
});
