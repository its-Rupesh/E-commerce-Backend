export class ErrorHandler extends Error {
  statusCode: number;

  constructor(error: string | Error, statusCode?: number) {
    super(typeof error === "string" ? error : error.message);
    this.statusCode = statusCode ?? 500;

    if (error instanceof Error) {
      this.stack = error.stack; // Retains Original Stack
      this.name = error.name;
    }
    Object.setPrototypeOf(this, ErrorHandler.prototype);
  }
}
