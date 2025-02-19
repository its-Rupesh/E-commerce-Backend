import express from "express";
import { allUser, deleteUser, getUser, newUser } from "../controllers/user.js";

const app = express.Router();

app.post("/new", newUser);
app.get("/allUser", allUser);
app.get("/:id", getUser);
app.delete("/:id", deleteUser);
export default app;
