# GitHub Repository & Deployment Setup

## Step 1: Create GitHub Repository

### Option A: Using GitHub CLI (Fastest)

```bash
# Install GitHub CLI if you don't have it:
# https://cli.github.com/

# Login
gh auth login

# Create new repository
gh repo create electionProcessEducation --source=. --remote=origin --push
```

### Option B: Using GitHub Web Interface

1. Go to https://github.com/new
2. Enter repository name: `electionProcessEducation`
3. Description: "Smart civic education assistant with Google Gemini AI"
4. Choose **Public** (for hackathon judges)
5. Click "Create repository"
6. Follow the push instructions shown

### Option C: Manual Git Commands

```bash
# From your project directory (already initialized)
git remote add origin https://github.com/YOUR_USERNAME/electionProcessEducation.git
git branch -M main
git push -u origin main
```

---

## Step 2: Verify Repository

After pushing, verify at:
```
https://github.com/YOUR_USERNAME/electionProcessEducation
```

You should see:
- ✅ All files committed
- ✅ README.md displayed
- ✅ .env.local in .gitignore (API key protected)

---

## Step 3: Deploy to Vercel (Live Demo)

### Quick Deploy (5 minutes)

1. **Go to Vercel**: https://vercel.com/new
2. **Click "Import Git Repository"**
3. **Paste GitHub URL**: `https://github.com/YOUR_USERNAME/electionProcessEducation`
4. **Click "Import"**
5. **Configure Project**:
   - Framework: Vite
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist` (auto-detected)
6. **Add Environment Variables** (click "Environment Variables"):
   - Key: `VITE_GOOGLE_API_KEY`
   - Value: Your Gemini API key from https://aistudio.google.com/app/apikeys
7. **Click "Deploy"**
8. **Wait for deployment** (usually ~2 minutes)
9. **Get your live URL** from Vercel dashboard (something like: `https://election-guide-xyz.vercel.app`)

### Test Live Demo

After deployment completes:
- Visit your Vercel URL
- Try asking "How do I register?"
- Notice responses show `[GEMINI]` if API key works
- Share this URL with hackathon judges!

---

## Step 4: GitHub Pages Alternative (Free, No API Support)

If you don't want to use Vercel, GitHub Pages works too:

### Setup GitHub Pages

1. **Go to repository Settings** → Pages
2. **Source**: Deploy from a branch
3. **Branch**: Select `main` and `/root`
4. **Save**
5. **Site will be at**: `https://YOUR_USERNAME.github.io/electionProcessEducation`

**Note**: This doesn't support environment variables, so Gemini API won't work. But the app works perfectly with rule-based fallback.

---

## Step 5: Create Submission Package

Create a `SUBMISSION_INSTRUCTIONS.md` file for judges:

```markdown
# Election Guide Assistant - Hackathon Submission

## Live Demo
**Link**: [Your Vercel URL or GitHub Pages URL]

## GitHub Repository
**Link**: https://github.com/YOUR_USERNAME/electionProcessEducation

## Quick Start

### Online (No Setup Required)
1. Visit the live demo link above
2. Click "Ask the assistant"
3. Try: "How do I register?" or "I'm a first-time voter"

### Local Setup (5 minutes)
```bash
git clone https://github.com/YOUR_USERNAME/electionProcessEducation.git
cd electionProcessEducation
npm install
npm test      # Run validation suite
npm run dev   # Start dev server at localhost:5173
```

## Features Demonstrated

### 1. Smart Assistant ✅
- Try: "I'm voting for the first time"
- Try: "Can I vote by mail?"
- Try: "When should I register?"

### 2. Google Gemini AI ✅
- Live demo uses AI when API key is configured
- Responses show `[GEMINI]` if powered by AI

### 3. Accessibility ✅
- Press `Tab` to navigate with keyboard
- Test with screen reader (VoiceOver, NVDA, JAWS)
- Responsive on mobile/tablet

### 4. Validation ✅
```bash
npm test
# Output: ✅ 6/6 tests passing, all systems ready
```

## Scoring Alignment

| Criterion | Evidence |
|-----------|----------|
| Smart Assistant | Topic detection + AI integration |
| Google Services | Gemini API for intelligent responses |
| Code Quality | Modular components, JSDoc, best practices |
| Security | API key management, input validation |
| Efficiency | 722ms build, 50 KB JS (gzipped) |
| Testing | Comprehensive validation suite |
| Accessibility | WCAG 2.1 AA compliant |

## Documentation
- [README.md](README.md) - Full project overview
- [QUICKSTART.md](QUICKSTART.md) - 2-minute getting started
- [SECURITY.md](SECURITY.md) - Security practices
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
```

---

## Summary

Your project is now:
- ✅ **Git initialized** with initial commit
- ✅ **Ready to push to GitHub**
- ✅ **Ready to deploy to Vercel**
- ✅ **Ready for hackathon judges**

### Next Actions (Choose One):

1. **Create GitHub Repo** → Use `gh repo create` or GitHub web interface
2. **Deploy to Vercel** → Import from GitHub, add API key, deploy
3. **Both** → GitHub for source control + Vercel for live demo

---

**Need help?**
- GitHub Docs: https://docs.github.com/
- Vercel Docs: https://vercel.com/docs
- Vite Deployment: https://vitejs.dev/guide/static-deploy.html
