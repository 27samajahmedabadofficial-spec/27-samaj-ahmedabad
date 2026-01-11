# Complete Deployment & Mobile App Installation Guide

## Table of Contents
1. [Server Deployment](#server-deployment)
2. [PWA Setup (Mobile Installation)](#pwa-setup)
3. [Environment Configuration](#environment-configuration)
4. [Testing & Verification](#testing--verification)

---

## Server Deployment

### Step 1: Prepare Your Server

**Requirements:**
- Ubuntu/Linux Server (or Windows with IIS)
- Node.js 18+ installed
- MySQL 8.0+
- Git installed
- Domain name (optional but recommended)

### Step 2: Clone Repository on Server

```bash
# SSH into your server
ssh root@your-server-ip

# Navigate to web root
cd /home/username/public_html  # or /var/www/html for Linux

# Clone your repository
git clone https://github.com/yourusername/27-samaj-ahmedabad.git
cd 27-samaj-ahmedabad
```

### Step 3: Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### Step 4: Configure Environment Variables

#### Backend (.env)
Create `backend/.env`:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=27_samaj_app
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=production

# CORS
CORS_ORIGIN=https://yourdomain.com
```

#### Frontend (.env.production)
Create `.env.production`:
```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_APP_NAME=Samaj Ahmedabad
VITE_APP_VERSION=1.0.0
```

### Step 5: Build Frontend

```bash
# Build production version
npm run build

# This creates a 'dist' folder with optimized files
```

### Step 6: Setup Backend Service

**Option A: Using PM2 (Recommended)**

```bash
# Install PM2 globally
npm install -g pm2

# Start backend
pm2 start backend/src/index.js --name "samaj-backend"

# Save PM2 configuration
pm2 save

# Enable PM2 auto-start on reboot
pm2 startup
```

**Option B: Using systemd**

Create `/etc/systemd/system/samaj-backend.service`:
```ini
[Unit]
Description=Samaj Backend Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/home/username/public_html/27-samaj-ahmedabad/backend
ExecStart=/usr/bin/node src/index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable samaj-backend
sudo systemctl start samaj-backend
```

### Step 7: Setup Nginx Reverse Proxy

Create `/etc/nginx/sites-available/samaj`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Certificates (use Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;

    # Frontend (React app)
    location / {
        root /home/username/public_html/27-samaj-ahmedabad/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # File uploads
    location /uploads/ {
        alias /home/username/public_html/27-samaj-ahmedabad/public/uploads/;
        expires 30d;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/samaj /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 8: Setup SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Step 9: Setup Database on Server

```bash
# Login to MySQL
mysql -u root -p

# Create database and user
CREATE DATABASE 27_samaj_app;
CREATE USER 'samaj_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON 27_samaj_app.* TO 'samaj_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import database schema
mysql -u samaj_user -p 27_samaj_app < database/schema.sql
```

---

## PWA Setup (Mobile Installation)

### Step 1: Create Manifest File

Create `public/manifest.json`:
```json
{
  "name": "Samaj Ahmedabad - Community App",
  "short_name": "Samaj",
  "description": "A community platform connecting Ahmedabad residents",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "#ffffff",
  "theme_color": "#f97316",
  "screenshots": [
    {
      "src": "/screenshots/screenshot1.png",
      "sizes": "540x720",
      "form_factor": "narrow"
    },
    {
      "src": "/screenshots/screenshot2.png",
      "sizes": "1280x720",
      "form_factor": "wide"
    }
  ],
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-maskable-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/icons/icon-maskable-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "categories": ["social", "productivity"],
  "screenshots": [
    {
      "src": "/screenshots/mobile-1.png",
      "sizes": "540x720",
      "form_factor": "narrow",
      "type": "image/png"
    },
    {
      "src": "/screenshots/mobile-2.png",
      "sizes": "540x720",
      "form_factor": "narrow",
      "type": "image/png"
    }
  ]
}
```

### Step 2: Create Service Worker

Create `public/sw.js`:
```javascript
const CACHE_NAME = 'samaj-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  // Skip API requests
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request).then((response) => {
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});
```

### Step 3: Update index.html

Add to `index.html` in the `<head>` section:
```html
<head>
  <!-- Meta tags for PWA -->
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="A community platform connecting Ahmedabad residents" />
  <meta name="theme-color" content="#f97316" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="Samaj" />
  
  <!-- Icons -->
  <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32.png" />
  <link rel="apple-touch-icon" href="/icons/icon-192.png" />
  
  <!-- Manifest -->
  <link rel="manifest" href="/manifest.json" />
  
  <title>Samaj Ahmedabad</title>
</head>
```

Add before closing `</body>` tag:
```html
<script>
  // Register Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then((registration) => {
      console.log('Service Worker registered:', registration);
    }).catch((error) => {
      console.log('Service Worker registration failed:', error);
    });
  }
