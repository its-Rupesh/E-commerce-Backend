import express from "express";
import { newOrder } from "../controllers/oders.js";
import { debug } from "../middleware/auth.js";
const app = express.Router();
app.post("/newOrder", debug, newOrder);
export default app;
