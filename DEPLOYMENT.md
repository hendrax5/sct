# 🚀 DEPLOYMENT GUIDE: Ecommerce UMKM Platform

Panduan lengkap untuk setup, deployment, dan maintenance menggunakan Docker.

---

## TABLE OF CONTENTS
1. [Local Development](#local-development)
2. [Docker Setup](#docker-setup)
3. [Production Deployment](#production-deployment)
4. [Database Migrations](#database-migrations)
5. [Backup & Restore](#backup--restore)
6. [Monitoring](#monitoring)
7. [Troubleshooting](#troubleshooting)
8. [Scaling](#scaling)

---

## LOCAL DEVELOPMENT

### Prerequisites
```bash
# Check versions (minimum)
node --version          # v20.0.0+
npm --version           # v10.0.0+
docker --version        # 24.0.0+
docker compose --version # v2.20.0+
```

### First Time Setup
```bash
# 1. Clone repository
git clone https://github.com/org/ecommerce-umkm.git
cd ecommerce-umkm

# 2. Setup environment
cp .env.example .env

# 3. Edit .env (optional for local dev, defaults work for Docker)
# ONLY change if you need different ports/credentials

# 4. Start services
docker compose up -d

# 5. Wait for database to be ready
docker compose logs -f db
# Look for: "database system is ready to accept connections"

# 6. Run migrations
docker compose exec app npm run migrate

# 7. Seed database (optional)
docker compose exec app npm run seed

# 8. Check services are running
docker compose ps
# All should show "Up"

# 9. Verify app is working
curl http://localhost:3000/api/health
# Response: {"status":"ok"}
```

### Daily Development Workflow
```bash
# Start services
docker compose up -d

# View logs (all services)
docker compose logs -f

# View specific service logs
docker compose logs -f app    # Next.js app
docker compose logs -f db     # PostgreSQL
docker compose logs -f redis  # Redis cache

# Run local dev server (faster, with hot reload)
npm run dev
# Open http://localhost:3000

# Stop services
docker compose down

# Stop and remove volumes (⚠️ deletes data!)
docker compose down -v
```

### Database Management
```bash
# Access database shell
docker compose exec db psql -U appuser -d ecommerce

# Common SQL commands
SELECT COUNT(*) FROM products;
SELECT * FROM users WHERE email = 'test@example.com';
\dt                 # list all tables
\q                  # exit

# Backup current database
docker compose exec -T db pg_dump -U appuser -d ecommerce > backup_$(date +%Y-%m-%d_%H%M).sql

# Restore from backup
cat backup_2026-03-20_1030.sql | docker compose exec -T db psql -U appuser -d ecommerce

# Reset database (⚠️ deletes all data!)
docker compose exec db dropdb -U appuser ecommerce
docker compose exec db createdb -U appuser ecommerce
npm run migrate
```

### Redis Cache Management
```bash
# Access Redis CLI
docker compose exec redis redis-cli -a redispass

# Common commands
PING                # test connection
KEYS *              # list all keys
FLUSHALL            # clear all cache (⚠️)
INFO                # server info
SAVE                # force save to disk
\q                  # exit
```

---

## DOCKER SETUP

### Docker Compose Services
```yaml
app          → Next.js application (port 3000)
db           → PostgreSQL database (port 5432)
redis        → Redis cache (port 6379)
monitoring   → Grafana dashboard (port 3001)
adminer      → Database UI (port 8080)
```

### Build & Run
```bash
# Build Docker image (if Dockerfile changed)
docker compose build

# Start all services
docker compose up -d

# Start specific service
docker compose up -d app

# Stop all services
docker compose down

# Stop specific service
docker compose stop app

# Restart service
docker compose restart app
```

### View Logs
```bash
# All services
docker compose logs

# Last 100 lines
docker compose logs --tail 100

# Follow in real-time
docker compose logs -f

# Specific service
docker compose logs -f app
docker compose logs -f db --tail 50

# With timestamps
docker compose logs -f --timestamps
```

### Execute Commands
```bash
# Run command in app container
docker compose exec app npm test

# Run migration
docker compose exec app npm run migrate

# Run seed
docker compose exec app npm run seed

# Access app shell
docker compose exec app /bin/sh

# Without TTY (non-interactive)
docker compose exec -T app npm run build
```

### Check Service Health
```bash
# List all services with status
docker compose ps

# Check specific service health
docker compose ps app

# Test database connection
docker compose exec app npm run db:test

# Test all services
./scripts/health-check.sh
```

---

## PRODUCTION DEPLOYMENT

### Option 1: Vercel (Recommended for MVP)

#### Setup
```bash
# 1. Push code to GitHub
git push origin main

# 2. Connect Vercel to GitHub
# Visit: https://vercel.com/import
# Select repository

# 3. Configure environment variables in Vercel dashboard
# Set all values from .env.example

# 4. Database setup
# Use Neon PostgreSQL (free tier: 3GB storage)
# https://neon.tech → Create project
# Copy connection string to VERCEL

# 5. Auto-deploy
# Push to main → Vercel auto-deploys
```

#### Production .env (Vercel)
```
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/ecommerce
REDIS_URL=redis://...  (use managed Redis, e.g., Upstash)
JWT_SECRET=generate-random-string-from-terminal
NEXTAUTH_SECRET=generate-random-string-from-terminal
XENDIT_API_KEY=live-key-from-xendit
SENDGRID_API_KEY=production-key
```

#### Verify Deployment
```bash
curl https://ecommerce.example.com/api/health
# Response: {"status":"ok"}
```

---

### Option 2: Docker Self-Hosted (VPS)

#### Prerequisites
- VPS (DigitalOcean, Linode, AWS, Hetzner, etc.)
- Ubuntu 22.04+ or Debian 12+
- Minimum: 2GB RAM, 2 CPU cores, 20GB storage

#### Initial VPS Setup
```bash
# 1. SSH into VPS
ssh root@your-vps-ip

# 2. Update system
apt update && apt upgrade -y

# 3. Install Docker & Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
docker compose version

# 4. Create app directory
mkdir -p /opt/ecommerce
cd /opt/ecommerce

# 5. Setup user (non-root)
useradd -m -s /bin/bash appuser
usermod -aG docker appuser
```

#### Deploy Application
```bash
# 1. Clone repository
cd /opt/ecommerce
git clone https://github.com/org/ecommerce-umkm.git .

# 2. Setup environment
cp .env.example .env
nano .env  # Edit with production values

# 3. Start services
docker compose up -d

# 4. Run migrations
docker compose exec app npm run migrate

# 5. Check status
docker compose ps

# 6. View logs
docker compose logs -f app
```

#### HTTPS Setup (Let's Encrypt)
```bash
# 1. Install certbot
apt install certbot python3-certbot-nginx -y

# 2. Get certificate
certbot certonly --standalone -d ecommerce.example.com

# 3. Setup Nginx reverse proxy
# (see docker-compose-nginx.yml)

# 4. Auto-renewal
certbot renew --dry-run
# Runs automatically daily via cron
```

#### Nginx Configuration (Optional)
```bash
# Create docker-compose-nginx.yml with Nginx service
# Nginx reverse proxy → Docker internal network
# Handle HTTPS/TLS termination
```

---

## DATABASE MIGRATIONS

### Create New Migration
```bash
# 1. Modify schema.prisma
nano prisma/schema.prisma

# 2. Create migration
npx prisma migrate dev --name add_wishlist_table
# Generates: prisma/migrations/xxx_add_wishlist_table

# 3. Review generated SQL
cat prisma/migrations/xxx_add_wishlist_table/migration.sql

# 4. Prisma client auto-updated
# Commit migration files to git
```

### Apply Migration to Production
```bash
# Automated (recommended)
# Push code → CI/CD → runs: npm run migrate

# Manual (if needed)
docker compose exec app npm run migrate
```

### Rollback Migration
```bash
# 1. Check migration history
npx prisma migrate status

# 2. Reset database (⚠️ deletes data!)
npx prisma migrate reset

# 3. Manual rollback (if migration has no down() script)
# Option A: Use database backup
# Option B: Write manual SQL to undo changes
```

### Database Seeding (Test Data)
```bash
# Create seed script
cat > prisma/seed.ts << 'EOF'
import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

async function main() {
  // Create categories
  await db.category.createMany({
    data: [
      { name: 'Electronics', slug: 'electronics' },
      { name: 'Clothing', slug: 'clothing' },
    ]
  })
}

main()
  .catch(e => console.error(e))
  .finally(() => db.$disconnect())
EOF

# Run seed
npm run seed

# Seed on Docker
docker compose exec app npm run seed
```

---

## BACKUP & RESTORE

### Automated Daily Backups
```bash
# Create backup script
cat > scripts/backup.sh << 'EOF'
#!/bin/bash
set -e
DATE=$(date +%Y-%m-%d_%H%M%S)
BACKUP_DIR="/opt/ecommerce/backups"

mkdir -p $BACKUP_DIR

# Backup PostgreSQL
docker compose exec -T db pg_dump -U appuser -d ecommerce | \
  gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Backup Redis
docker compose exec -T redis redis-cli -a redispass BGSAVE > /dev/null
docker compose cp redis:/data/dump.rdb $BACKUP_DIR/redis_$DATE.rdb

# Keep only last 7 days
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +7 -delete
find $BACKUP_DIR -name "redis_*.rdb" -mtime +7 -delete

echo "✓ Backup completed: $DATE"
EOF

chmod +x scripts/backup.sh

# Schedule daily backup (cron)
# Edit: crontab -e
0 2 * * * /opt/ecommerce/scripts/backup.sh >> /var/log/backup.log 2>&1
```

### Manual Backup
```bash
# Database
docker compose exec -T db pg_dump -U appuser -d ecommerce > backup_db_$(date +%Y-%m-%d).sql

# Compress
gzip backup_db_$(date +%Y-%m-%d).sql

# Upload to cloud storage (S3, Google Drive, etc)
aws s3 cp backup_db_*.sql.gz s3://my-bucket/backups/
```

### Restore from Backup
```bash
# List backups
ls -lh backups/

# Restore database
gunzip -c backup_db_2026-03-20.sql.gz | \
  docker compose exec -T db psql -U appuser -d ecommerce

# Verify
docker compose exec db psql -U appuser -d ecommerce -c "SELECT COUNT(*) FROM products;"
```

---

## MONITORING

### View Logs
```bash
# All services
docker compose logs -f

# App only
docker compose logs -f app

# Show last errors
docker compose logs app | grep ERROR
```

### Grafana Dashboard
```
URL: http://localhost:3001
Username: admin
Password: admin123

Dashboards:
- Application Metrics (req/s, response time, errors)
- Database (query time, connections, cache hits)
- System (CPU, memory, disk)
```

### Health Checks
```bash
# App health
curl http://localhost:3000/api/health

# Database
docker compose exec db pg_isready -U appuser

# Redis
docker compose exec redis redis-cli -a redispass PING

# Combined check
./scripts/health-check.sh
```

### Performance Monitoring
```bash
# CPU & Memory usage
docker stats

# Disk usage
du -sh /opt/ecommerce

# Network traffic
docker compose top app

# Database connections
docker compose exec db psql -U appuser -d ecommerce -c \
  "SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;"
```

### Error Tracking (Sentry)
```
URL: https://sentry.io
Dashboard shows errors from production
Alerts on critical errors
```

---

## TROUBLESHOOTING

### Service Won't Start
```bash
# Check logs
docker compose logs app

# Common issues:
# 1. Database not ready
docker compose logs db | grep "ready"

# 2. Port already in use
lsof -i :3000
kill -9 <PID>

# 3. Out of disk space
df -h

# 4. Out of memory
free -h
docker stats
```

### Database Connection Error
```bash
# Verify database is running
docker compose ps db

# Check connection string in .env
cat .env | grep DATABASE_URL

# Test connection manually
docker compose exec db psql -U appuser -d ecommerce -c "SELECT 1"

# Check network connectivity
docker compose exec app ping db
```

### High CPU/Memory Usage
```bash
# Find culprit service
docker stats

# Check app logs for errors
docker compose logs -f app

# Check database for slow queries
docker compose exec db psql -U appuser -d ecommerce -c \
  "SELECT query, calls, total_time FROM pg_stat_statements ORDER BY total_time DESC LIMIT 5;"

# Restart service
docker compose restart app
```

### Disk Space Issues
```bash
# Check disk usage
df -h
du -sh /opt/ecommerce/*

# Clean Docker
docker system prune -a

# Remove old backups
rm backups/db_*.sql.gz  # keep only recent

# Reduce log retention
docker logs --tail 1000 container_name
```

### Redis Memory Issues
```bash
# Check Redis memory
docker compose exec redis redis-cli -a redispass INFO memory

# Clear cache
docker compose exec redis redis-cli -a redispass FLUSHALL

# Set max memory policy
# Edit docker-compose.yml:
# command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru
```

---

## SCALING

### Horizontal Scaling (Multiple Instances)
```bash
# Scale app to 3 instances
docker compose up -d --scale app=3

# Use load balancer (nginx, HAProxy)
# Distribute traffic across instances
```

### Database Optimization
```sql
-- Add missing indexes
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM products WHERE category_id = $1;

-- Vacuum (maintenance)
VACUUM ANALYZE products;
```

### Redis Caching
```bash
# Enable Redis in docker-compose.yml
# Use in app: lib/cache.ts

# Monitor cache performance
docker compose exec redis redis-cli -a redispass INFO stats

# Clear cache strategy
# Invalidate on: product update, order create
```

### CDN for Static Assets
```bash
# Cloudflare setup:
# 1. Add domain to Cloudflare
# 2. Set nameservers
# 3. Enable caching rules

# Vercel deployment includes built-in CDN
```

---

## ROLLBACK STRATEGY

### Blue-Green Deployment
```bash
# Old version running (blue)
docker compose up -d app  # v1.0.0

# Deploy new version (green) on different port
docker run -p 3001:3000 --name app-v2 image:v1.0.1

# Test new version
curl http://localhost:3001/api/health

# Switch traffic (update nginx/load balancer)
# If issues: switch back to blue
```

### Quick Rollback
```bash
# If new version has critical bug:
git revert HEAD
git push origin main

# Docker pulls previous image
docker pull image:v1.0.0
docker compose up -d  # rolls back to v1.0.0
```

---

## CHECKLIST: BEFORE GOING LIVE

- [ ] All tests passing locally
- [ ] Database migrations tested
- [ ] Environment variables configured
- [ ] HTTPS certificate setup & working
- [ ] Backups automated & tested
- [ ] Monitoring/alerts configured
- [ ] Load test: 1000 concurrent users
- [ ] Security scan: npm audit, OWASP
- [ ] Performance: Lighthouse >80
- [ ] Smoke test: critical paths work
- [ ] Team trained on deployment/rollback
- [ ] Incident response plan documented

---

## SUPPORT & DOCUMENTATION

- 📖 [Architecture Guide](./ARCHITECTURE.md)
- 🔒 [Security Checklist](./SECURITY.md)
- 🆘 [Troubleshooting](./TROUBLESHOOTING.md)
- 📞 Contact: devops@example.com

