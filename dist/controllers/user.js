import { User } from "../models/user.js";
import { ErrorHandler } from "../middleware/error_object.js";
//Request<Params, ResBody, ReqBody, ReqQuery>
const newUser = async (req, res, next) => {
    try {
        const { name, email, photo, _id, gender, dob } = req.body;
        if (!_id || !name || !email || !photo || !gender || !dob)
            return next(new ErrorHandler("Add All Feilds", 400));
        let user = await User.findById(_id);
        if (user)
            return res.status(200).json({
                success: true,
                message: `Welcome ${user.name}`,
            });
        user = await User.create({
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
        next(new ErrorHandler(error, 404));
    }
};
const allUser = async (req, res, next) => {
    const user = await User.find({});
    return res.status(200).json({
        success: true,
        user,
    });
};
const getUser = async (req, res, next) => {
    const Userid = req.params.id;
    const user = await User.findById(Userid);
    if (!user)
        return next(new ErrorHandler("Invalid User Id", 400));
    return res.status(200).json({
        success: true,
        user,
    });
};
const deleteUser = async (req, res, next) => {
    const Userid = req.params.id;
    const user = await User.findByIdAndDelete(Userid);
    if (!user)
        return next(new ErrorHandler("User-Id Not Present", 400));
    return res.status(200).json({
        success: true,
        message: "User is Deleted Sucessfully",
    });
};
export { newUser, allUser, getUser, deleteUser };
