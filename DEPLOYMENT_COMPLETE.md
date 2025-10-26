# 🚀 PromoHive Deployment Guide - Ubuntu 24.04 LTS

This guide provides step-by-step instructions to deploy PromoHive on Ubuntu 24.04 LTS VPS.

## 📋 Prerequisites

- Ubuntu 24.04 LTS VPS (root access via SSH)
- Domain: **globalpromonetwork.store** ✅
- Basic knowledge of Linux commands

## 🔧 Server Setup

### Step 1: Initial Server Setup

Connect to your server:
```bash
ssh root@YOUR_SERVER_IP
```

Run the server setup script:
```bash
bash setup-server.sh
```

This will install:
- Node.js 20.x
- PM2 (Process Manager)
- PostgreSQL
- Nginx
- Git
- Essential system tools

### Step 2: Configure PostgreSQL

Create database and user:
```bash
sudo -u postgres psql

# In PostgreSQL shell:
CREATE DATABASE promohive;
CREATE USER promohive_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE promohive TO promohive_user;
ALTER USER promohive_user CREATEDB;
\q
```

### Step 3: Clone and Configure Repository

```bash
cd /var/www
git clone https://github.com/nyttynt96-art/2.git promohive
cd promohive
```

### Step 4: Configure Environment Variables

```bash
cp env.example .env
nano .env
```

Update the following variables:
```env
# Database
DATABASE_URL="postgresql://promohive_user:your_secure_password@localhost:5432/promohive?schema=public"

# Server
PORT=3002
NODE_ENV=production

# JWT Secret
JWT_SECRET="your_secure_random_secret_key"

# CORS
CORS_ORIGIN="https://globalpromonetwork.store"

# Email (Configure with your SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your_email@gmail.com"
SMTP_PASS="your_email_password"
SMTP_FROM="PromoHive <noreply@your-domain.com>"
```

### Step 5: Run Database Migrations

```bash
npm install
npx prisma generate
npx prisma migrate deploy
```

### Step 6: Build Application

```bash
npm run build
```

### Step 7: Start with PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 8: Configure Nginx

Create Nginx configuration:
```bash
sudo nano /etc/nginx/sites-available/promohive
```

Add the following (for HTTPS with SSL):
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name globalpromonetwork.store www.globalpromonetwork.store;

    # Redirect HTTP to HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name globalpromonetwork.store www.globalpromonetwork.store;

    # SSL certificates (will be added by Certbot)
    ssl_certificate /etc/letsencrypt/live/globalpromonetwork.store/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/globalpromonetwork.store/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    client_max_body_size 10M;

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/promohive /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 9: Setup SSL (Optional but Recommended)

Install Certbot:
```bash
sudo apt-get install certbot python3-certbot-nginx -y
```

Obtain SSL certificate:
```bash
sudo certbot --nginx -d globalpromonetwork.store -d www.globalpromonetwork.store
```

## 🔄 Updating the Application

When you push new code to GitHub:

```bash
cd /var/www/promohive
git pull origin main
npm install
npx prisma generate
npm run build
pm2 restart ecosystem.config.js
```

Or use the automated deployment script:
```bash
bash deploy.sh
```

## 📊 Monitoring

Check application status:
```bash
pm2 status
pm2 logs promohive-server
pm2 monit
```

Check Nginx:
```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

Check PostgreSQL:
```bash
sudo systemctl status postgresql
```

## 🛠️ Useful Commands

### PM2 Commands
```bash
pm2 restart all          # Restart all applications
pm2 stop all            # Stop all applications
pm2 logs                # View logs
pm2 monit               # Monitor resources
pm2 delete all          # Delete all applications
```

### Database Commands
```bash
npm run prisma:studio   # Open Prisma Studio
npm run prisma:seed     # Seed database
```

### Nginx Commands
```bash
sudo systemctl reload nginx     # Reload config
sudo systemctl restart nginx    # Restart Nginx
sudo nginx -t                   # Test config
```

## 🔒 Security Checklist

1. **Firewall Configuration**
   ```bash
   sudo ufw status
   sudo ufw allow 'Nginx Full'
   ```

2. **Keep Software Updated**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

3. **Regular Backups**
   - Set up automated database backups
   - Keep backup copies of `.env` file

## 📞 Troubleshooting

### Application Not Starting
```bash
pm2 logs promohive-server
pm2 restart promohive-server
```

### Database Connection Issues
```bash
sudo systemctl status postgresql
sudo -u postgres psql -c "\l"
```

### Port Already in Use
```bash
sudo lsof -i :3002
sudo kill -9 <PID>
```

### Nginx 502 Error
- Check if application is running: `pm2 status`
- Check application logs: `pm2 logs`
- Verify proxy configuration in Nginx

## 🌐 Access Your Application

- **Main**: https://globalpromonetwork.store
- **WWW**: https://www.globalpromonetwork.store
- **Dashboard**: https://globalpromonetwork.store/dashboard
- **Admin Panel**: https://globalpromonetwork.store/admin

## 📝 Notes

- Default admin credentials are set in database seed
- Change JWT_SECRET to a secure random string
- Configure email SMTP settings for notifications
- Set up automated backups for production
- Monitor logs regularly for any issues

## ✅ Deployment Complete!

Your PromoHive application is now deployed and running on Ubuntu 24.04 LTS!

