const mongoose = require('mongoose');
const env = require('./src/config/env');
const User = require('./src/models/User.model');
const Url = require('./src/models/Url.model');
const Visit = require('./src/models/Visit.model');
const { hashPassword } = require('./src/utils/hashPassword');

const seedDatabase = async () => {
  try {
    console.log('🔌 Connecting to database for seeding...');
    await mongoose.connect(env.MONGO_URI);
    console.log('🧹 Clearing existing database collections...');
    await User.deleteMany({});
    await Url.deleteMany({});
    await Visit.deleteMany({});

    console.log('👤 Creating demo user...');
    const hashedPassword = await hashPassword('password123');
    const demoUser = await User.create({
      email: 'demo@sniplink.com',
      password: hashedPassword,
      name: 'Demo User'
    });
    console.log(`Demo user created: ${demoUser.email} (Password: password123)`);

    console.log('🔗 Creating sample URLs...');
    
    const urlsToCreate = [
      {
        originalUrl: 'https://github.com/facebook/react',
        shortCode: 'reactjs',
        customAlias: 'reactjs',
        expiresAt: null,
        isActive: true,
        clicksCount: 85
      },
      {
        originalUrl: 'https://news.ycombinator.com',
        shortCode: 'ycomb',
        customAlias: 'ycomb',
        expiresAt: null,
        isActive: true,
        clicksCount: 145
      },
      {
        originalUrl: 'https://tailwindcss.com/docs/installation',
        shortCode: 'twd-doc',
        customAlias: null,
        expiresAt: null,
        isActive: true,
        clicksCount: 42
      },
      {
        originalUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
        shortCode: 'mdn-js',
        customAlias: 'mdn-js',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expiries in 30 days
        isActive: true,
        clicksCount: 60
      },
      {
        originalUrl: 'https://www.youtube.com',
        shortCode: 'yt-home',
        customAlias: null,
        expiresAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Expired 2 days ago
        isActive: true,
        clicksCount: 15
      }
    ];

    const createdUrls = [];
    for (const urlData of urlsToCreate) {
      const url = await Url.create({
        userId: demoUser._id,
        originalUrl: urlData.originalUrl,
        shortCode: urlData.shortCode,
        customAlias: urlData.customAlias || undefined,
        totalClicks: urlData.clicksCount,
        expiresAt: urlData.expiresAt,
        isActive: urlData.isActive,
        lastVisitedAt: new Date()
      });
      createdUrls.push({ url, clicksCount: urlData.clicksCount });
    }
    console.log(`Created ${createdUrls.length} sample URLs.`);

    console.log('📈 Seeding analytics visits...');

    const referers = ['https://google.com', 'https://twitter.com', 'https://github.com', 'https://dev.to', 'direct'];
    const countries = ['US', 'IN', 'GB', 'DE', 'CA', 'FR', 'AU', 'JP', 'BR'];
    const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge'];
    const devices = ['desktop', 'mobile', 'tablet'];

    for (const { url, clicksCount } of createdUrls) {
      const visits = [];
      
      // Seed visit records distributed across the last 30 days
      for (let i = 0; i < clicksCount; i++) {
        const date = new Date();
        const daysAgo = Math.floor(Math.random() * 30);
        const hoursAgo = Math.floor(Math.random() * 24);
        const minutesAgo = Math.floor(Math.random() * 60);
        date.setDate(date.getDate() - daysAgo);
        date.setHours(date.getHours() - hoursAgo);
        date.setMinutes(date.getMinutes() - minutesAgo);

        const device = devices[Math.floor(Math.random() * devices.length)];
        const browser = browsers[Math.floor(Math.random() * browsers.length)];
        const country = countries[Math.floor(Math.random() * countries.length)];
        const referer = referers[Math.floor(Math.random() * referers.length)];
        
        const ipParts = [
          Math.floor(Math.random() * 223) + 1,
          Math.floor(Math.random() * 255),
          Math.floor(Math.random() * 255),
          Math.floor(Math.random() * 255)
        ];
        const ipAddress = ipParts.join('.');

        visits.push({
          urlId: url._id,
          visitedAt: date,
          ipAddress,
          userAgent: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36`,
          device,
          browser,
          country,
          referer
        });
      }

      await Visit.insertMany(visits);
      console.log(`Seeded ${visits.length} visit records for short URL code: ${url.shortCode}`);
    }

    console.log('🚀 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
