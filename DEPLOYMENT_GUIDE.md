# Deployment Guide for Online Coaching System

## 🚀 Deployment Architecture

This is a full-stack application that requires separate deployment for frontend and backend:

- **Frontend**: React + Vite → **Netlify** ✅
- **Backend**: Spring Boot + MySQL → **Heroku/Railway/AWS** (separate service)

---

## 📋 Part 1: Frontend Deployment to Netlify

### Prerequisites:
- GitHub account
- Netlify account (free tier)
- Backend API endpoint URL (from Part 2)

### Step 1: Prepare Frontend for Production

1. **Update API URL for Production**
   - Open `src/services/api.js`
   - Change the base URL from `http://localhost:8080` to your backend URL
   - Example: `https://your-backend-api.com/api`

2. **Build the Project**
   ```bash
   cd online-coaching-frontend
   npm install
   npm run build
   ```

### Step 2: Deploy to Netlify

#### Option A: via Netlify CLI (Recommended)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize deployment
netlify init

# Deploy
netlify deploy --prod
```

#### Option B: via Netlify Dashboard
1. Push your frontend code to GitHub
2. Go to [Netlify](https://app.netlify.com)
3. Click "Add new site" → "Import from Git"
4. Select your GitHub repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click "Deploy site"

### Step 3: Configure Environment Variables (if needed)
- Go to Site settings → Environment variables
- Add any required environment variables
- Example: `VITE_API_URL=https://your-backend-api.com`

---

## 📋 Part 2: Backend Deployment Options

### Option A: Heroku (Recommended for Spring Boot)

#### Prerequisites:
- Heroku account
- Heroku CLI
- MySQL database (Heroku Postgres or external)

#### Steps:
1. **Prepare Spring Boot for Production**
   - Open `src/main/resources/application.properties`
   - Update database configuration for production
   - Set `server.port=8080` (or use Heroku's PORT)

2. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

3. **Add Database**
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set SPRING_DATASOURCE_URL=your-database-url
   heroku config:set SPRING_DATASOURCE_USERNAME=your-username
   heroku config:set SPRING_DATASOURCE_PASSWORD=your-password
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

### Option B: Railway
1. Create account at [Railway](https://railway.app)
2. Connect your GitHub repository
3. Select the backend folder
4. Add MySQL database
5. Configure environment variables
6. Deploy

### Option C: AWS (EC2 + RDS)
- More complex but more control
- Use EC2 for Spring Boot
- Use RDS for MySQL
- Configure security groups and load balancers

---

## 🔗 Part 3: Connect Frontend to Backend

### Update API Configuration
1. After backend deployment, get your backend URL
2. Update `src/services/api.js` in frontend:
   ```javascript
   const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://your-backend.herokuapp.com/api';
   ```

3. Rebuild and redeploy frontend

---

## 📊 Part 4: Database Setup

### Production Database Options:

#### 1. **Heroku Postgres** (Recommended)
- Free tier available
- Easy integration with Heroku
- Automatic backups

#### 2. **Railway MySQL**
- Free tier available
- Easy setup
- Good performance

#### 3. **AWS RDS**
- Scalable
- More expensive
- Better for large applications

### Database Migration:
1. Export your local database:
   ```bash
   mysqldump -u root -p OnlineCoachingInstitute > backup.sql
   ```

2. Import to production database:
   ```bash
   mysql -h production-host -u user -p production_db < backup.sql
   ```

---

## 🛡️ Part 5: Security Considerations

### Frontend Security:
- Enable HTTPS (automatic on Netlify)
- Use environment variables for sensitive data
- Implement proper authentication

### Backend Security:
- Enable CORS for your Netlify domain
- Use JWT tokens for authentication
- Validate all inputs
- Rate limiting
- HTTPS only

---

## 📝 Part 6: Deployment Checklist

### Frontend (Netlify):
- [ ] Update API URL to production backend
- [ ] Test build locally (`npm run build`)
- [ ] Deploy to Netlify
- [ ] Test all routes and functionality
- [ ] Check mobile responsiveness

### Backend (Heroku/Railway):
- [ ] Configure production database
- [ ] Set environment variables
- [ ] Enable CORS for frontend domain
- [ ] Test API endpoints
- [ ] Configure logging and monitoring

### Integration:
- [ ] Test frontend-backend connectivity
- [ ] Verify authentication flow
- [ ] Test file uploads (if any)
- [ ] Check payment integration (Razorpay)
- [ ] Monitor error logs

---

## 🚨 Common Issues & Solutions

### Issue 1: CORS Errors
**Solution**: Add your Netlify domain to backend CORS configuration

### Issue 2: Database Connection Failures
**Solution**: Check database credentials and connection strings

### Issue 3: Environment Variables Not Loading
**Solution**: Ensure variables are set correctly on deployment platform

### Issue 4: File Upload Failures
**Solution**: Configure file storage service (AWS S3, Cloudinary)

---

## 📈 Part 7: Monitoring & Maintenance

### Frontend Monitoring:
- Netlify Analytics
- Error tracking (Sentry)

### Backend Monitoring:
- Heroku metrics (if using Heroku)
- Application Performance Monitoring (APM)
- Database performance monitoring

### Regular Maintenance:
- Update dependencies
- Security patches
- Database backups
- Log monitoring

---

## 💰 Cost Estimates

### Free Tier Options:
- **Netlify**: Free (100GB bandwidth/month)
- **Heroku**: Free (Eco dynos)
- **Railway**: Free ($5 credit/month)
- **PostgreSQL**: Free tiers available

### Production (approximate):
- **Netlify**: $19/month (Pro)
- **Heroku**: $7-$25/month (Basic/Standard)
- **Database**: $5-$50/month
- **Total**: ~$30-$80/month for production

---

## 🎯 Quick Start Deployment

### For Immediate Testing:
1. Deploy backend to Heroku (free tier)
2. Deploy frontend to Netlify (free tier)
3. Update frontend API URL
4. Test integration

### For Production:
1. Set up proper domain names
2. Configure SSL certificates
3. Set up monitoring
4. Configure backups
5. Implement CI/CD pipeline

---

## 📞 Support Resources

- **Netlify Docs**: https://docs.netlify.com
- **Heroku Docs**: https://devcenter.heroku.com
- **Spring Boot Deployment**: https://spring.io/guides/topicals/spring-boot-docker
- **React Deployment**: https://create-react-app.dev/docs/deployment

---

## 🔄 CI/CD Pipeline (Optional)

### GitHub Actions Example:
```yaml
name: Deploy to Netlify
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.1
        with:
          publish-dir: './dist'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
```

---

This guide covers the complete deployment process. Start with the free tiers for testing, then upgrade to production plans as needed.