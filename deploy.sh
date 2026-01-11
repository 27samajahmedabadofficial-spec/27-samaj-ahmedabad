#!/bin/bash

# Samaj Ahmedabad - Deployment Script
# This script automates the deployment process

set -e

echo "========================================="
echo "Samaj Ahmedabad - Deployment Script"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}Please run as root (use sudo)${NC}"
  exit 1
fi

# Ask for configuration
read -p "Enter your domain name (e.g., yourdomain.com): " DOMAIN
read -p "Enter server IP or localhost (127.0.0.1): " SERVER_IP
read -p "Enter database username: " DB_USER
read -sp "Enter database password: " DB_PASSWORD
echo
read -p "Enter database name (default: 27_samaj_app): " DB_NAME
DB_NAME=${DB_NAME:-27_samaj_app}
read -p "Enter deployment directory (default: /var/www/html): " DEPLOY_DIR
DEPLOY_DIR=${DEPLOY_DIR:-/var/www/html}

echo -e "${YELLOW}Starting deployment...${NC}"

# Step 1: Create deployment directory
echo -e "${YELLOW}[1/8] Creating deployment directory...${NC}"
mkdir -p "$DEPLOY_DIR/samaj-ahmedabad"
cd "$DEPLOY_DIR/samaj-ahmedabad"

# Step 2: Clone repository (if not already cloned)
if [ ! -d ".git" ]; then
  echo -e "${YELLOW}[2/8] Cloning repository...${NC}"
  git clone https://github.com/yourusername/27-samaj-ahmedabad.git .
else
  echo -e "${YELLOW}[2/8] Updating repository...${NC}"
  git pull origin main
fi

# Step 3: Install dependencies
echo -e "${YELLOW}[3/8] Installing dependencies...${NC}"
npm install
cd backend
npm install
cd ..

# Step 4: Create environment files
echo -e "${YELLOW}[4/8] Creating environment files...${NC}"

# Frontend .env.production
cat > .env.production << EOF
VITE_API_URL=https://$DOMAIN/api
VITE_APP_NAME=Samaj Ahmedabad
VITE_APP_VERSION=1.0.0
EOF

# Backend .env
cat > backend/.env << EOF
DB_HOST=localhost
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
DB_NAME=$DB_NAME
DB_PORT=3306
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://$DOMAIN
EOF

echo -e "${GREEN}Environment files created${NC}"

# Step 5: Build frontend
echo -e "${YELLOW}[5/8] Building frontend...${NC}"
npm run build

# Step 6: Setup PM2 for backend
echo -e "${YELLOW}[6/8] Setting up PM2...${NC}"
npm install -g pm2
cd backend
pm2 start src/index.js --name "samaj-backend" --env production
pm2 save
pm2 startup systemd -u www-data --hp /var/www
cd ..

echo -e "${GREEN}Backend service started${NC}"

# Step 7: Setup Nginx configuration
echo -e "${YELLOW}[7/8] Configuring Nginx...${NC}"

cat > /etc/nginx/sites-available/samaj << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;

    client_max_body_size 50M;

    location / {
        root $DEPLOY_DIR/samaj-ahmedabad/dist;
        try_files \$uri \$uri/ /index.html;

        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /uploads/ {
        alias $DEPLOY_DIR/samaj-ahmedabad/public/uploads/;
        expires 30d;
    }
}
EOF

ln -sf /etc/nginx/sites-available/samaj /etc/nginx/sites-enabled/samaj
nginx -t
systemctl restart nginx

echo -e "${GREEN}Nginx configured${NC}"

# Step 8: Create database
echo -e "${YELLOW}[8/8] Setting up database...${NC}"

mysql -u root -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
mysql -u root -e "CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';"
mysql -u root -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';"
mysql -u root -e "FLUSH PRIVILEGES;"

echo -e "${GREEN}Database created${NC}"

# Set permissions
chown -R www-data:www-data "$DEPLOY_DIR/samaj-ahmedabad"
chmod -R 755 "$DEPLOY_DIR/samaj-ahmedabad"
chmod -R 775 "$DEPLOY_DIR/samaj-ahmedabad/public/uploads"

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "Next steps:"
echo "1. Obtain SSL certificate: sudo certbot certonly --nginx -d $DOMAIN"
echo "2. Update your DNS to point to this server IP: $SERVER_IP"
echo "3. Test your application: https://$DOMAIN"
echo "4. Share with users: https://$DOMAIN"
echo ""
echo "Important URLs:"
echo "- Web App: https://$DOMAIN"
echo "- API: https://$DOMAIN/api"
echo "- PM2 Status: pm2 status"
echo "- View Logs: pm2 logs samaj-backend"
echo ""
