import express from "express";
import { getMyOrder, newOrder, allOrder, getSingleOrder, processOrder, deleteOrder, } from "../controllers/oders.js";
const app = express.Router();
app.post("/newOrder", newOrder);
app.get("/myOrder", getMyOrder);
app.get("/allOrder", allOrder);
app.route("/:id").get(getSingleOrder).put(processOrder).delete(deleteOrder);
export default app;
