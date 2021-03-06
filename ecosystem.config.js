module.exports = {
  apps : [
    {
      name: 'nfa',
      script: 'server/start.js',
      env: { COMMON_VARIABLE: 'true' },
      watch: ["server"],
      instances: 1
    },
    {
      name: 'webpack',
      script: 'webpackServer.js',
      env: { COMMON_VARIABLE: 'true' },
      watch: ['webpack.config.js', 'webpackServer.js'],
      autorestart: false,
      instances: 1
    }
  ],
};
