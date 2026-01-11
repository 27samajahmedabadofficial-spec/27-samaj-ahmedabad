# Quick Deployment & PWA Setup Guide

## 🚀 Quick Start

### Prerequisites
- Ubuntu/Linux server with Node.js 18+
- Domain name (e.g., yourdomain.com)
- SSH access to server
- MySQL installed

---

## Option 1: Automated Deployment (Recommended)

### Step 1: Upload Script to Server
```bash
# On your local machine
scp deploy.sh root@your-server-ip:/root/

# SSH into server
ssh root@your-server-ip
chmod +x deploy.sh
```

### Step 2: Run Deployment Script
```bash
./deploy.sh
```

The script will ask you for:
- Domain name
- Server IP
- Database credentials
- Deployment directory

**That's it!** The script handles everything.

---

## Option 2: Manual Deployment

### Step 1: SSH into Server
```bash
ssh root@your-server-ip
```

### Step 2: Clone Repository
```bash
cd /var/www/html
git clone https://github.com/yourusername/27-samaj-ahmedabad.git
cd 27-samaj-ahmedabad
```

### Step 3: Install Dependencies
```bash
npm install
cd backend && npm install && cd ..
```

### Step 4: Create Environment Files

**Frontend** (.env.production):
```
VITE_API_URL=https://yourdomain.com/api
VITE_APP_NAME=Samaj Ahmedabad
```

**Backend** (backend/.env):
```
DB_HOST=localhost
DB_USER=samaj_user
DB_PASSWORD=your_secure_password
DB_NAME=27_samaj_app
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

### Step 5: Build Frontend
```bash
npm run build
```

### Step 6: Start Backend Service
```bash
npm install -g pm2
cd backend
pm2 start src/index.js --name "samaj-backend"
pm2 save
cd ..
```

### Step 7: Setup Database
```bash
mysql -u root -p
```

```sql
CREATE DATABASE 27_samaj_app;
CREATE USER 'samaj_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON 27_samaj_app.* TO 'samaj_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 8: Setup Nginx
```bash
# Create Nginx config (copy from DEPLOYMENT_AND_PWA_GUIDE.md)
sudo nano /etc/nginx/sites-available/samaj

# Enable site
sudo ln -s /etc/nginx/sites-available/samaj /etc/nginx/sites-enabled/

# Test and restart
sudo nginx -t
sudo systemctl restart nginx
```

### Step 9: Get SSL Certificate
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 📱 PWA Installation

The app is now set up as a Progressive Web App. Users can install it on mobile!

### For Android Users
1. Open Chrome
2. Visit: `https://yourdomain.com`
3. Tap menu (⋯) → "Install app"
4. Or tap home icon in address bar → "Install"
5. App installed! 🎉

### For iOS Users
1. Open Safari
2. Visit: `https://yourdomain.com`
3. Tap Share icon
4. Select "Add to Home Screen"
5. Name the app and tap "Add"
6. App installed! 🎉

### For Desktop Users
1. Visit: `https://yourdomain.com`
2. Click install button (appears in address bar)
3. Confirm installation
4. Desktop app ready! 🎉

---

## 🔗 Share Installation Link

Send this link to users:
```
https://yourdomain.com
```

Or create a QR code pointing to it for easy sharing.

---

## 📋 Testing Checklist

After deployment, verify:

- [ ] Website loads: `https://yourdomain.com`
- [ ] Login works with credentials
- [ ] API responds: `curl https://yourdomain.com/api/auth/me`
- [ ] Service Worker registered (DevTools → Application → Service Workers)
- [ ] Manifest loads (DevTools → Application → Manifest)
- [ ] App installs on mobile
- [ ] Offline mode works (disconnect internet and test)
- [ ] Images load correctly
- [ ] Forms submit successfully

---

## 🔧 Common Commands

### Monitor Backend
```bash
pm2 status                    # Check service status
pm2 logs samaj-backend       # View logs
pm2 restart samaj-backend    # Restart service
pm2 stop samaj-backend       # Stop service
```

### Monitor Nginx
```bash
sudo systemctl status nginx
sudo nginx -t                # Test config
sudo systemctl restart nginx # Restart
```

