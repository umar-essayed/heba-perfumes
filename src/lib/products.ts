import { adminDb } from '@/lib/firebaseAdmin';
import { INITIAL_PRODUCTS } from '@/lib/data/initialProducts';
import { PerfumeProduct } from '@/types';

/**
 * Fetches all live products from Firebase Firestore with fallback to INITIAL_PRODUCTS.
 */
export async function getLiveProducts(): Promise<PerfumeProduct[]> {
  try {
    const snapshot = await adminDb.collection('products').get();
    if (!snapshot.empty) {
      const dbProducts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PerfumeProduct[];

      // Create a map to preserve or augment with any initial fields if needed
      const initialMap = new Map(INITIAL_PRODUCTS.map(p => [p.id, p]));
      
      const merged = dbProducts.map(p => {
        const initial = initialMap.get(p.id);
        return {
          ...(initial || {}),
          ...p,
          // Ensure sizes array has valid numeric prices
          sizes: (p.sizes && p.sizes.length > 0)
            ? p.sizes.map(s => ({
                ...s,
                price: Number(s.price) || Number(p.price) || 420,
                originalPrice: s.originalPrice ? Number(s.originalPrice) : undefined
              }))
            : (initial?.sizes || [
                { size: '50 مل', price: Number(p.price) || 420 },
                { size: '100 مل', price: Math.round((Number(p.price) || 420) * 1.64) }
              ]),
          price: Number(p.price) || (p.sizes?.[0]?.price ? Number(p.sizes[0].price) : 420)
        };
      });

      return merged;
    }
  } catch (error) {
    console.error('Failed to fetch products from Firestore, using initial fallback:', error);
  }

  return INITIAL_PRODUCTS;
}

/**
 * Fetches a single live product by its id/slug from Firestore.
 */
export async function getLiveProduct(id: string): Promise<PerfumeProduct | null> {
  try {
    const doc = await adminDb.collection('products').doc(id).get();
    const initial = INITIAL_PRODUCTS.find(p => p.id === id);

    if (doc.exists) {
      const data = doc.data() as Partial<PerfumeProduct>;
      return {
        ...(initial || {}),
        ...data,
        id: doc.id,
        price: Number(data.price) || (data.sizes?.[0]?.price ? Number(data.sizes[0].price) : initial?.price || 420),
        sizes: (data.sizes && data.sizes.length > 0)
          ? data.sizes.map(s => ({
              ...s,
              price: Number(s.price) || Number(data.price) || 420,
              originalPrice: s.originalPrice ? Number(s.originalPrice) : undefined
            }))
          : (initial?.sizes || [
              { size: '50 مل', price: Number(data.price) || 420 },
              { size: '100 مل', price: Math.round((Number(data.price) || 420) * 1.64) }
            ])
      } as PerfumeProduct;
    }

    if (initial) {
      return initial;
    }
  } catch (error) {
    console.error(`Failed to fetch product ${id} from Firestore:`, error);
  }

  return INITIAL_PRODUCTS.find(p => p.id === id) || null;
}
