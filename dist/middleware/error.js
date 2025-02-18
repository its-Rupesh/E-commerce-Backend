import { CustomError } from "./error_object.js";
const errorMiddleware = (err, req, res, next) => {
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }
    return res.status(500).json({
        success: false,
        message: err.message,
    });
};
export default errorMiddleware;
