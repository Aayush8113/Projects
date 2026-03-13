const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  // Mongoose Bad ObjectId (e.g. searching for a book with id "123")
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid ID: ${err.value}`;
    error = { message, statusCode: 404 };
  }

  // Mongoose Duplicate Key (e.g. registering with same email)
  if (err.code === 11000) {
    const message = 'Duplicate field value entered. Please use a unique value.';
    error = { message, statusCode: 400 };
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { errorHandler };