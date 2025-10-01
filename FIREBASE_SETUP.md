# Firebase Setup Guide for AMA Bites

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create Project" or "Add Project"
3. Name it "ama-bites" (or any name you prefer)
4. Disable Google Analytics (not needed for this app)
5. Click "Create Project"

## Step 2: Enable Firestore Database

1. In your Firebase project, click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in production mode" (we'll update rules later)
4. Select your preferred location (e.g., us-central1)
5. Click "Enable"

## Step 3: Set Firestore Rules

1. In Firestore, click on the "Rules" tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read videos
    match /videos/{document=**} {
      allow read: if true;
      allow write: if true; // In production, you should add authentication
    }
  }
}
```

3. Click "Publish"

## Step 4: Get Your Firebase Configuration

1. Go to Project Settings (gear icon) → "General"
2. Scroll down to "Your apps" section
3. Click "Web" icon (</>) to add a web app
4. Register app with nickname "AMA Bites Web"
5. Copy the configuration values

## Step 5: Add Configuration to Your App

1. Create a `.env` file in your project root (copy from `.env.example`)
2. Fill in the values from Firebase:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## Step 6: Restart Your Development Server

```bash
# Stop the server (Ctrl+C) and restart
npm start
```

## Step 7: Deploy to Vercel

When deploying to Vercel, add these environment variables in Vercel Dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each `REACT_APP_FIREBASE_*` variable

## Testing

1. Open `/admin` in your browser
2. Upload a video (YouTube URL)
3. Open a different browser or incognito window
4. Navigate to the public view (`/`)
5. You should see the video immediately!

## Security Notes

- The current rules allow anyone to read/write.
- For production, implement authentication for the admin panel
- Consider using Firebase Authentication to restrict write access

## Troubleshooting

If videos aren't syncing:
1. Check browser console for errors
2. Verify Firebase configuration is correct
3. Check Firestore rules are published
4. Ensure `.env` file is properly formatted
5. Make sure you restarted the dev server after adding `.env`