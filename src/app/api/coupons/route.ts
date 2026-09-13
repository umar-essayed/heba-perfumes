import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { INITIAL_COUPONS } from '@/lib/data/initialProducts';
import { Coupon } from '@/types';

// GET: Fetch all coupons
export async function GET() {
  try {
    const snapshot = await adminDb.collection('coupons').get();
    if (snapshot.empty) {
      return NextResponse.json({
        success: true,
        data: INITIAL_COUPONS
      });
    }

    const coupons = snapshot.docs.map(doc => ({
      code: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      success: true,
      data: coupons
    });
  } catch (error: any) {
    console.error('Error fetching coupons:', error);
    return NextResponse.json({
      success: true,
      data: INITIAL_COUPONS,
      fallback: true
    });
  }
}

// POST: Add or update a coupon
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = (body.code || '').trim().toUpperCase();

    if (!code) {
      return NextResponse.json({ success: false, error: 'كود الخصم مطلوب.' }, { status: 400 });
    }

    const couponData: Coupon = {
      code,
      discountType: body.discountType || 'percentage',
      discountValue: Number(body.discountValue) || 10,
      minOrderValue: Number(body.minOrderValue) || 0,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true
    };

    await adminDb.collection('coupons').doc(code).set(couponData, { merge: true });

    return NextResponse.json({
      success: true,
      data: couponData,
      message: 'تم حفظ الكوبون بنجاح.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Delete a coupon
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = (searchParams.get('code') || '').trim().toUpperCase();

    if (!code) {
      return NextResponse.json({ success: false, error: 'كود الخصم مطلوب للحذف.' }, { status: 400 });
    }

    await adminDb.collection('coupons').doc(code).delete();

    return NextResponse.json({
      success: true,
      message: `تم حذف الكوبون (${code}) بنجاح.`
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
