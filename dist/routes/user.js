import express from "express";
import { allUser, deleteUser, getUser, newUser } from "../controllers/user.js";
import { adminOnly } from "../middleware/auth.js";
const app = express.Router();
app.post("/new", newUser);
app.get("/allUser", adminOnly, allUser);
app.get("/:id", adminOnly, getUser);
app.delete("/:id", adminOnly, deleteUser);
export default app;
