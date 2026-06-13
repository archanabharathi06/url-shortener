const rateLimit = require('express-rate-limit');
const { errorResponse } = require('../utils/apiResponse');

const urlCreationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    return errorResponse(
      res,
      'Too many URLs created from this IP, please try again after a minute.',
      429
    );
  }
});

module.exports = {
  urlCreationLimiter
};
