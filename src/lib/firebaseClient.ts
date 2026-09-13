import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: 'heba-7747d',
  authDomain: 'heba-7747d.firebaseapp.com',
  storageBucket: 'heba-7747d.appspot.com',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export default app;
