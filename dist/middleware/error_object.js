export class ErrorHandler extends Error {
    constructor(error, statusCode) {
        super(typeof error === "string" ? error : error.message);
        this.statusCode = statusCode ?? 500;
        if (error instanceof Error) {
            this.stack = error.stack; // Retains Original Stack
        }
        Object.setPrototypeOf(this, ErrorHandler.prototype);
    }
}
