import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { INITIAL_PRODUCTS, INITIAL_COUPONS, EGYPT_GOVERNORATES } from '../src/lib/data/initialProducts.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = path.join(process.cwd(), 'heba-7747d-firebase-adminsdk-fbsvc-f410094cd3.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('Service account key not found at:', serviceAccountPath);
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id || 'heba-7747d',
  });
}

const db = admin.firestore();

async function runSeed() {
  console.log('🚀 Starting Firebase Firestore seeding for Heba Perfumes...');

  const batch = db.batch();

  // 1. Seed Products
  for (const product of INITIAL_PRODUCTS) {
    const docRef = db.collection('products').doc(product.id);
    batch.set(docRef, {
      ...product,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  }

  // 2. Seed Coupons
  for (const coupon of INITIAL_COUPONS) {
    const docRef = db.collection('coupons').doc(coupon.code);
    batch.set(docRef, {
      ...coupon,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  }

  // 3. Seed Shipping Zones
  for (const zone of EGYPT_GOVERNORATES) {
    const docRef = db.collection('shipping_zones').doc(zone.governorate);
    batch.set(docRef, {
      ...zone,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  }

  try {
    await batch.commit();
    console.log(`✅ Seeded ${INITIAL_PRODUCTS.length} official perfumes, ${INITIAL_COUPONS.length} coupons, and ${EGYPT_GOVERNORATES.length} governorates into Firestore!`);
  } catch (err) {
    console.error('Seeding error:', err.message);
  }

  process.exit(0);
}

runSeed();
