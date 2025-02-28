import { ErrorHandler } from "./error_object.js";
const errorMiddleware = (err, req, res, next) => {
    let statusCode = err instanceof ErrorHandler ? err.statusCode : 500;
    let message = err.message || "Internal Server Error";
    if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid ID format";
    }
    return res.status(statusCode).json({
        success: false,
        message,
    });
};
export default errorMiddleware;
