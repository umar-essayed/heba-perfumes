import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { adminDb } from '@/lib/firebaseAdmin';
import { verifyAdminToken } from '@/lib/auth/adminAuth';

export async function GET() {
  try {
    const snapshot = await adminDb.collection('orders').orderBy('createdAt', 'desc').get();
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      success: true,
      data: orders
    });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    try {
      const fallbackSnapshot = await adminDb.collection('orders').get();
      const orders = fallbackSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return NextResponse.json({ success: true, data: orders });
    } catch (e: any) {
      return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderNumber = `HEBA-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const orderData = {
      ...body,
      id: orderNumber,
      orderNumber,
      status: 'pending',
      createdAt: now,
      statusUpdates: [
        {
          status: 'pending',
          updatedAt: now,
          note: 'تم تأكيد طلبك وجاري مراجعته وتجهيزه في عطور هَيْبَة'
        }
      ]
    };

    await adminDb.collection('orders').doc(orderNumber).set(orderData);

    return NextResponse.json({
      success: true,
      data: orderData,
      orderNumber,
      message: 'تم تسجيل طلبك بنجاح وسنقوم بتجهيزه فوراً.'
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'فشل في تسجيل الطلب' },
      { status: 500 }
    );
  }
}

// PATCH: Securely update order status (Admin only)
export async function PATCH(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('heba_admin_token')?.value || request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    
    // Auth check
    if (!verifyAdminToken(token)) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح لك بتعديل الطلبات. يرجى تسجيل الدخول كمسؤول.' },
        { status: 401 }
      );
    }

    const { orderId, status, note } = await request.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, error: 'معرف الطلب والحالة الجديدة مطلوبان.' },
        { status: 400 }
      );
    }

    const orderRef = adminDb.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();

    if (!orderDoc.exists) {
      return NextResponse.json(
        { success: false, error: 'الطلب غير موجود.' },
        { status: 404 }
      );
    }

    const existingData = orderDoc.data() || {};
    const now = new Date().toISOString();

    const statusUpdates = existingData.statusUpdates || [];
    statusUpdates.push({
      status,
      updatedAt: now,
      note: note || `تم تحديث حالة الطلب إلى: ${status}`
    });

    await orderRef.update({
      status,
      updatedAt: now,
      statusUpdates
    });

    return NextResponse.json({
      success: true,
      message: 'تم تحديث حالة الطلب بنجاح.',
      orderId,
      status
    });
  } catch (err: any) {
    console.error('Error updating order:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'فشل في تحديث حالة الطلب.' },
      { status: 500 }
    );
  }
}

// DELETE: Delete an order
export async function DELETE(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('heba_admin_token')?.value || request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');

    if (!verifyAdminToken(token)) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح لك بحذف الطلبات.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'معرف الطلب مطلوب للحذف.' }, { status: 400 });
    }

    await adminDb.collection('orders').doc(orderId).delete();

    return NextResponse.json({
      success: true,
      message: `تم حذف الطلب (${orderId}) بنجاح.`
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
