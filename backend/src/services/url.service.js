const Url = require('../models/Url.model');
const generateShortCode = require('../utils/generateShortCode');
const env = require('../config/env');

const createShortUrl = async (userId, originalUrl, customAlias, expiresAt) => {
  // Validate custom alias if provided
  if (customAlias) {
    // Check if alias is already used as a custom alias
    const existingAlias = await Url.findOne({ customAlias });
    if (existingAlias) {
      throw { statusCode: 400, message: 'Custom alias is already taken' };
    }

    // Check if alias collisions with any auto-generated short code
    const existingCode = await Url.findOne({ shortCode: customAlias });
    if (existingCode) {
      throw { statusCode: 400, message: 'Custom alias matches an existing short code' };
    }
  }

  // Validate expiresAt if provided
  if (expiresAt) {
    const expiryDate = new Date(expiresAt);
    if (isNaN(expiryDate.getTime()) || expiryDate <= new Date()) {
      throw { statusCode: 400, message: 'Expiration date must be in the future' };
    }
  }

  // Generate unique short code if customAlias not provided
  let shortCode = customAlias || '';
  if (!shortCode) {
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      const candidateCode = generateShortCode(7);
      
      // Ensure code is not already in use as a short code or custom alias
      const duplicate = await Url.findOne({
        $or: [{ shortCode: candidateCode }, { customAlias: candidateCode }]
      });

      if (!duplicate) {
        shortCode = candidateCode;
        break;
      }
      attempts++;
    }

    if (!shortCode) {
      throw { statusCode: 500, message: 'Failed to generate a unique short code. Please try again.' };
    }
  }

  const newUrl = await Url.create({
    userId,
    originalUrl,
    shortCode,
    customAlias: customAlias || undefined,
    expiresAt: expiresAt ? new Date(expiresAt) : null
  });

  return newUrl;
};

const listUserUrls = async (userId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  // We show only active URLs (soft deleted URLs are excluded from user dashboard)
  const query = { userId, isActive: true };

  const total = await Url.countDocuments(query);
  const urls = await Url.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return {
    urls,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
};

const updateUrl = async (userId, urlId, originalUrl, customAlias) => {
  const url = await Url.findOne({ _id: urlId, userId, isActive: true });
  if (!url) {
    throw { statusCode: 404, message: 'URL not found or inactive' };
  }

  // If custom alias is updated
  if (customAlias && customAlias !== url.customAlias) {
    const existingAlias = await Url.findOne({ customAlias });
    if (existingAlias) {
      throw { statusCode: 400, message: 'Custom alias is already taken' };
    }
    const existingCode = await Url.findOne({ shortCode: customAlias });
    if (existingCode) {
      throw { statusCode: 400, message: 'Custom alias matches an existing short code' };
    }
    url.customAlias = customAlias;
  }

  if (originalUrl) {
    url.originalUrl = originalUrl;
  }

  await url.save();
  return url;
};

const softDeleteUrl = async (userId, urlId) => {
  const url = await Url.findOne({ _id: urlId, userId, isActive: true });
  if (!url) {
    throw { statusCode: 404, message: 'URL not found or already deleted' };
  }

  url.isActive = false;
  await url.save();
  return { id: urlId, message: 'URL deleted successfully' };
};

const getQrCodeString = async (userId, urlId) => {
  const url = await Url.findOne({ _id: urlId, userId, isActive: true });
  if (!url) {
    throw { statusCode: 404, message: 'URL not found' };
  }

  // Construct short URL string
  const shortUrl = `${env.BASE_URL}/${url.shortCode}`;
  return { shortUrl };
};

module.exports = {
  createShortUrl,
  listUserUrls,
  updateUrl,
  softDeleteUrl,
  getQrCodeString
};
