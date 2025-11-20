# Quick Start: Deploy to GitHub Pages

## ✅ Completed Steps

1. ✅ Configured Next.js for static export
2. ✅ Created GitHub Actions workflow
3. ✅ Fixed all import statements
4. ✅ Successfully built the project
5. ✅ Initialized Git repository

## 🚀 Next Steps to Deploy

### Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `karnext` (or your preferred name)
3. **Important**: Do NOT initialize with README, .gitignore, or license
4. Click "Create repository"

### Step 2: Push Your Code

Replace `YOUR_USERNAME` with your GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/karnext.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings**
3. Click **Pages** in the left sidebar
4. Under "Build and deployment":
   - Source: Select **GitHub Actions**
5. Done! The workflow will trigger automatically

### Step 4: Wait for Deployment

1. Go to the **Actions** tab
2. Watch the "Deploy Next.js to GitHub Pages" workflow
3. When complete (2-3 minutes), your site is live!

## 🌐 Your Site URL

- If deploying to: `username.github.io/karnext`
  - You NEED to uncomment these lines in `next.config.ts`:
    ```typescript
    basePath: '/karnext',
    assetPrefix: '/karnext',
    ```
  - Then commit and push again

- If deploying to: `username.github.io` (root domain)
  - Keep the configuration as is
  - Your site will be at: `https://YOUR_USERNAME.github.io/`

## 📝 Future Updates

Every time you make changes and push to main, your site will automatically rebuild!

```bash
# Make changes to your code
git add .
git commit -m "Your update message"
git push
```

## 🔧 Troubleshooting

**Build fails in Actions**
- Check the Actions tab for detailed errors
- Run `npm run build` locally first to verify

**404 on deployment**
- Make sure basePath is configured correctly
- Verify GitHub Pages source is "GitHub Actions"

**Assets not loading**
- Check basePath/assetPrefix match your deployment URL

---

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
