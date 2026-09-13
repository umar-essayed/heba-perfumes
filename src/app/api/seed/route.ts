import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { INITIAL_PRODUCTS, INITIAL_COUPONS, EGYPT_GOVERNORATES, DEFAULT_PAYMENT_SETTINGS } from '@/lib/data/initialProducts';

export async function GET() {
  try {
    const batch = adminDb.batch();

    // 1. Seed Products
    for (const product of INITIAL_PRODUCTS) {
      const docRef = adminDb.collection('products').doc(product.id);
      batch.set(docRef, {
        ...product,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }

    // 2. Seed Coupons
    for (const coupon of INITIAL_COUPONS) {
      const docRef = adminDb.collection('coupons').doc(coupon.code);
      batch.set(docRef, {
        ...coupon,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }

    // 3. Seed Shipping Zones
    for (const zone of EGYPT_GOVERNORATES) {
      const docRef = adminDb.collection('shipping_zones').doc(zone.governorate);
      batch.set(docRef, {
        ...zone,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    }

    // 3.5 Seed Payment Settings
    const paymentRef = adminDb.collection('settings').doc('payment_methods');
    batch.set(paymentRef, {
      ...DEFAULT_PAYMENT_SETTINGS,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    // 4. Sample realistic orders for dashboard preview
    const sampleOrders = [
      {
        orderNumber: 'HEBA-9842',
        customer: {
          fullName: 'محمود عبد الرحمن',
          phone: '01012345678',
          secondaryPhone: '01234567890',
          governorate: 'القاهرة',
          city: 'مدينة نصر',
          address: 'شارع عباس العقاد بجوار مول سيتي ستارز',
          notes: 'يرجى الاتصال قبل الوصول بنصف ساعة'
        },
        items: [
          {
            productId: 'heba-layl',
            name: 'هيبة الليل',
            selectedSize: '100 مل',
            price: 750,
            quantity: 1,
            total: 750
          },
          {
            productId: 'heba-street',
            name: 'هيبة الشارع',
            selectedSize: '50 مل',
            price: 380,
            quantity: 1,
            total: 380
          }
        ],
        subtotal: 1130,
        shippingCost: 40,
        discountAmount: 50,
        couponCode: 'ELHAYBA',
        total: 1120,
        paymentMethod: 'cod',
        status: 'shipped',
        isGift: false,
        createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
        statusUpdates: [
          { status: 'pending', updatedAt: new Date(Date.now() - 3600000 * 18).toISOString(), note: 'تم استلام الأوردر بنجاح' },
          { status: 'preparing', updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(), note: 'تم تغليف الأوردر في الكرتون الكرافت الفاخر' },
          { status: 'shipped', updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(), note: 'تم تسليم الأوردر لمندوب الشحن' }
        ]
      },
      {
        orderNumber: 'HEBA-9843',
        customer: {
          fullName: 'سارة طارق إبراهيم',
          phone: '01198765432',
          governorate: 'الجيزة',
          city: 'الشيخ زايد',
          address: 'كمبوند الياسمين، عمارة 14 شقة 6',
          notes: 'هدية عيد ميلاد، يرجى كتابة كارت الإهداء بدقة'
        },
        items: [
          {
            productId: 'heba-royal-box',
            name: 'بوكس هيبة الملكي الكامل (عرض الهدايا)',
            selectedSize: 'بوكس عطرين (50 مل + 50 مل)',
            price: 799,
            quantity: 1,
            total: 799
          }
        ],
        subtotal: 799,
        shippingCost: 40,
        discountAmount: 0,
        total: 839,
        paymentMethod: 'instapay',
        status: 'preparing',
        isGift: true,
        giftMessage: 'كل سنة وأنت طيب يا غالي، وأحلى هيبة تليق بيك يا سندي ❤️',
        createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
        statusUpdates: [
          { status: 'pending', updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(), note: 'تم استلام الأوردر وتأكيد التحويل على إنستاباي' },
          { status: 'preparing', updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(), note: 'جاري تجهيز الصندوق وكتابة كارت الإهداء' }
        ]
      },
      {
        orderNumber: 'HEBA-9844',
        customer: {
          fullName: 'أحمد حسام الشناوي',
          phone: '01200001122',
          governorate: 'الإسكندرية',
          city: 'سموحة',
          address: 'شارع فوزي معاذ بجوار مسجد علي بن أبي طالب',
          notes: 'التسليم بعد الساعة 5 مساءً'
        },
        items: [
          {
            productId: 'heba-king',
            name: 'هيبة الملك',
            selectedSize: '50 مل',
            price: 500,
            quantity: 1,
            total: 500
          }
        ],
        subtotal: 500,
        shippingCost: 45,
        discountAmount: 45,
        couponCode: 'FREE',
        total: 500,
        paymentMethod: 'cod',
        status: 'pending',
        isGift: false,
        createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
        statusUpdates: [
          { status: 'pending', updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(), note: 'طلب جديد في انتظار المراجعة' }
        ]
      }
    ];

    for (const order of sampleOrders) {
      const docRef = adminDb.collection('orders').doc(order.orderNumber);
      batch.set(docRef, {
        ...order,
        id: order.orderNumber
      }, { merge: true });
    }

    await batch.commit();

    return NextResponse.json({
      success: true,
      message: 'تم زراعة بيانات متجر هيبة بنجاح في Firebase Firestore! 🎉',
      productsCount: INITIAL_PRODUCTS.length,
      ordersCount: sampleOrders.length,
      couponsCount: INITIAL_COUPONS.length,
      governoratesCount: EGYPT_GOVERNORATES.length
    });
  } catch (error: any) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'فشل في الاتصال بـ Firebase' },
      { status: 500 }
    );
  }
}