</script>
```

### Step 4: Create App Icons

You need these icon files in `public/icons/`:
- `icon-32.png` (32x32)
- `icon-192.png` (192x192)
- `icon-512.png` (512x512)
- `icon-maskable-192.png` (192x192 - for adaptive icons)
- `icon-maskable-512.png` (512x512 - for adaptive icons)

**Generate icons using:**
- https://realfavicongenerator.net/
- https://www.favicon-generator.org/
- https://pwa-asset-generator.netlify.app/

### Step 5: Create Screenshots (Optional but recommended)

Place screenshots in `public/screenshots/`:
- `mobile-1.png` (540x720)
- `mobile-2.png` (540x720)

---

## Environment Configuration

### Frontend Vite Config

Update `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
})
```

### Backend Configuration

Update `backend/src/index.js`:
```javascript
import express from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// CORS Configuration for production
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

// Static files
app.use('/uploads', express.static('public/uploads'));

// Routes
import authRoutes from './routes/authRoutes.js';
import familyRoutes from './routes/familyRoutes.js';
import directoryRoutes from './routes/directoryRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/directory', directoryRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## Testing & Verification

### Pre-Deployment Checklist

- [ ] Build passes without errors: `npm run build`
- [ ] Backend starts: `npm start` (in backend folder)
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] SSL certificate obtained
- [ ] API URLs updated for production
- [ ] Service worker created
- [ ] Manifest.json created
- [ ] Icons generated (192x192, 512x512)

### Post-Deployment Testing

#### Test on Desktop Browser

```bash
# Build and test locally
npm run build

# Serve dist folder
npx http-server dist

# Open in browser: http://localhost:8080
# Check DevTools > Application > Manifest
# Check DevTools > Application > Service Workers
```

#### Test PWA Installation

**Chrome/Edge Desktop:**
1. Open DevTools (F12)
2. Go to Application tab
3. Check Service Worker is registered
4. Check Manifest loads correctly
5. Click install button (top right address bar)

**Android (Real Device):**
1. Open Chrome mobile
2. Visit your domain
3. Tap menu (⋯) → Install app
4. Or tap home icon in address bar

**iOS (Real Device):**
1. Open Safari
2. Visit your domain
3. Tap Share icon
4. Select "Add to Home Screen"
5. Name and add

#### Verify API Calls

```bash
# Test login
curl -X POST https://yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"mobileNo":"7359519628","password":"your_password"}'

# Test get user
curl -X GET https://yourdomain.com/api/auth/me \
  -H "Authorization: Bearer your_token"
```

---

## Installation Links for Users

### Share Installation Links

**For Android Users:**
```
https://yourdomain.com
```
(They can install directly from Chrome)

**For iOS Users:**
```
https://yourdomain.com
```
(Use Share → Add to Home Screen)

**For Desktop Users:**
```
https://yourdomain.com
```
(Click install button in address bar)

### QR Code for Easy Sharing

Generate QR code pointing to: `https://yourdomain.com`

Tools:
- https://qr-code-generator.com/
- https://www.qr-code-generator.com/

---

## Monitoring & Maintenance

### Monitor Backend

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs samaj-backend

# Restart service
pm2 restart samaj-backend
```

### Monitor Nginx

```bash
# Test configuration
sudo nginx -t

# View error logs
sudo tail -f /var/log/nginx/error.log
```

### Database Backups

```bash
# Daily backup
mysqldump -u samaj_user -p 27_samaj_app > backup_$(date +%Y%m%d).sql

# Schedule with cron (edit crontab)
crontab -e

# Add line:
0 2 * * * mysqldump -u samaj_user -p27_samaj_app 27_samaj_app > /backups/samaj_$(date +\%Y\%m\%d).sql
```

---

## Troubleshooting

### Issue: API Connection Failed
**Solution:** Check CORS_ORIGIN in `.env` matches your domain

### Issue: Service Worker Not Registering
**Solution:** Verify manifest.json and sw.js are in public folder

### Issue: App Won't Install
**Solution:** Check manifest.json is valid with https://www.pwabuilder.com/

### Issue: Static Files 404
**Solution:** Check Nginx location paths and file permissions

### Issue: Database Connection Error
**Solution:** Verify DB credentials in `.env` and MySQL is running

---

## Quick Deployment Commands

```bash
# 1. Clone and setup
git clone <repo> && cd 27-samaj-ahmedabad
npm install && cd backend && npm install && cd ..

# 2. Create env files
nano .env.production
nano backend/.env

# 3. Build
npm run build

# 4. Start backend
cd backend && pm2 start src/index.js --name "samaj-backend"

# 5. Setup Nginx (already configured above)

# 6. Test
curl https://yourdomain.com
curl https://yourdomain.com/api/auth/me
```

---

## Final Steps

1. **Domain Setup:** Point your domain to server IP in DNS settings
2. **SSL Certificate:** Use Let's Encrypt (automated above)
3. **Test Everything:** Use the testing checklist
4. **Share with Users:** Send them `https://yourdomain.com`
5. **Monitor:** Check logs regularly

**You're now ready to deploy!** 🚀

