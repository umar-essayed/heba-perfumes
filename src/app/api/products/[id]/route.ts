import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { INITIAL_PRODUCTS } from '@/lib/data/initialProducts';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const doc = await adminDb.collection('products').doc(id).get();

    if (doc.exists) {
      return NextResponse.json({
        success: true,
        data: { id: doc.id, ...doc.data() }
      });
    }

    // Check fallback
    const found = INITIAL_PRODUCTS.find(p => p.id === id);
    if (found) {
      return NextResponse.json({
        success: true,
        data: found
      });
    }

    return NextResponse.json(
      { success: false, error: 'العطر غير موجود' },
      { status: 404 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const updatedData = {
      ...body,
      id,
      updatedAt: new Date().toISOString()
    };

    await adminDb.collection('products').doc(id).set(updatedData, { merge: true });

    return NextResponse.json({
      success: true,
      data: updatedData,
      message: 'تم تحديث بيانات العطر بنجاح ✨'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await adminDb.collection('products').doc(id).delete();

    return NextResponse.json({
      success: true,
      message: 'تم حذف العطر بنجاح'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
