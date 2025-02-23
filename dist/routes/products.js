import express from "express";
import { deleteProduct, getAdminProducts, getAllCategories, getlatestProduct, getSingleProducts, newproduct, searchProduct, updateSingleProduct, } from "../controllers/products.js";
import { adminOnly } from "../middleware/auth.js";
import { singleUpload } from "../middleware/multer.js";
const app = express.Router();
app.post("/new", adminOnly, singleUpload, newproduct);
app.get("/search", searchProduct);
app.get("/latest", getlatestProduct);
app.get("/categorys", getAllCategories);
app.get("/admin-products", getAdminProducts);
app
    .route("/:id")
    .get(getSingleProducts)
    .put(adminOnly, singleUpload, updateSingleProduct)
    .delete(deleteProduct);
export default app;
