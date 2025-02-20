import express from "express";
import { newproduct } from "../controllers/products.js";
import { adminOnly } from "../middleware/auth.js";
import { singleUpload } from "../middleware/multer.js";

const app = express.Router();

app.post("/new", singleUpload, newproduct);

export default app;
