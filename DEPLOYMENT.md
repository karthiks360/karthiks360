# GitHub Pages Deployment Guide

This guide will help you deploy your Next.js project to GitHub Pages.

## Prerequisites

- A GitHub account
- Git installed on your machine (✅ Already done!)
- Your project is already initialized as a Git repository (✅ Already done!)

## Step-by-Step Deployment Instructions

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right and select "New repository"
3. Name your repository (e.g., `karnext`)
4. **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

### 2. Connect Your Local Repository to GitHub

After creating the repository, GitHub will show you commands. Run these in your terminal:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/karnext.git

# Rename the default branch to main (if needed)
git branch -M main

# Push your code to GitHub
git push -u origin main
```

### 3. Configure GitHub Pages Settings

1. Go to your repository on GitHub
2. Click on **Settings** (top menu)
3. In the left sidebar, click on **Pages**
4. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
5. The workflow will automatically trigger on the next push

### 4. Important Configuration Notes

#### If deploying to `username.github.io/karnext`:

You need to update `next.config.ts` and uncomment these lines:

```typescript
basePath: '/karnext',
assetPrefix: '/karnext',
```

Then rebuild and push:

```bash
git add next.config.ts
git commit -m "Update basePath for GitHub Pages"
git push
```

#### If deploying to a custom domain or `username.github.io`:

Keep the configuration as is (with basePath commented out).

### 5. Monitor the Deployment

1. Go to the **Actions** tab in your GitHub repository
2. You should see a workflow running called "Deploy Next.js to GitHub Pages"
3. Wait for it to complete (usually 2-3 minutes)
4. Once complete, your site will be live!

### 6. Access Your Deployed Site

Your site will be available at:
- `https://YOUR_USERNAME.github.io/karnext/` (if using basePath)
- OR `https://YOUR_USERNAME.github.io/` (if deploying to root)

## Future Updates

Every time you push to the `main` branch, the site will automatically rebuild and redeploy!

```bash
# Make your changes
git add .
git commit -m "Your commit message"
git push
```

## Troubleshooting

### Build Fails

- Check the Actions tab for error logs
- Ensure all dependencies are in `package.json`
- Make sure `npm run build` works locally

### Pages Not Found (404)

- Verify the basePath configuration matches your deployment type
- Check that the GitHub Pages source is set to "GitHub Actions"

### Assets Not Loading

- Verify `images: { unoptimized: true }` is in next.config.ts
- Check basePath/assetPrefix configuration

## Testing Locally Before Deployment

```bash
# Build the static export
npm run build

# The output will be in the 'out' folder
# You can serve it locally with:
npx serve@latest out
```

## Configuration Files Created

- ✅ `.github/workflows/deploy.yml` - GitHub Actions workflow
- ✅ `next.config.ts` - Updated with export configuration
- ✅ `public/.nojekyll` - Prevents Jekyll processing
- ✅ `.gitignore` - Excludes build artifacts

---

**Next Step**: Create a repository on GitHub and run the commands in Step 2!
