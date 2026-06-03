# PM2_GUIDE.md

# PM2 Guide / Panduan PM2

PM2 is a production process manager for Node.js applications. PM2 keeps the backend running, restarts on crashes, stores process lists, and provides logs/monitoring.

## Install PM2
```bash
sudo npm install -g pm2
pm2 -v
```

## Start application
From repository root:
```bash
pm2 start ecosystem.config.js --env production
```

## ecosystem.config.js Explanation

| Option | Purpose |
|---|---|
| name | Process name shown by PM2 |
| cwd | Working directory, `./backend` |
| script | Entry file, `server.js` |
| instances | Number of processes; use 1 by default |
| exec_mode | `fork` by default; `cluster` can scale Node workers |
| autorestart | Restart if app crashes |
| watch | Disabled in production to avoid restart loops |
| max_memory_restart | Restart if memory exceeds threshold |
| env | Development environment variables |
| env_production | Production environment variables |
| error_file/out_file | Log destinations |
| merge_logs | Combine logs across instances |
| time | Add timestamps |

## Common PM2 Commands

```bash
pm2 status
pm2 logs marketplace-api
pm2 restart marketplace-api
pm2 reload marketplace-api
pm2 stop marketplace-api
pm2 delete marketplace-api
pm2 monit
pm2 save
pm2 startup systemd
```

## Startup on boot
```bash
pm2 startup systemd
pm2 save
```

Copy and run the command printed by PM2.

## Log rotation
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 100M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

## Indonesian Quick Notes

- Gunakan `pm2 status` untuk melihat status aplikasi.
- Gunakan `pm2 logs` untuk melihat error backend.
- Jalankan `pm2 save` setelah start agar proses hidup lagi setelah reboot.
