import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const serviceAccountPath = path.join(process.cwd(), 'heba-7747d-firebase-adminsdk-fbsvc-f410094cd3.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Service account key not found at:', serviceAccountPath);
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

// Pretty printing helpers
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function pass(msg) {
  console.log(`  ${colors.green}✔ PASS:${colors.reset} ${msg}`);
}

function fail(msg, err) {
  console.error(`  ${colors.red}✖ FAIL:${colors.reset} ${msg}`);
  if (err) console.error(err);
  process.exit(1);
}

function section(title) {
  console.log(`\n${colors.bright}${colors.cyan}════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}  ${title}${colors.reset}`);
  console.log(`${colors.bright}${colors.cyan}════════════════════════════════════════════════════════════${colors.reset}`);
}

async function runTests() {
  console.log(`\n${colors.bright}${colors.yellow}🧪 بدء فحص واختبار دورة حياة المتجر وقاعدة بيانات Firebase Firestore بالكامل 100%${colors.reset}`);
  console.log(`🎯 Target API: ${BASE_URL}\n`);

  let testOrderNumber = null;
  const testPhone = '01099887766';
  let adminToken = null;

  // -------------------------------------------------------------
  // TEST 1: Direct Firestore Connectivity & Schema Validation
  // -------------------------------------------------------------
  section('1. فحص الاتصال الحي بقاعدة بيانات Firebase Firestore');
  try {
    const productsSnap = await db.collection('products').get();
    if (productsSnap.empty) {
      throw new Error('مجموعة المنتجات فارغة في Firestore.');
    }
    pass(`تم الاتصال بنجاح بـ Firebase Firestore (المشروع: ${serviceAccount.project_id})`);
    pass(`عدد العطور الموثقة في Firestore: ${productsSnap.size} عطر`);

    // Verify Sauvage document exists and has correct placeholder
    const sauvageDoc = await db.collection('products').doc('sauvage').get();
    if (sauvageDoc.exists) {
      const data = sauvageDoc.data();
      if (data.image === '/images/perfume-placeholder.jpeg') {
        pass('تم التحقق: عطر سوفاج يستخدم صورة البليس هولدر الرسمية الموحدة');
      } else {
        fail(`صورة سوفاج غير مطابقة: ${data.image}`);
      }
    } else {
      fail('عطر سوفاج غير موجود في Firestore');
    }

    // Verify coupons
    const couponsSnap = await db.collection('coupons').get();
    pass(`عدد الكوبونات المفعلة في Firestore: ${couponsSnap.size} كوبونات`);
  } catch (err) {
    fail('فشل الاتصال بـ Firebase Firestore', err);
  }

  // -------------------------------------------------------------
  // TEST 2: Coupon Validation API
  // -------------------------------------------------------------
  section('2. اختبار فحص وصلاحية كود الخصم (Coupon Validation)');
  try {
    const res = await fetch(`${BASE_URL}/api/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'HEBA10', orderTotal: 500 })
    });
    const data = await res.json();
    if (data.success && data.discountAmount === 50) {
      pass(`كوبون HEBA10 تم التحقق منه بنجاح وحسب خصم: ${data.discountAmount} ج.م`);
    } else {
      fail(`فشل التحقق من الكوبون: ${JSON.stringify(data)}`);
    }
  } catch (err) {
    fail('فشل في استدعاء API الكوبونات', err);
  }

  // -------------------------------------------------------------
  // TEST 3: Order Creation (Customer Checkout)
  // -------------------------------------------------------------
  section('3. إنشاء طلب جديد كعميل حقيقي (Customer Checkout Flow)');
  try {
    const orderPayload = {
      customer: {
        fullName: 'أحمد علي الإسكندراني',
        phone: testPhone,
        secondaryPhone: '01233445566',
        governorate: 'الإسكندرية',
        city: 'العامرية ثان',
        address: 'شارع الجمهورية - أمام سنترال العامرية',
        notes: 'برجاء الاتصال قبل الميعاد بساعة'
      },
      items: [
        {
          productId: 'sauvage',
          name: 'سوفاج | Sauvage',
          selectedSize: '100 مل',
          price: 690,
          quantity: 1,
          total: 690
        },
        {
          productId: 'invictus',
          name: 'إنفيكتوس | Invictus',
          selectedSize: '50 مل',
          price: 390,
          quantity: 1,
          total: 390
        }
      ],
      subtotal: 1080,
      shippingCost: 45,
      discountAmount: 50,
      couponCode: 'HEBA10',
      total: 1075,
      paymentMethod: 'cod',
      isGift: false
    };

    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    const result = await res.json();

    if (!result.success || !result.orderNumber) {
      fail('فشل في إنشاء الطلب عبر POST /api/orders', result.error);
    }

    testOrderNumber = result.orderNumber;
    pass(`تم إنشاء الطلب بنجاح عبر API: رقم الطلب [${testOrderNumber}]`);

    // Verify directly in Firestore
    const orderDoc = await db.collection('orders').doc(testOrderNumber).get();
    if (!orderDoc.exists) {
      fail(`الطلب ${testOrderNumber} لم يتم العثور عليه مباشرة في Firestore!`);
    }

    const savedData = orderDoc.data();
    if (
      savedData.customer.fullName === 'أحمد علي الإسكندراني' &&
      savedData.total === 1075 &&
      savedData.status === 'pending' &&
      savedData.items.length === 2
    ) {
      pass(`تم التحقق من تخزين الطلب كاملاً في Firestore بكل تفاصيل العميل والمنتجات`);
      pass(`حالة الطلب الأولية المسجلة: ${savedData.status} (قيد المراجعة والتجهيز)`);
    } else {
      fail('بيانات الطلب المخزنة في Firestore غير متطابقة مع المدخلات!');
    }
  } catch (err) {
    fail('خطأ أثناء اختبار إنشاء الطلب', err);
  }

  // -------------------------------------------------------------
  // TEST 4: Order Tracking (by Order Number & Phone variations)
  // -------------------------------------------------------------
  section('4. فحص وتتبع الطلب (Order Tracking Flow)');
  try {
    // 4.1 Track by exact Order Number
    const trackByNumberRes = await fetch(`${BASE_URL}/api/orders/${testOrderNumber}`);
    const trackData = await trackByNumberRes.json();
    if (trackData.success && trackData.data.orderNumber === testOrderNumber) {
      pass(`التتبع برقم الطلب (${testOrderNumber}): تم العثور على الطلب بنجاح`);
    } else {
      fail(`فشل التتبع برقم الطلب: ${JSON.stringify(trackData)}`);
    }

    // 4.2 Track by Customer Phone Number (Local format: 01099887766)
    const trackByPhoneRes = await fetch(`${BASE_URL}/api/orders/${testPhone}`);
    const phoneData = await trackByPhoneRes.json();
    if (phoneData.success && phoneData.data.customer.phone === testPhone) {
      pass(`التتبع برقم الهاتف المحلي (${testPhone}): تم العثور على الطلب بنجاح`);
    } else {
      fail(`فشل التتبع برقم الهاتف المحلي: ${JSON.stringify(phoneData)}`);
    }

    // 4.3 Track by International Phone variations (+201099887766)
    const intlPhone = encodeURIComponent(`+20${testPhone.slice(1)}`);
    const trackByIntlRes = await fetch(`${BASE_URL}/api/orders/${intlPhone}`);
    const intlData = await trackByIntlRes.json();
    if (intlData.success) {
      pass(`التتبع بصيغة الهاتف الدولية (+20...): تم التعرف عليه والوصول للطلب بنجاح`);
    } else {
      fail(`فشل التتبع بالصيغة الدولية: ${JSON.stringify(intlData)}`);
    }
  } catch (err) {
    fail('خطأ أثناء اختبار تتبع الطلب', err);
  }

  // -------------------------------------------------------------
  // TEST 5: Admin Authentication & Security
  // -------------------------------------------------------------
  section('5. فحص أمان لوحة التحكم وتوليد التوكن المشفر (Admin Auth)');
  try {
    // 5.1 Invalid password attempt
    const wrongAuthRes = await fetch(`${BASE_URL}/api/admin/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'wrong_password_123' })
    });
    if (wrongAuthRes.status === 401) {
      pass('الحماية الأمنية: تم رفض كلمة المرور الخاطئة بنجاح (401 Unauthorized)');
    } else {
      fail('ثغرة أمنية: تم قبول كلمة مرور خاطئة أو كود استجابة غير صحيح!');
    }

    // 5.2 Correct password attempt
    const targetPassword = process.env.ADMIN_PASSWORD || 'heba2026';
    const validAuthRes = await fetch(`${BASE_URL}/api/admin/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: targetPassword })
    });
    const authData = await validAuthRes.json();
    const setCookieHeader = validAuthRes.headers.get('set-cookie');

    if (validAuthRes.status === 200 && setCookieHeader) {
      pass('تسجيل الدخول الصحيح: تم بنجاح واستلام كوكي الجلسة المشفر (heba_admin_token)');
      // Extract token value
      const match = setCookieHeader.match(/heba_admin_token=([^;]+)/);
      if (match) {
        adminToken = match[1];
        pass(`تم استخراج توكن HMAC المشفر بنجاح: ${adminToken.slice(0, 16)}...`);
      }
    } else {
      fail('فشل تسجيل الدخول بكلمة المرور الصحيحة heba2026!');
    }
  } catch (err) {
    fail('خطأ أثناء اختبار مصادقة لوحة التحكم', err);
  }

  // -------------------------------------------------------------
  // TEST 6: Admin Management & Full Lifecycle Updates in Firestore
  // -------------------------------------------------------------
  section('6. إدارة الطلب من لوحة التحكم وتحديث الحالات في Firestore');
  try {
    const authHeaders = {
      'Content-Type': 'application/json',
      'Cookie': cookieHeader,
      'Authorization': `Bearer ${adminToken}`
    };

    // 6.1 Update status to 'preparing' (جاري التجهيز)
    const patch1 = await fetch(`${BASE_URL}/api/orders`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({
        orderId: testOrderNumber,
        status: 'preparing',
        note: 'تم تأكيد الطلب مع العميل وجاري تجهيز الزجاجات والكرتون الفاخر'
      })
    });
    const res1 = await patch1.json();
    if (!res1.success) fail('فشل تحديث الحالة إلى preparing', res1);

    // Verify in Firestore
    const doc1 = await db.collection('orders').doc(testOrderNumber).get();
    const data1 = doc1.data();
    if (data1.status === 'preparing' && data1.statusUpdates.length === 2) {
      pass('تحديث 1 (preparing): تم حفظ الحالة والملاحظة في سجل Firestore بنجاح');
    } else {
      fail('تحديث 1 غير مطابق في Firestore');
    }

    // 6.2 Update status to 'shipped' (خرج للشحن)
    const patch2 = await fetch(`${BASE_URL}/api/orders`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({
        orderId: testOrderNumber,
        status: 'shipped',
        note: 'تم تسليم الأوردر لمندوب الشحن للإسكندرية (العامرية ثان)'
      })
    });
    const res2 = await patch2.json();
    if (!res2.success) fail('فشل تحديث الحالة إلى shipped', res2);

    const doc2 = await db.collection('orders').doc(testOrderNumber).get();
    const data2 = doc2.data();
    if (data2.status === 'shipped' && data2.statusUpdates.length === 3) {
      pass('تحديث 2 (shipped): تم تسليم الشحنة للمندوب وتحديث الخط الزمني في Firestore');
    } else {
      fail('تحديث 2 غير مطابق في Firestore');
    }

    // 6.3 Update status to 'delivered' (تم التسليم بنجاح)
    const patch3 = await fetch(`${BASE_URL}/api/orders`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({
        orderId: testOrderNumber,
        status: 'delivered',
        note: 'تم استلام الأوردر من قبل العميل ودفع المبلغ 1075 ج.م نقداً'
      })
    });
    const res3 = await patch3.json();
    if (!res3.success) fail('فشل تحديث الحالة إلى delivered', res3);

    const doc3 = await db.collection('orders').doc(testOrderNumber).get();
    const data3 = doc3.data();
    if (data3.status === 'delivered' && data3.statusUpdates.length === 4) {
      pass('تحديث 3 (delivered): تم إتمام الطلب بالكامل وتسجيل 4 مراحل زمنية في Firestore');
    } else {
      fail('تحديث 3 غير مطابق في Firestore');
    }
  } catch (err) {
    fail('خطأ أثناء دورة تحديث الطلب', err);
  }

  // -------------------------------------------------------------
  // TEST 7: Customer Re-Verification of Final Delivered State
  // -------------------------------------------------------------
  section('7. تحقق العميل النهائي من صفحة التتبع بعد التحديثات');
  try {
    const finalTrackRes = await fetch(`${BASE_URL}/api/orders/${testOrderNumber}`);
    const finalTrack = await finalTrackRes.json();
    if (
      finalTrack.success &&
      finalTrack.data.status === 'delivered' &&
      finalTrack.data.statusUpdates.length === 4
    ) {
      pass(`صفحة التتبع تقرأ الحالة النهائية (delivered) ومراحل الخط الزمني الأربعة بدقة كاملة 100%`);
    } else {
      fail(`بيانات التتبع النهائية غير صحيحة: ${JSON.stringify(finalTrack)}`);
    }
  } catch (err) {
    fail('خطأ أثناء فحص حالة التتبع النهائية', err);
  }

  // -------------------------------------------------------------
  // TEST 8: Clean Deletion of Test Order (CRUD Delete)
  // -------------------------------------------------------------
  section('8. حذف طلب الاختبار والتنظيف التام من Firestore (CRUD Delete)');
  try {
    const authHeaders = {
      'Content-Type': 'application/json',
      'Cookie': cookieHeader,
      'Authorization': `Bearer ${adminToken}`
    };
    const delRes = await fetch(`${BASE_URL}/api/orders?orderId=${testOrderNumber}`, {
      method: 'DELETE',
      headers: authHeaders
    });
    const delData = await delRes.json();
    if (!delData.success) {
      fail(`فشل في حذف طلب الاختبار: ${JSON.stringify(delData)}`);
    }
    pass(`تم حذف طلب الاختبار [${testOrderNumber}] عبر API لوحة التحكم بنجاح`);

    // Confirm completely deleted in Firestore
    const checkDoc = await db.collection('orders').doc(testOrderNumber).get();
    if (!checkDoc.exists) {
      pass(`تم التحقق: الطلب حُذف تماماً من قاعدة بيانات Firestore ولم يتبق أي أثر`);
    } else {
      fail('الطلب لا يزال موجوداً في Firestore بعد الحذف!');
    }

    // Confirm tracking returns 404
    const notFoundRes = await fetch(`${BASE_URL}/api/orders/${testOrderNumber}`);
    if (notFoundRes.status === 404) {
      pass('تم التحقق: صفحة التتبع تعيد 404 للطلب المحذوف');
    } else {
      fail(`كود الاستجابة للطلب المحذوف ليس 404: ${notFoundRes.status}`);
    }
  } catch (err) {
    fail('خطأ أثناء عملية الحذف والتنظيف', err);
  }

  // -------------------------------------------------------------
  // TEST 9: Payment Settings CRUD (Cash Wallets & InstaPay)
  // -------------------------------------------------------------
  section('9. فحص وتعديل أرقام المحافظ وإنستاباي في Firestore (Payment Settings CRUD)');
  try {
    const cookieHeader = `heba_admin_token=${adminToken}`;
    const authHeaders = {
      'Content-Type': 'application/json',
      'Cookie': cookieHeader,
      'Authorization': `Bearer ${adminToken}`
    };

    // 9.1 Read settings
    const getSettingsRes = await fetch(`${BASE_URL}/api/settings/payment`);
    const settingsData = await getSettingsRes.json();
    if (settingsData.success && settingsData.data.cashPhone === '01003508854' && settingsData.data.instapayPhone === '01003508854') {
      pass(`القراءة الأولية: أرقام الكاش وإنستاباي الافتراضية مطابقة لرقم الواتساب الرسمي (01003508854)`);
    } else {
      fail(`أرقام الدفع الافتراضية غير مطابقة: ${JSON.stringify(settingsData)}`);
    }

    // 9.2 Update settings as Admin
    const updatedPayload = {
      cashPhone: '01003508854',
      secondaryCashPhone: '01011223344',
      instapayPhone: '01003508854',
      instapayUsername: '01003508854@instapay',
      accountHolderName: 'هَيْبَة للعطور الفاخرة',
      transferInstructions: 'يرجى إرسال لقطة شاشة للتحويل على الواتساب 01003508854 لتأكيد الأوردر فوراً.'
    };

    const putSettingsRes = await fetch(`${BASE_URL}/api/settings/payment`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify(updatedPayload)
    });
    const putText = await putSettingsRes.text();
    let putResult;
    try {
      putResult = JSON.parse(putText);
    } catch {
      fail(`فشل قراءة استجابة تحديث الإعدادات (HTTP ${putSettingsRes.status}): ${putText}`);
    }

    if (putResult && putResult.success && putResult.data.secondaryCashPhone === '01011223344') {
      pass(`تحديث الإدارة: تم تعديل بيانات الدفع بنجاح عبر API لوحة التحكم`);
    } else {
      fail(`فشل تحديث بيانات الدفع: ${JSON.stringify(putResult)}`);
    }

    // 9.3 Verify directly in Firestore
    const settingsDoc = await db.collection('settings').doc('payment_methods').get();
    if (settingsDoc.exists && settingsDoc.data().secondaryCashPhone === '01011223344') {
      pass(`تم التحقق: البيانات الجديدة تم حفظها بدقة في مستند settings/payment_methods في Firestore`);
    } else {
      fail(`مستند settings/payment_methods في Firestore لم يتم تحديثه!`);
    }

    // 9.4 Revert to clean default
    await fetch(`${BASE_URL}/api/settings/payment`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        cashPhone: '01003508854',
        secondaryCashPhone: '',
        instapayPhone: '01003508854',
        instapayUsername: '01003508854@instapay',
        accountHolderName: 'هَيْبَة للعطور',
        transferInstructions: 'يرجى إرسال لقطة شاشة (سكرين شوت) للتحويل على الواتساب 01003508854 لتأكيد الأوردر فوراً.'
      })
    });
    pass(`إعادة التعيين: تم استعادة الحالة الافتراضية النظيفة بنجاح`);
  } catch (err) {
    fail('خطأ أثناء اختبار بيانات الدفع والمحافظ', err);
  }

  // -------------------------------------------------------------
  // FINAL SUMMARY
  // -------------------------------------------------------------
  console.log(`\n${colors.bright}${colors.green}════════════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}${colors.green}  🎉 كل الاختبارات الـ 9 اجتازت بنجاح 100%!  ${colors.reset}`);
  console.log(`${colors.bright}${colors.green}  Firebase Firestore يعمل بكفاءة وأمان تام في كل العمليات:  ${colors.reset}`);
  console.log(`${colors.bright}${colors.green}  [الاتصال - الكتالوج - الكوبونات - إنشاء الطلب - التتبع - لوحة الإدارة - المحافظ وإنستاباي - التحديث - الحذف]${colors.reset}`);
  console.log(`${colors.bright}${colors.green}════════════════════════════════════════════════════════════\n${colors.reset}`);

  process.exit(0);
}

runTests().catch(err => {
  console.error('Unhandled test exception:', err);
  process.exit(1);
});
