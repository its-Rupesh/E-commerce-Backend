import express from "express";
import {
  getAdminProducts,
  getAllCategories,
  getlatestProduct,
  getSingleProducts,
  newproduct,
} from "../controllers/products.js";
import { adminOnly } from "../middleware/auth.js";
import { singleUpload } from "../middleware/multer.js";

const app = express.Router();

app.post("/new", adminOnly, singleUpload, newproduct);
app.get("/latest", getlatestProduct);
app.get("/categorys", getAllCategories);
app.get("/admin-products", getAdminProducts);

app.route("/:id").get(getSingleProducts);

export default app;
