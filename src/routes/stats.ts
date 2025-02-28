import express from "express";
import {
  getBarStats,
  getDashboardStats,
  getLineStats,
  getPieStats,
} from "../controllers/stats.js";
import { adminOnly } from "../middleware/auth.js";

const app = express.Router();

// Dashboard Stats
app.get("/stats", adminOnly, getDashboardStats);
app.get("/pie", adminOnly, getPieStats);
app.get("/bar", adminOnly, getBarStats);
app.get("/line", adminOnly, getLineStats);

export default app;
