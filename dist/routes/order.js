import express from "express";
import { getMyOrder, newOrder, allOrder, getSingleOrder, processOrder, deleteOrder, } from "../controllers/oders.js";
import { adminOnly } from "../middleware/auth.js";
const app = express.Router();
app.post("/newOrder", newOrder);
app.get("/myOrder", getMyOrder);
app.get("/allOrder", adminOnly, allOrder);
app
    .route("/:id")
    .get(getSingleOrder)
    .put(adminOnly, processOrder)
    .delete(adminOnly, deleteOrder);
export default app;
