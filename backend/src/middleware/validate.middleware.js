const { errorResponse } = require('../utils/apiResponse');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    next();
  } catch (error) {
    const formattedErrors = error.errors.map((err) => ({
      field: err.path.slice(1).join('.'),
      message: err.message
    }));
    return errorResponse(res, 'Validation failed', 400, formattedErrors);
  }
};

module.exports = validate;
