module.exports = {
  apps: [
    {
      name: 'bad-bank',
      script: 'server/app.js', // Change this to the path of your server entry point file
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};