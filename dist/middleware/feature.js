const paramsChecker = (req, res, next) => {
    if (!req.params.id) {
        return res.status(400).json({
            success: false,
            message: "Coupon ID is required!",
        });
    }
    next();
};
export { paramsChecker };
