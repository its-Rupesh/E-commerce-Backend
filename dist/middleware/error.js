import { ErrorHandler } from "./error_object.js";
const errorMiddleware = (err, req, res, next) => {
    const statusCode = err instanceof ErrorHandler ? err.statusCode : 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        message,
    });
};
export default errorMiddleware;
