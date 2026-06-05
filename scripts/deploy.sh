#!/bin/bash
set -e

REMOTE_USER="u116479995"
REMOTE_HOST="uk-fast-web498.hostinger.com"
REMOTE_DIR="/home/u116479995/domains/olivedrab-trout-107376.hostingersite.com/public_html"
REPO_URL="https://github.com/niteshsingh-wq/agentixmarketing-website.git"

echo "==> Deploying to Hostinger via SSH..."

ssh "${REMOTE_USER}@${REMOTE_HOST}" bash -s << 'ENDSSH'
set -e
DEPLOY_DIR="/home/u116479995/domains/olivedrab-trout-107376.hostingersite.com/public_html"
REPO_URL="https://github.com/niteshsingh-wq/agentixmarketing-website.git"

echo "--- Checking repo..."
if [ -d "$DEPLOY_DIR/.git" ]; then
  cd "$DEPLOY_DIR"
  git pull origin main
else
  rm -rf "$DEPLOY_DIR"
  git clone "$REPO_URL" "$DEPLOY_DIR"
  cd "$DEPLOY_DIR"
fi

echo "--- Installing dependencies..."
pnpm install

echo "--- Building..."
pnpm run build

echo "--- Restarting app..."
if pm2 list | grep -q "agentix"; then
  pm2 restart agentix
else
  pm2 start ecosystem.config.js
  pm2 save
fi

echo "==> Deploy complete."
ENDSSH
