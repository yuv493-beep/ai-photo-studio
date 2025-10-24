import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

try {
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Local development: use service account file
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
    console.log('Firebase Admin SDK initialized using service account file.');
  } else {
    // Deployed environment (Cloud Run): use Application Default Credentials
    admin.initializeApp();
    console.log('Firebase Admin SDK initialized using Application Default Credentials.');
  }
} catch (error: any) {
  if (error.code !== 'app/duplicate-app') {
    console.error('Firebase Admin SDK initialization error', error);
  }
}

export const auth = admin.auth();
