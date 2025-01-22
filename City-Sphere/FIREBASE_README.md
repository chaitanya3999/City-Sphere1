# Firebase Setup for City Sphere Project

## Prerequisites
- Node.js and npm installed
- Firebase CLI installed (`npm install -g firebase-tools`)

## Initial Setup

1. **Install Dependencies**
   ```bash
   npm install firebase
   ```

2. **Firebase Project Configuration**
   - A temporary Firebase configuration has been generated in `firebase_config.json`
   - You will need to replace this with your actual Firebase project configuration

3. **Create Firebase Project**
   ```bash
   firebase login
   firebase projects:create city-sphere
   ```

4. **Enable Services**
   ```bash
   firebase use city-sphere
   firebase apps:create WEB city-sphere-web
   firebase auth:enable
   firebase firestore:enable
   ```

5. **Get Firebase Configuration**
   - Go to Firebase Console > Project Settings > Your App
   - Copy the configuration object
   - Replace the configuration in `src/js/firebase-config.js`

## Security Rules

### Authentication Rules
```firestore
rules_version = '2';
service firebase.auth {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Firestore Rules
```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow create: if request.auth != null;
      allow read, update, delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Deployment
```bash
firebase deploy
```

## Troubleshooting
- Ensure you have the latest Firebase SDK
- Check console for any error messages
- Verify authentication and Firestore are enabled in Firebase Console

## Security Best Practices
- Never commit sensitive configuration files
- Use environment variables for API keys
- Implement proper authentication and authorization
