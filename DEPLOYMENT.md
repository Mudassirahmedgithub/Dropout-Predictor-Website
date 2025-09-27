# Deployment Guide

## Prerequisites
- Python 3.11+
- Node.js 18+
- Git
- Docker (optional)

## Environment Setup

1. Copy environment variables:
```bash
cp .env.example .env
```

2. Update `.env` with your production values:
- Change `SECRET_KEY` and `JWT_SECRET_KEY` to secure random strings
- Set `ENVIRONMENT=production`
- Update `ALLOWED_ORIGINS` with your domain(s)
- Configure database URL if using PostgreSQL

## Local Development

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Frontend  
```bash
cd frontend
npm install
npm start
```

## Production Deployment

### Option 1: Heroku Deployment

1. **Prepare for Heroku:**
```bash
# Install Heroku CLI
# Login to Heroku
heroku login
heroku create your-app-name
```

2. **Set environment variables:**
```bash
heroku config:set SECRET_KEY=your-secure-secret-key
heroku config:set ENVIRONMENT=production
heroku config:set ALLOWED_ORIGINS=https://your-frontend-domain.com
```

3. **Deploy:**
```bash
git add .
git commit -m "Prepare for deployment"
git push heroku main
```

### Option 2: Docker Deployment

1. **Build and run with Docker Compose:**
```bash
docker-compose up --build
```

2. **For production with PostgreSQL:**
```bash
docker-compose -f docker-compose.yml up -d
```

### Option 3: VPS/Cloud Server

1. **Clone repository:**
```bash
git clone https://github.com/yourusername/dropout-prediction-system.git
cd dropout-prediction-system
```

2. **Setup backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

3. **Setup frontend:**
```bash
cd ../frontend
npm install
npm run build
```

4. **Use process manager (PM2):**
```bash
npm install -g pm2
pm2 start ecosystem.config.js
```

### Option 4: Railway/Render

1. **Connect your GitHub repository**
2. **Set environment variables in dashboard**
3. **Deploy automatically from main branch**

## Database Migration

For PostgreSQL in production:
```bash
# Update DATABASE_URL in .env
DATABASE_URL=postgresql://username:password@host:port/database

# The app will automatically create tables on startup
```

## Security Checklist

- ✅ Change default secret keys
- ✅ Set ENVIRONMENT=production  
- ✅ Configure CORS properly
- ✅ Use HTTPS in production
- ✅ Set up proper logging
- ✅ Regular security updates
- ✅ Database backups

## Monitoring

- Set up application monitoring (New Relic, DataDog, etc.)
- Configure error tracking (Sentry)
- Set up uptime monitoring
- Monitor database performance

## Scaling

- Use Gunicorn with multiple workers
- Implement Redis for caching
- Set up load balancer
- Database read replicas
- CDN for static assets

## Troubleshooting

### Common Issues:
1. **CORS errors**: Check ALLOWED_ORIGINS in .env
2. **Database connection**: Verify DATABASE_URL
3. **Missing dependencies**: Run pip install -r requirements.txt
4. **Port conflicts**: Change PORT in .env
5. **Frontend build errors**: Clear node_modules and reinstall