# LifeGrid AI — Mac Terminal Setup (Copy-Paste Ready)

## Prerequisites (run once)
```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js + Git
brew install node git

# Verify
node --version && npm --version
```

## Project Setup
```bash
# Navigate to Desktop
cd ~/Desktop

# Clone or create project folder
mkdir lifegrid-ai && cd lifegrid-ai

# Install all dependencies
npm install

# Copy .env.example to .env.local
cp .env.example .env.local
```

## Add Your API Keys to .env.local
Open `.env.local` in any editor and fill in:
```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_MAPBOX_TOKEN=your_mapbox_token
VITE_ANTHROPIC_KEY=your_anthropic_key
```

## Run Dev Server
```bash
npm run dev
# Open http://localhost:5173
```

## Deploy to Vercel
```bash
npm install -g vercel
vercel
# Follow prompts — live in 60 seconds!
```

## Accounts Needed (all free tier)
1. **Firebase** → https://console.firebase.google.com
   - New project → Enable Firestore (test mode) + Anonymous Auth
   - Project Settings → Your Apps → Web App → copy firebaseConfig

2. **Mapbox** → https://account.mapbox.com/auth/signup
   - Dashboard → copy Default public token

3. **Anthropic** → https://console.anthropic.com
   - API Keys → Create new key

4. **Vercel** → https://vercel.com/signup (sign up with GitHub)

## Troubleshooting
```bash
# Permission errors
sudo chmod -R 755 .

# Peer dep conflicts
npm install --legacy-peer-deps

# Port busy
npm run dev -- --port 3001

# Firebase auth issues
# Make sure Anonymous auth is enabled in Firebase Console
```
