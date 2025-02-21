module.exports = {
  apps: [
    {
      name: 'dao4build-presale-api',
      script: 'node dist/src/main.js',
    },
    {
      name: 'dao4build-presale-crawler',
      script: 'node dist/src/crawler.js',
    },
    {
      name: 'dao4build-presale-consumer',
      script: 'node dist/src/consumer.js',
    },
  ],
};
