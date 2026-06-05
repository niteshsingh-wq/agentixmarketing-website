module.exports = {
  apps: [{
    name: 'agentix',
    script: 'server.js',
    cwd: '/home/u116479995/domains/olivedrab-trout-107376.hostingersite.com/public_html',
    env: { NODE_ENV: 'production', PORT: 3000 },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
  }],
}
