# PM2 Guide

## Install
```bash
sudo npm install -g pm2
pm2 -v
```

## Start Backend
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup systemd
```

## Common Commands
```bash
pm2 status
pm2 logs marketplace-api
pm2 restart marketplace-api
pm2 stop marketplace-api
pm2 delete marketplace-api
pm2 monit
```

## Log Rotation
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 100M
pm2 set pm2-logrotate:retain 7
```
