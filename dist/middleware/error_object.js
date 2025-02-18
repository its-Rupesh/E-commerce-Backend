export class CustomError extends Error {
    constructor(message = "Something Went Wrong", statusCode) {
        super(message); // call Constructor in Error
        this.statusCode = statusCode ?? 500; // Declare statusCode Field in Error
        Object.setPrototypeOf(this, CustomError.prototype); // Use for Properly Inherit Error Class Property
    }
}
