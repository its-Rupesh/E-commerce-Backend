import express from "express";
import { newOrder } from "../controllers/oders.js";

const app = express.Router();

app.post("/newOrder");

export default app;
