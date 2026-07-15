class appError extends Error {
  status: "error" | "fail";

  isOperation: Boolean;
  constructor(
    public message: string,
    public statusCode: number,
    public errors?: any[]
  ) {
    super(message);

    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.isOperation = true;
    this.errors = errors;
    Error.captureStackTrace(this, appError);
  }
}

export default appError;
