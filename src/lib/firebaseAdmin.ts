import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

if (!admin.apps.length) {
  try {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY || path.join(process.cwd(), 'heba-7747d-firebase-adminsdk-fbsvc-f410094cd3.json');

    if (serviceAccountJson) {
      const serviceAccount = JSON.parse(serviceAccountJson);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id || 'heba-7747d',
      });
      console.log('Firebase Admin initialized successfully with environment variable JSON.');
    } else if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id || 'heba-7747d',
      });
      console.log('Firebase Admin initialized successfully with service account file.');
    } else {
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'heba-7747d',
      });
      console.log('Firebase Admin initialized with default projectId.');
    }
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
  }
}

export const adminDb = admin.firestore();
export { admin };
