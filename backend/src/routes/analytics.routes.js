const express = require('express');
const analyticsController = require('../controllers/analytics.controller');
const validate = require('../middleware/validate.middleware');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Private protected routes
router.get('/:urlId', protect, validate(analyticsController.urlIdParamSchema), analyticsController.getUrlAnalytics);
router.get('/:urlId/visits', protect, validate(analyticsController.urlIdParamSchema), analyticsController.getUrlVisits);
router.get('/:urlId/chart', protect, validate(analyticsController.urlIdParamSchema), analyticsController.getUrlChart);

// Public route (unprotected)
router.get('/public/:shortCode/stats', validate(analyticsController.shortCodeParamSchema), analyticsController.getPublicStats);

module.exports = router;
