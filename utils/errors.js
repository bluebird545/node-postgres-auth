class ApiError extends Error {
  constructor(statusCode = 500, message = 'Server Error') {
    super(message);

    this.statusCode = statusCode;
    this.message = message;
  }
}

module.exports = ApiError;