// PM2 Ecosystem file for production deployment
module.exports = {
  apps: [{
    name: 'faisal-center-backend',
    script: './backend/server.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'development',
      PORT: 7000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 7000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};

