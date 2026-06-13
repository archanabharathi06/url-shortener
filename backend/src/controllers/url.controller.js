const { z } = require('zod');
const urlService = require('../services/url.service');
const { successResponse } = require('../utils/apiResponse');

// Validation schemas
const createUrlSchema = z.object({
  body: z.object({
    originalUrl: z.string().url('Please enter a valid URL (including http:// or https://)'),
    customAlias: z
      .string()
      .min(3, 'Custom alias must be at least 3 characters')
      .max(30, 'Custom alias cannot exceed 30 characters')
      .regex(/^[a-zA-Z0-9-_]+$/, 'Custom alias can only contain letters, numbers, hyphens, and underscores')
      .optional()
      .nullable()
      .or(z.literal('')),
    expiresAt: z
      .string()
      .datetime({ message: 'Invalid expiration date-time format' })
      .optional()
      .nullable()
      .or(z.literal(''))
  })
});

const updateUrlSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format')
  }),
  body: z.object({
    originalUrl: z.string().url('Please enter a valid URL (including http:// or https://)').optional(),
    customAlias: z
      .string()
      .min(3, 'Custom alias must be at least 3 characters')
      .max(30, 'Custom alias cannot exceed 30 characters')
      .regex(/^[a-zA-Z0-9-_]+$/, 'Custom alias can only contain letters, numbers, hyphens, and underscores')
      .optional()
      .nullable()
      .or(z.literal(''))
  })
});

const deleteUrlSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ID format')
  })
});

const getUrls = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const result = await urlService.listUserUrls(req.user.id, page, limit);
    return successResponse(res, result.urls, 'URLs fetched successfully', result.pagination);
  } catch (error) {
    next(error);
  }
};

const createUrl = async (req, res, next) => {
  try {
    const { originalUrl, customAlias, expiresAt } = req.body;
    // Normalize customAlias and expiresAt empty strings to null
    const alias = customAlias || null;
    const expiry = expiresAt || null;

    const data = await urlService.createShortUrl(req.user.id, originalUrl, alias, expiry);
    return successResponse(res, data, 'URL shortened successfully', null, 201);
  } catch (error) {
    next(error);
  }
};

const updateUrlById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { originalUrl, customAlias } = req.body;
    const alias = customAlias || null;

    const data = await urlService.updateUrl(req.user.id, id, originalUrl, alias);
    return successResponse(res, data, 'URL updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteUrlById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await urlService.softDeleteUrl(req.user.id, id);
    return successResponse(res, data, 'URL deleted successfully');
  } catch (error) {
    next(error);
  }
};

const getQrCode = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await urlService.getQrCodeString(req.user.id, id);
    return successResponse(res, data, 'QR code string generated successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUrlSchema,
  updateUrlSchema,
  deleteUrlSchema,
  getUrls,
  createUrl,
  updateUrlById,
  deleteUrlById,
  getQrCode
};
