import express from "express";
import { getMyOrder, newOrder, allOrder } from "../controllers/oders.js";
import { adminOnly, debug } from "../middleware/auth.js";

const app = express.Router();

app.post("/newOrder", newOrder);
app.get("/myOrder", getMyOrder);
app.get("/allOrder", adminOnly, allOrder);

export default app;
