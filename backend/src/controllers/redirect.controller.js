const Url = require('../models/Url.model');
const Visit = require('../models/Visit.model');
const parseUserAgent = require('../utils/parseUserAgent');
const env = require('../config/env');

const handleRedirect = async (req, res, next) => {
  try {
    const { shortCode } = req.params;

    // 1. Look up URL by shortCode or customAlias
    const url = await Url.findOne({
      $or: [{ shortCode }, { customAlias: shortCode }],
      isActive: true
    });

    // If URL is not found
    if (!url) {
      return res.redirect(`${env.CLIENT_URL}/404`);
    }

    // 2. Check if URL has expired
    if (url.expiresAt && new Date(url.expiresAt) < new Date()) {
      return res.redirect(`${env.CLIENT_URL}/404?reason=expired`);
    }

    // 3. Record visit analytics asynchronously (non-blocking for redirect speed)
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || '';
    const referer = req.get('Referrer') || req.get('Referer') || 'direct';

    // Parse User Agent
    const uaInfo = parseUserAgent(userAgent);

    // Mock Geo-location (we can mock Country based on IP, using a simple fallback)
    let country = 'US'; // Default mock country
    if (ipAddress === '127.0.0.1' || ipAddress === '::1' || ipAddress.includes('::ffff:127.0.0.1')) {
      country = 'Local Loopback';
    } else {
      // Mock country values to make analytics dashboard look interesting
      const mockCountries = ['US', 'IN', 'GB', 'DE', 'CA', 'FR', 'AU', 'JP', 'BR'];
      const index = Math.abs(ipAddress.split('.').reduce((acc, oct) => acc + parseInt(oct || 0, 10), 0)) % mockCountries.length;
      country = mockCountries[index];
    }

    // Record the visit
    Visit.create({
      urlId: url._id,
      ipAddress,
      userAgent,
      device: uaInfo.device,
      browser: uaInfo.browser,
      referer,
      country
    }).catch(err => console.error('Error writing visit record:', err));

    // Update URL document
    url.totalClicks += 1;
    url.lastVisitedAt = new Date();
    await url.save();

    // 4. Perform redirect
    return res.redirect(302, url.originalUrl);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleRedirect
};
