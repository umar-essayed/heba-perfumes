import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { INITIAL_COUPONS } from '@/lib/data/initialProducts';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const code = body.code;
    const subtotal = Number(body.subtotal ?? body.orderTotal ?? body.amount ?? 0);

    if (!code) {
      return NextResponse.json({ success: false, message: 'يرجى كتابة كود الخصم' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    // Check Firestore
    let coupon: any = null;
    try {
      const doc = await adminDb.collection('coupons').doc(cleanCode).get();
      if (doc.exists) {
        coupon = doc.data();
      }
    } catch (e) {
      // Fallback
    }

    if (!coupon) {
      coupon = INITIAL_COUPONS.find(c => c.code.toUpperCase() === cleanCode);
    }

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({
        success: false,
        message: 'كود الخصم غير صالح أو انتهت صلاحيته يا غالي'
      }, { status: 404 });
    }

    if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
      return NextResponse.json({
        success: false,
        message: `الكود ده محتاج حد أدنى للطلب ${coupon.minOrderValue} جنيه (مجموع سلتك حالياً ${subtotal} ج)`
      }, { status: 400 });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
    } else {
      discountAmount = Math.min(coupon.discountValue, subtotal);
    }

    return NextResponse.json({
      success: true,
      discountAmount,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount
      },
      message: `مبروك! تم خصم ${discountAmount} جنيه من قيمة الأوردر 🎉`
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
