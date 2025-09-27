# Vercel Deployment Guide

## 🚀 Vercel Deployment (Option 1 - Recommended)

This guide shows how to deploy your AI-based Dropout Prediction System to Vercel using serverless functions.

### Project Structure for Vercel
```
dropout-prediction-system/
├── api/                    # Serverless functions
│   ├── analytics.py       # GET /api/analytics
│   ├── bulk-predict.py    # POST /api/bulk-predict
│   ├── datasets/          # Dataset files for API
│   ├── index.py           # GET /api/ (main endpoint)
│   ├── model-info.py      # GET /api/model-info
│   ├── models/            # AI models
│   ├── predict.py         # POST /api/predict
│   ├── requirements.txt   # Python dependencies
│   ├── upload.py          # POST /api/upload
│   └── utils/             # Utility functions
├── frontend/              # React application
├── public/                # Static files
│   └── datasets/          # Public dataset access
└── vercel.json            # Vercel configuration
```

### Prerequisites
- GitHub account
- Vercel account (free tier available)
- Your project pushed to GitHub

### Step 1: Prepare Your Repository

1. **Ensure all files are in the correct structure** (already done)
2. **Create a `.gitignore` file in the root**:
```gitignore
# Dependencies
node_modules/
*/node_modules/

# Production builds
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Python
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
*.so
.pytest_cache/
venv/
env/

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```

3. **Push to GitHub**:
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Deploy to Vercel

#### Option A: Vercel CLI (Recommended)
1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy from your project directory**:
```bash
vercel
```

4. **Follow the prompts**:
   - Link to existing project? `N`
   - Project name: `dropout-prediction-system`
   - Directory: `./` (current directory)
   - Override settings? `N`

#### Option B: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the configuration from `vercel.json`
5. Click "Deploy"

### Step 3: Configure Environment Variables (if needed)

In your Vercel dashboard:
1. Go to your project
2. Navigate to "Settings" → "Environment Variables"
3. Add any required variables:
   - `ALLOWED_ORIGINS` (optional)

### Step 4: Test Your Deployment

Your app will be available at: `https://your-project-name.vercel.app`

Test the endpoints:
- Frontend: `https://your-project-name.vercel.app`
- API Root: `https://your-project-name.vercel.app/api`
- Single Prediction: `https://your-project-name.vercel.app/api/predict`
- Analytics: `https://your-project-name.vercel.app/api/analytics`

### Features Included in Vercel Deployment

✅ **Frontend (React)**
- Responsive design
- Single student prediction
- Bulk student prediction
- CSV upload processing
- Analytics dashboard
- Real-time risk assessment

✅ **Backend (Serverless Functions)**
- FastAPI endpoints as serverless functions
- AI/ML model predictions
- Risk analysis and recommendations
- Dashboard analytics
- Model information API

✅ **Performance Optimizations**
- CDN distribution
- Automatic scaling
- Edge network deployment
- Fast cold start times

### Automatic Features

🔄 **Continuous Deployment**: Automatically redeploy when you push to GitHub
🔧 **Build Optimization**: Automatic optimization for performance
📊 **Analytics**: Built-in deployment and performance analytics
🔒 **HTTPS**: Automatic SSL certificate
🌍 **Global CDN**: Worldwide content distribution

### Troubleshooting

#### Common Issues:

1. **Build Failures**:
   - Check `vercel.json` configuration
   - Verify all file paths are correct
   - Check Python dependencies in `api/requirements.txt`

2. **API Errors**:
   - Verify serverless function structure
   - Check import paths in Python files
   - Ensure datasets are in the correct location

3. **Frontend Issues**:
   - Verify `REACT_APP_API_BASE_URL` is set correctly
   - Check API endpoint paths match serverless functions

#### Debug Commands:
```bash
# Check deployment logs
vercel logs

# Run local development
vercel dev

# Check build output
vercel build
```

### Cost Estimation

**Vercel Free Tier Includes**:
- 100GB bandwidth per month
- 100 serverless function invocations per day
- 10GB storage
- Unlimited personal projects

**Hobby Plan ($20/month)**:
- 1TB bandwidth
- Unlimited function invocations
- 100GB storage
- Custom domains

### Next Steps After Deployment

1. **Custom Domain**: Add your own domain in Vercel settings
2. **Monitoring**: Set up monitoring and alerts
3. **Performance**: Monitor function performance and optimize
4. **Scaling**: Monitor usage and upgrade plan if needed

Your AI-based Dropout Prediction System is now live on Vercel! 🎉