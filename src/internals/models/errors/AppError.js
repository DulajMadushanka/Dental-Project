export default class AppError extends Error {
  constructor(code, message, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }

    this.code = code;
    this.message = message;
    this.error = params;
  }
}
