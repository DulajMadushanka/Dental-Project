export default class NetworkError extends Error {
  static NETWORK_ERROR_CODE = '3001';
  static NETWORK_ERROR_MESSAGE = 'Unexpected Network Error';

  constructor(code, message, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NetworkError);
    }

    this.code = code;
    this.message = message;
    this.error = params;
  }
}
