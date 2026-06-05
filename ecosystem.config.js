module.exports = {
  apps: [{
    name: 'agentix',
    script: 'node_modules/.bin/next',
    args: 'start',
    cwd: '/var/www/agentix',
    env: { NODE_ENV: 'production', PORT: 3000 },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
  }],
}