### View Logs
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
pm2 logs
```

---

## 🆘 Troubleshooting

### Issue: API Connection Failed
**Fix:**
```bash
# Check backend is running
pm2 status

# Check CORS_ORIGIN in backend/.env
# Should be: https://yourdomain.com

# Restart backend
pm2 restart samaj-backend
```

### Issue: Service Worker Not Registering
**Fix:**
- Verify manifest.json exists in public/
- Verify sw.js exists in public/
- Check browser console for errors
- Hard refresh (Ctrl+Shift+R)

### Issue: App Won't Install
**Fix:**
- Verify HTTPS is working
- Verify manifest.json is valid
- Test at https://www.pwabuilder.com/
- Check browser supports PWA

### Issue: Database Connection Error
**Fix:**
```bash
# Check MySQL is running
sudo systemctl status mysql

# Verify credentials in backend/.env
# Test connection:
mysql -u samaj_user -p -h localhost 27_samaj_app
```

### Issue: Static Files Return 404
**Fix:**
```bash
# Check file permissions
ls -la /var/www/html/27-samaj-ahmedabad/

# Set correct permissions
chmod -R 755 /var/www/html/27-samaj-ahmedabad/
chown -R www-data:www-data /var/www/html/27-samaj-ahmedabad/
```

---

## 📊 Post-Deployment Setup

### 1. Enable Auto-Renewal of SSL
```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### 2. Setup Database Backups
```bash
# Create backup script
cat > /usr/local/bin/backup-db.sh << 'EOF'
#!/bin/bash
mysqldump -u samaj_user -p[password] 27_samaj_app > /backups/samaj_$(date +%Y%m%d_%H%M%S).sql
EOF

chmod +x /usr/local/bin/backup-db.sh

# Add to crontab for daily backup at 2 AM
crontab -e
# Add line: 0 2 * * * /usr/local/bin/backup-db.sh
```

### 3. Monitor Server
```bash
# Install Nginx Prometheus exporter or Uptime Robot
# Setup monitoring to alert on downtime
```

### 4. Enable Gzip Compression
Add to Nginx config:
```nginx
gzip on;
gzip_types text/plain text/css text/xml text/javascript 
           application/x-javascript application/xml+rss 
           application/json;
gzip_min_length 1000;
```

---

## 📈 User Instructions

Share this with your users:

### Installation Instructions

#### Android
1. Open Chrome browser
2. Go to: **https://yourdomain.com**
3. Tap the ⋯ menu (three dots)
4. Select **"Install app"**
5. Confirm installation
6. App will appear on your home screen

#### iPhone/iPad
1. Open Safari browser
2. Go to: **https://yourdomain.com**
3. Tap the Share icon (rectangle with arrow)
4. Scroll down and tap **"Add to Home Screen"**
5. Name the app and tap **"Add"**
6. App will appear on your home screen

#### Desktop (Windows/Mac)
1. Open Chrome browser
2. Go to: **https://yourdomain.com**
3. Click the install icon (appears in address bar)
4. Confirm installation
5. App will open in a window

---

## 🎉 Success!

Your app is now deployed and users can:
- ✅ Access via web: `https://yourdomain.com`
- ✅ Install as mobile app (PWA)
- ✅ Work offline with cached data
- ✅ Receive push notifications (future)
- ✅ Use native app experience

---

## 📞 Support

For deployment issues:
1. Check logs: `pm2 logs samaj-backend`
2. Check Nginx errors: `sudo tail -f /var/log/nginx/error.log`
3. Test API: `curl https://yourdomain.com/api/auth/me`
4. Verify DNS: `nslookup yourdomain.com`

---

## 📝 Important Files

- `DEPLOYMENT_AND_PWA_GUIDE.md` - Detailed deployment guide
- `.env.production` - Frontend configuration
- `backend/.env` - Backend configuration
- `public/manifest.json` - PWA manifest
- `public/sw.js` - Service worker

---

**You're ready to deploy! 🚀**

Questions? Check the full deployment guide: `DEPLOYMENT_AND_PWA_GUIDE.md`
