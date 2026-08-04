class apiError extends Error {
  constructor(message, statusCode, error = {}) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
  }
}

module.exports = apiError;
