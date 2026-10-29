# Adavala Sai Teja – Portfolio

Static site (HTML/CSS/JS). No build step.

## Before deploying
Put your resume PDF in this folder and name it **resume.pdf**. The "Download resume" buttons point to it.

## Deploy on Vercel

**Option A – GitHub (recommended)**
1. Create a new GitHub repo (e.g. `portfolio`) and push these files to it.
2. Go to vercel.com → Add New → Project → import the repo.
3. Framework Preset: **Other**. Leave build command and output directory empty. Click Deploy.

**Option B – CLI**
```
npm i -g vercel
cd portfolio
vercel --prod
```

## Customize
- Text and links: `index.html`
- Colors: CSS variables at the top of `styles.css`
