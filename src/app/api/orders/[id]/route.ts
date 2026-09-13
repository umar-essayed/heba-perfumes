import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { OrderStatus } from '@/types';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const rawId = decodeURIComponent(params.id || '').trim();
    if (!rawId) {
      return NextResponse.json({ success: false, error: 'يرجى إدخال رقم الطلب أو رقم الهاتف.' }, { status: 400 });
    }

    const cleanId = rawId.replace(/[\s-]+/g, '');
    const cleanIdUpper = rawId.toUpperCase().trim();

    // 1. Direct document lookup by ID
    let doc = await adminDb.collection('orders').doc(rawId).get();
    if (!doc.exists && cleanIdUpper !== rawId) {
      doc = await adminDb.collection('orders').doc(cleanIdUpper).get();
    }

    if (doc.exists) {
      const order = { id: doc.id, ...doc.data() };
      return NextResponse.json({
        success: true,
        data: order,
        multiple: [order]
      });
    }

    // 2. Query by orderNumber field
    const orderNumberQuery = await adminDb
      .collection('orders')
      .where('orderNumber', 'in', [rawId, cleanIdUpper, `HEBA-${cleanId}`])
      .limit(5)
      .get();

    if (!orderNumberQuery.empty) {
      const orders = orderNumberQuery.docs.map(d => ({ id: d.id, ...d.data() }));
      return NextResponse.json({
        success: true,
        data: orders[0],
        multiple: orders
      });
    }

    // 3. Query by Phone Number variations
    const phoneVariations = new Set<string>();
    phoneVariations.add(rawId);
    phoneVariations.add(cleanId);

    // Standard Egyptian numbers variations
    const bareNumber = cleanId.replace(/^(\+20|20|0)/, '');
    phoneVariations.add('0' + bareNumber);
    phoneVariations.add('20' + bareNumber);
    phoneVariations.add('+20' + bareNumber);

    const phoneArr = Array.from(phoneVariations).slice(0, 10);

    const phoneQuery = await adminDb
      .collection('orders')
      .where('customer.phone', 'in', phoneArr)
      .get();

    if (!phoneQuery.empty) {
      const orders = phoneQuery.docs.map(d => ({ id: d.id, ...d.data() }));
      // Sort newest first
      orders.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      return NextResponse.json({
        success: true,
        data: orders[0],
        multiple: orders
      });
    }

    // Also check secondary phone
    const secondaryPhoneQuery = await adminDb
      .collection('orders')
      .where('customer.secondaryPhone', 'in', phoneArr)
      .get();

    if (!secondaryPhoneQuery.empty) {
      const orders = secondaryPhoneQuery.docs.map(d => ({ id: d.id, ...d.data() }));
      orders.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      return NextResponse.json({
        success: true,
        data: orders[0],
        multiple: orders
      });
    }

    return NextResponse.json(
      { success: false, error: 'لم نتمكن من العثور على أي طلب مسجل برقم الطلب أو رقم الهاتف هذا.' },
      { status: 404 }
    );
  } catch (error: any) {
    console.error('Error tracking order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { status, note }: { status: OrderStatus; note?: string } = await request.json();

    const orderRef = adminDb.collection('orders').doc(id);
    const doc = await orderRef.get();

    if (!doc.exists) {
      return NextResponse.json({ success: false, error: 'الطلب غير موجود' }, { status: 404 });
    }

    const currentData = doc.data();
    const statusUpdates = currentData?.statusUpdates || [];
    const now = new Date().toISOString();

    statusUpdates.push({
      status,
      updatedAt: now,
      note: note || `تم تحديث حالة الطلب إلى: ${getStatusText(status)}`
    });

    await orderRef.update({
      status,
      statusUpdates,
      updatedAt: now
    });

    return NextResponse.json({
      success: true,
      message: `تم تحديث حالة الطلب إلى ${getStatusText(status)} بنجاح.`
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function getStatusText(status: OrderStatus): string {
  switch (status) {
    case 'pending': return 'طلب جديد';
    case 'preparing': return 'قيد التجهيز والتعتيق';
    case 'shipped': return 'خرج للتوصيل مع المندوب';
    case 'delivered': return 'تم التسليم بنجاح';
    case 'cancelled': return 'ملغي';
    default: return status;
  }
}
