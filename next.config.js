// next.config.js — SWC полностью отключён, стабильный вариант для cPanel

const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'config.json');

if (!fs.existsSync(configPath)) {
  throw new Error('Configuration could not be found at location: ' + configPath);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

module.exports = {
  reactStrictMode: true,

  serverRuntimeConfig: config.serverRuntimeConfig || {},
  publicRuntimeConfig: config.publicRuntimeConfig || {},

  // Критично: отключаем SWC на всех уровнях
  swcMinify: false,

  // Запрещаем любые эксперименты и WASM
  experimental: {},

  // Отключаем source maps (экономит память)
  productionBrowserSourceMaps: false,

  // Увеличиваем лимит на большие страницы
  largePageDataBytes: 1024 * 1024, // 1 MB

  // Redirects (твои)
  async redirects() {
    return [
      {
        source: '/catalog.aspx',
        destination: '/catalog',
        permanent: true,
      },
      {
        source: '/groups/:id/:name',
        destination: '/My/Groups.aspx?gid=:id',
        permanent: false,
      },
    ];
  },

  webpack: (config, { isServer }) => {
    if (!isServer && process.env.NODE_ENV === 'production') {
      config.devtool = false;
    }

    // Убираем любые попытки использовать WASM
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: false,
      topLevelAwait: false,
    };

    return config;
  },
};