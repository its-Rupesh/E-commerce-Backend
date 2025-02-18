import express, { NextFunction, Request, Response } from "express";
import { connectDb } from "./utils/feature.js";
import userRoute from "./routes/user.js";
import errorMiddleware from "./middleware/error.js";

const PORT = 8000;
const app = express();

connectDb();

//Middleware...
app.use(express.json());

// Routes...
app.use("/api/v1/user", userRoute);

// Next Error Funcn Used in API
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is Working on http:localhost:${PORT}`);
});
