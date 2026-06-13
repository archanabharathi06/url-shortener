const { z } = require('zod');
const analyticsService = require('../services/analytics.service');
const { successResponse } = require('../utils/apiResponse');

// Validation schemas
const urlIdParamSchema = z.object({
  params: z.object({
    urlId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid URL ID format')
  })
});

const shortCodeParamSchema = z.object({
  params: z.object({
    shortCode: z.string().min(1, 'Short code is required')
  })
});

const getUrlAnalytics = async (req, res, next) => {
  try {
    const { urlId } = req.params;
    const data = await analyticsService.getUrlSummary(req.user.id, urlId);
    return successResponse(res, data, 'Analytics summary fetched successfully');
  } catch (error) {
    next(error);
  }
};

const getUrlVisits = async (req, res, next) => {
  try {
    const { urlId } = req.params;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const result = await analyticsService.getPaginatedVisits(req.user.id, urlId, page, limit);
    return successResponse(res, result.visits, 'Visits fetched successfully', result.pagination);
  } catch (error) {
    next(error);
  }
};

const getUrlChart = async (req, res, next) => {
  try {
    const { urlId } = req.params;
    const data = await analyticsService.getDailyClickChart(req.user.id, urlId);
    return successResponse(res, data, 'Chart data fetched successfully');
  } catch (error) {
    next(error);
  }
};

const getPublicStats = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const data = await analyticsService.getPublicSanitizedStats(shortCode);
    return successResponse(res, data, 'Public stats fetched successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  urlIdParamSchema,
  shortCodeParamSchema,
  getUrlAnalytics,
  getUrlVisits,
  getUrlChart,
  getPublicStats
};
