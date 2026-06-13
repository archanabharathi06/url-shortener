const Url = require('../models/Url.model');
const Visit = require('../models/Visit.model');

const verifyUrlOwner = async (userId, urlId) => {
  const url = await Url.findOne({ _id: urlId, userId, isActive: true });
  if (!url) {
    throw { statusCode: 404, message: 'URL not found or not owned by you' };
  }
  return url;
};

const getUrlSummary = async (userId, urlId) => {
  const url = await verifyUrlOwner(userId, urlId);
  
  // Get recent 10 visits
  const recentVisits = await Visit.find({ urlId })
    .sort({ visitedAt: -1 })
    .limit(10)
    .select('-userAgent');

  // Device breakdown
  const deviceStats = await Visit.aggregate([
    { $match: { urlId: url._id } },
    { $group: { _id: '$device', count: { $sum: 1 } } }
  ]);

  const devices = { mobile: 0, tablet: 0, desktop: 0 };
  deviceStats.forEach(stat => {
    if (stat._id in devices) {
      devices[stat._id] = stat.count;
    }
  });

  // Browser breakdown
  const browserStats = await Visit.aggregate([
    { $match: { urlId: url._id } },
    { $group: { _id: '$browser', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);

  const browsers = browserStats.map(stat => ({
    name: stat._id,
    count: stat.count
  }));

  return {
    urlInfo: {
      id: url._id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      customAlias: url.customAlias,
      totalClicks: url.totalClicks,
      lastVisitedAt: url.lastVisitedAt,
      createdAt: url.createdAt,
      expiresAt: url.expiresAt
    },
    recentVisits,
    deviceBreakdown: devices,
    browserBreakdown: browsers
  };
};

const getDailyClickChart = async (userId, urlId) => {
  const url = await verifyUrlOwner(userId, urlId);
  return generateDailyChartData(url._id);
};

// Shared helper to aggregate chart data for a URL
const generateDailyChartData = async (urlId) => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const visits = await Visit.aggregate([
    {
      $match: {
        urlId: urlId,
        visitedAt: { $gte: thirtyDaysAgo }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$visitedAt' }
        },
        clicks: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Transform to look consistent with 30 days of data (filling gaps with 0 clicks)
  const chartMap = new Map(visits.map(v => [v._id, v.clicks]));
  const chartData = [];

  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    chartData.push({
      date: dateStr,
      clicks: chartMap.get(dateStr) || 0
    });
  }

  return chartData;
};

const getPaginatedVisits = async (userId, urlId, page = 1, limit = 10) => {
  await verifyUrlOwner(userId, urlId);

  const skip = (page - 1) * limit;
  const total = await Visit.countDocuments({ urlId });
  const visits = await Visit.find({ urlId })
    .sort({ visitedAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('-userAgent');

  return {
    visits,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
};

const getPublicSanitizedStats = async (shortCode) => {
  const url = await Url.findOne({
    $or: [{ shortCode }, { customAlias: shortCode }],
    isActive: true
  });

  if (!url) {
    throw { statusCode: 404, message: 'URL not found or inactive' };
  }

  // Get chart data
  const chartData = await generateDailyChartData(url._id);

  // Get Device breakdown
  const deviceStats = await Visit.aggregate([
    { $match: { urlId: url._id } },
    { $group: { _id: '$device', count: { $sum: 1 } } }
  ]);

  const devices = { mobile: 0, tablet: 0, desktop: 0 };
  deviceStats.forEach(stat => {
    if (stat._id in devices) {
      devices[stat._id] = stat.count;
    }
  });

  // Get Browser breakdown
  const browserStats = await Visit.aggregate([
    { $match: { urlId: url._id } },
    { $group: { _id: '$browser', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);

  const browsers = browserStats.map(stat => ({
    name: stat._id,
    count: stat.count
  }));

  // Sanitized visits: no IP, no detailed user-agent info
  const recentVisits = await Visit.find({ urlId: url._id })
    .sort({ visitedAt: -1 })
    .limit(10)
    .select('visitedAt device browser country referer');

  return {
    urlInfo: {
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      customAlias: url.customAlias,
      totalClicks: url.totalClicks,
      lastVisitedAt: url.lastVisitedAt,
      createdAt: url.createdAt
    },
    chartData,
    deviceBreakdown: devices,
    browserBreakdown: browsers,
    recentVisits
  };
};

module.exports = {
  getUrlSummary,
  getDailyClickChart,
  getPaginatedVisits,
  getPublicSanitizedStats
};
