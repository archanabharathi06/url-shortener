const successResponse = (res, data = null, message = null, meta = null, statusCode = 200) => {
  const payload = {
    success: true
  };

  if (data !== null) payload.data = data;
  if (message !== null) payload.message = message;
  if (meta !== null) payload.meta = meta;

  return res.status(statusCode).json(payload);
};

const errorResponse = (res, message = 'Something went wrong', statusCode = 500, errors = null) => {
  const payload = {
    success: false,
    message
  };

  if (errors !== null) payload.errors = errors;

  return res.status(statusCode).json(payload);
};

module.exports = {
  successResponse,
  errorResponse
};
