import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { INITIAL_PRODUCTS } from '@/lib/data/initialProducts';

export async function GET() {
  try {
    const snapshot = await adminDb.collection('products').get();
    
    // If collection is empty, return INITIAL_PRODUCTS and seed asynchronously
    if (snapshot.empty) {
      return NextResponse.json({
        success: true,
        data: INITIAL_PRODUCTS,
        source: 'initial'
      });
    }

    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      success: true,
      data: products,
      source: 'firestore'
    });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    // Fallback gracefully to INITIAL_PRODUCTS
    return NextResponse.json({
      success: true,
      data: INITIAL_PRODUCTS,
      fallback: true
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = body.id || `heba-${Date.now()}`;
    
    const productData = {
      ...body,
      id,
      rating: body.rating || 5.0,
      reviewsCount: body.reviewsCount || 1,
      updatedAt: new Date().toISOString()
    };

    await adminDb.collection('products').doc(id).set(productData, { merge: true });

    return NextResponse.json({
      success: true,
      data: productData,
      message: 'تم إضافة العطر بنجاح في متجر هيبة! 👑'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
