import { User } from "../models/user.js";
import { CustomError } from "../middleware/error_object.js";
export const newUser = async (req, res, next) => {
    try {
        // next(new CustomError("Custom error", 404));
        // next(new CustomError("Error"));
        next(new CustomError());
        const { name, email, photo, _id, gender, dob } = req.body;
        const user = await User.create({
            name,
            email,
            photo,
            _id,
            gender,
            dob: new Date(dob),
        });
        return res.status(200).json({
            success: true,
            message: user,
        });
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: error,
        });
    }
};
