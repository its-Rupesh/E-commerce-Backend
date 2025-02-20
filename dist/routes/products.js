import express from "express";
import { getlatestProduct, newproduct } from "../controllers/products.js";
import { adminOnly } from "../middleware/auth.js";
import { singleUpload } from "../middleware/multer.js";
const app = express.Router();
app.post("/new", adminOnly, singleUpload, newproduct);
app.get("/latest", getlatestProduct);
export default app;
