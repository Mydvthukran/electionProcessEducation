# Deployment Guide

## Quick Deploy to Vercel (Recommended)

The fastest way to deploy with Google Gemini API key management.

### Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Election Guide Assistant"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/electionProcessEducation.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select your repository
   - Click "Import"

3. **Configure Environment Variables**
   - Click "Environment Variables" in Vercel dashboard
   - Add: `VITE_GOOGLE_API_KEY` = your API key from https://aistudio.google.com/app/apikeys
   - Click "Deploy"

4. **Your app is live!**
   - Check deployment logs
   - Visit your URL (e.g., `https://election-guide-xyz.vercel.app`)

---

## Deploy to GitHub Pages

Free hosting for static sites (without API key support).

### Steps

1. **Create `deploy.yml` in `.github/workflows/`**
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [main]

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: 18
         - run: npm ci
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

2. **Enable GitHub Pages**
   - Go to repo Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages / root
   - Save

3. **Your app is live!**
   - Visit `https://YOUR_USERNAME.github.io/electionProcessEducation`

---

## Deploy to Netlify

Another simple option with environment variable support.

### Steps

1. **Connect GitHub**
   - Go to https://netlify.com
   - Click "Add new site" → "Import an existing project"
   - Select GitHub
   - Choose repository

2. **Configure Build**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Deploy"

3. **Add Environment Variables**
   - Site settings → Build & deploy → Environment
   - Add `VITE_GOOGLE_API_KEY`
   - Trigger redeploy

---

## Deploy with Docker

For containerized deployment (advanced).

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Runtime stage
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
```

### Build & Run

```bash
docker build -t election-guide .
docker run -p 3000:3000 -e VITE_GOOGLE_API_KEY=your_key election-guide
```

### Deploy to Cloud Run (Google Cloud)

```bash
# Authenticate
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Build & push
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/election-guide
gcloud run deploy election-guide \
  --image gcr.io/YOUR_PROJECT_ID/election-guide \
  --platform managed \
  --region us-central1 \
  --set-env-vars VITE_GOOGLE_API_KEY=your_key
```

---

## Environment Variables

### Required for AI Features
```bash
VITE_GOOGLE_API_KEY=your_api_key_from_aistudio.google.com
```

### Optional for Production
```bash
# Analytics
VITE_GA_ID=google_analytics_id

# Custom API endpoint
VITE_GOOGLE_API_ENDPOINT=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
```

---

## Performance Optimization

### Before Deployment

1. **Run production build**
   ```bash
   npm run build
   ```

2. **Check bundle size**
   ```bash
   # Should see: ~8 KB CSS + ~155 KB JS (gzipped)
   ls -lh dist/assets/
   ```

3. **Test performance**
   ```bash
   npm run preview
   # Then use Lighthouse in Chrome DevTools
   ```

### Production Checklist
- [ ] Environment variables set in hosting provider
- [ ] HTTPS enabled (all hosts do this by default)
- [ ] CORS configured if needed
- [ ] Analytics configured
- [ ] Error logging enabled
- [ ] Monitoring set up

---

## Troubleshooting

### Build fails with "API key not found"
**Solution**: This is expected in local dev. API key not required for rule-based responses.
```bash
# To test with API key:
VITE_GOOGLE_API_KEY=your_key npm run build
```

### Deployed site shows "Cannot find module"
**Solution**: Clear cache and redeploy
```bash
# On Vercel: Redeploy from dashboard
# On Netlify: Clear cache → Redeploy
# On GitHub Pages: Force push to main branch
```

### API key exposed in build output
**Solution**: Never commit `.env.local`. Use hosting provider's environment variables.
```bash
# Check for secrets in repo
git log -p | grep -i "VITE_GOOGLE_API_KEY"

# If found, use git-secrets or rotate key immediately
```

---

## Monitoring & Analytics

### Add Google Analytics

1. Create account at https://analytics.google.com
2. Add environment variable:
   ```bash
   VITE_GA_ID=G-XXXXXXXXXX
   ```

3. Update `index.html`:
   ```html
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'G-XXXXXXXXXX');
   </script>
   ```

### Monitor Gemini API Usage

1. Go to https://console.cloud.google.com
2. Check "Generative Language API" quota
3. Set up alerts for unusual usage

---

## Rollback & Versioning

### Tag releases
```bash
git tag -a v1.0.0 -m "Production release"
git push origin v1.0.0
```

### Quick rollback (Vercel)
- Go to Deployments tab
- Click "Redeploy" on previous build

### Semantic Versioning
- `v1.0.0` - Major release (breaking changes)
- `v1.1.0` - Minor release (new features)
- `v1.0.1` - Patch release (bug fixes)

---

## Cost Estimates

| Platform | Cost | Notes |
|----------|------|-------|
| Vercel | Free tier | Generous free tier, pay per invocation |
| GitHub Pages | Free | Static hosting only |
| Netlify | Free tier | Generous free tier |
| Cloud Run | $0.00002per request | Minimal cost for low traffic |
| Google Gemini API | Variable | ~$0.075 per 1M input tokens |

---

## Support

For deployment issues:
- Check platform documentation
- Review error logs in dashboard
- Test locally with `npm run preview`
- Create GitHub issue with error message and environment details
