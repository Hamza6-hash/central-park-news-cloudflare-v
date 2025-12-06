// src/firebase/admin-config.ts
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    // Parse service account JSON from environment variable
    const KEY = process.env.PRIVATE_KEY;
    const serviceAccount = JSON.parse(KEY || '{}');

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });
  } catch (error) {
    throw error
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export const adminStorage = admin.storage();

export { admin };