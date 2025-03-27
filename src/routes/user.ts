import express from "express";
import { allUser, deleteUser, getUser, newUser } from "../controllers/user.js";
import { adminOnly } from "../middleware/auth.js";

const app = express.Router();

app.post("/new", newUser);

//http://localhost:8000/api/v1/user/allUser?id=15
app.get("/allUser", adminOnly, allUser);

app.get("/:id", getUser);

app.delete("/:id", adminOnly, deleteUser);
export default app;
