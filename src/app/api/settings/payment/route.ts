import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminDb } from '@/lib/firebaseAdmin';
import { verifyAdminToken } from '@/lib/auth/adminAuth';
import { DEFAULT_PAYMENT_SETTINGS } from '@/lib/data/initialProducts';
import type { PaymentSettings } from '@/types';

export const dynamic = 'force-dynamic';

// GET: Fetch active payment settings
export async function GET() {
  try {
    const doc = await adminDb.collection('settings').doc('payment_methods').get();
    if (doc.exists) {
      const data = doc.data() as PaymentSettings;
      return NextResponse.json({
        success: true,
        data: {
          ...DEFAULT_PAYMENT_SETTINGS,
          ...data
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: DEFAULT_PAYMENT_SETTINGS
    });
  } catch (error: any) {
    console.error('Error fetching payment settings:', error);
    // Graceful fallback to default numbers
    return NextResponse.json({
      success: true,
      data: DEFAULT_PAYMENT_SETTINGS,
      fallback: true
    });
  }
}

// PUT: Update payment settings (Admin only)
export async function PUT(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('heba_admin_token')?.value || request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

    if (!verifyAdminToken(token)) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح لك بتعديل بيانات الدفع. يرجى تسجيل الدخول كمسؤول.' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const cashPhone = body.cashPhone?.trim() || '01003508854';
    const instapayPhone = body.instapayPhone?.trim() || '01003508854';
    const secondaryCashPhone = body.secondaryCashPhone?.trim() || '';
    const instapayUsername = body.instapayUsername?.trim() || `${instapayPhone}@instapay`;
    const accountHolderName = body.accountHolderName?.trim() || 'هَيْبَة للعطور';
    const transferInstructions = body.transferInstructions?.trim() || DEFAULT_PAYMENT_SETTINGS.transferInstructions;

    const updatedData: PaymentSettings = {
      cashPhone,
      secondaryCashPhone,
      instapayPhone,
      instapayUsername,
      accountHolderName,
      transferInstructions,
      updatedAt: new Date().toISOString()
    };

    await adminDb.collection('settings').doc('payment_methods').set(updatedData, { merge: true });

    return NextResponse.json({
      success: true,
      data: updatedData,
      message: 'تم حفظ وتحديث أرقام المحافظ وإنستاباي بنجاح في Firebase Firestore ✨'
    });
  } catch (error: any) {
    console.error('Error updating payment settings:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'فشل في حفظ إعدادات الدفع' },
      { status: 500 }
    );
  }
}
