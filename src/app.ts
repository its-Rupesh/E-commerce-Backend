import express from "express";
import errorMiddleware from "./middleware/error.js";
import userRoute from "./routes/user.js";
import products from "./routes/products.js";
import { connectDb } from "./utils/feature.js";
import NodeCache from "node-cache";

const PORT = 8000;
const app = express();

connectDb();
export const myCache = new NodeCache();
//Middleware...
app.use(express.json());

// Routes...
app.use("/api/v1/user", userRoute);
app.use("/api/v1/products", products);

//Middleware
app.use("/upload", express.static("upload")); //Fetching img from upload folder
app.use(errorMiddleware); // Error Middleware

app.listen(PORT, () => {
  console.log(`Server is Working on http:localhost:${PORT}`);
});
