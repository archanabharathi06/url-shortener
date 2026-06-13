const UAParser = require('ua-parser-js');

const parseUserAgent = (userAgentString) => {
  const parser = new UAParser(userAgentString);
  const result = parser.getResult();

  // Determine device category
  let device = 'desktop';
  if (result.device.type === 'mobile') {
    device = 'mobile';
  } else if (result.device.type === 'tablet') {
    device = 'tablet';
  }

  // Determine browser name
  const browser = result.browser.name || 'unknown';

  return {
    device,
    browser,
    os: result.os.name || 'unknown'
  };
};

module.exports = parseUserAgent;
