import { User } from "../models/user.js";
import { ErrorHandler } from "./error_object.js";
const adminOnly = async (req, res, next) => {
    try {
        const { id } = req.query;
        if (!id)
            return next(new ErrorHandler("Please Login First..!!", 401));
        const user = await User.findById(id);
        if (!user)
            return next(new ErrorHandler("No Such User Present", 401));
        if (user.role !== "admin")
            return next(new ErrorHandler("You are Not allowed to Access this Route", 401));
        next();
    }
    catch (error) {
        next(new ErrorHandler(error));
    }
};
export { adminOnly };
