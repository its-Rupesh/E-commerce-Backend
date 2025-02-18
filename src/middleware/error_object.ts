export class CustomError extends Error {
  statusCode: number; // explitly declare Type of statusCode
  constructor(message: string = "Something Went Wrong", statusCode?: number) {
    super(message); // call Constructor in Error
    this.statusCode = statusCode ?? 500; // Declare statusCode Field in Error
    Object.setPrototypeOf(this, CustomError.prototype); // Use for Properly Inherit Error Class Property
  }
}
