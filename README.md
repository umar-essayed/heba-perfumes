# 👑 متجر هَيْبَة للعطور (Heba Perfumes)

> **الهَيْبَة مش مجرد ريحة.. دي حضورك اللي بيعلّم في المكان.**  
> متجر إلكتروني متكامل وعصري للعلامة التجارية **"هَيْبَة للعطور"** (الإسكندرية - العامرية ثان)، مصمم بهوية الفخامة الهادئة (**Quiet Luxury**) وتجربة مستخدم مصرية أصيلة، مع تكامل حي 100% مع **Google Firebase Firestore**، ونظام حماية وإدارة شامل لكافة العمليات.

---

## 📞 بيانات المتجر الرسمية
- **المقر والمحافظة:** مصر - الإسكندرية - العامرية ثان
- **خدمة العملاء والواتساب:** `01003508854` (تواصل مباشر عبر الويب بضغطة زر)
- **حق المعاينة:** فحص وتجربة واستنشاق العطر مع المندوب قبل الاستلام والدفع

---

## 💎 الكتالوج الرسمي (22 عطر معتمد)
تم تصنيف الكتالوج بالكامل وفقاً للقائمة الرسمية مع تخصيص صور البليس هولدر حسب الفئة:
1. **عطور رجالية (14 عطر):**
   - سوفاج (Sauvage)، إنفيكتوس (Invictus)، كريد أوفينتوس (Aventus Creed)، أرماني كود (Armani Code)، ون مليون (1 Million)، توم فورد توباكو فانيلا (Tobacco Vanille)، بلو دي شانيل (Bleu de Chanel)، ديور هوم إنتنس (Dior Homme Intense)، فهرنهايت (Fahrenheit)، سكاندال رجالي (Scandal Men)، 212 في آي بي (212 VIP)، مونت بلانك ليجند (Montblanc Legend)، جريس ديور (Gris Dior)، لاكوست الأبيض (Lacoste White).
2. **عطور حريمية (6 عطور):**
   - سيو أرماني (Si Armani)، بلاك أوبيوم (Black Opium)، جود جيرل (Good Girl)، إيروس بور فيم (Eros Pour Femme)، يارا لطافة (Yara Lattafa)، سكاندال حريمي (Scandal Women).
3. **عطور للجنسين / ميكس (عطرين):**
   - بكارات روج 540 (Baccarat Rouge 540)، أمواج إنترلود (Amouage Interlude).

---

## 🛠️ التقنيات المستخدمة (Tech Stack)
- **Framework:** Next.js 14 (App Router, Server & Client Components)
- **Language:** TypeScript 5 (Strict Type Checking)
- **Styling:** Tailwind CSS (Dark Slate, Warm Gold `#C5A880`, Royal Bronze)
- **Animations:** Framer Motion & Lucide React Icons
- **Database & Backend:**
  - **Firebase Firestore** (قاعدة بيانات حية لتخزين المنتجات والطلبات والكوبونات)
  - **Firebase Admin SDK** (عمليات السيرفر الآمنة عبر Service Account)
  - **Firebase Client SDK**
- **Security:**
  - بوابة دخول مشفرة بكلمة مرور وتوكنات HMAC ذات توقيع رقمي زمني
  - حماية مدمجة من التخمين المتكرر (Rate Limiting - 5 محاولات بحد أقصى)
  - حجب الأسعار تماماً من بطاقات المشاركة والميتاداتا (OpenGraph / Twitter)

---

## 🚀 التشغيل السريع محلياً (Quick Start)

### 1. تثبيت الحزم
```bash
npm install
```

### 2. إعداد متغيرات البيئة
انسخ ملف الإعدادات:
```bash
cp .env.example .env.local
```
تأكد من وجود ملف `heba-7747d-firebase-adminsdk-fbsvc-f410094cd3.json` في المجلد الرئيسي لتشغيل Firebase Admin محلياً.

### 3. زراعة البيانات في Firestore (Seeding)
يقوم هذا الأمر برفع الـ 22 عطراً والكوبونات والمحافظات المصرية الـ 25 إلى Firebase Firestore:
```bash
npm run seed
```

### 4. تشغيل خادم التطوير
```bash
npm run dev
```
- **المتجر:** [http://localhost:3000](http://localhost:3000)
- **تتبع الطلبات:** [http://localhost:3000/track-order](http://localhost:3000/track-order)
- **لوحة التحكم:** [http://localhost:3000/admin](http://localhost:3000/admin) (كلمة المرور: `heba2026`)

---

## 🧪 منظومة الاختبارات الآلية (Testing Suite)

### 1. اختبارات الـ Unit والأمان والكتالوج
```bash
npm test
```
*تتحقق من: كلمات المرور، توكنات HMAC، الـ Rate Limiting، صحة السلة والـ LocalStorage، مطابقة الـ 22 عطراً، حجب السعر من الميتاداتا، وتنسيق رسائل الواتساب.*

### 2. اختبار دورة الحياة الشاملة في Firebase Firestore (End-to-End Test)
```bash
npm run test:e2e
```
*يختبر آلياً دورة حياة المتجر وقاعدة البيانات بنسبة 100% تشمل:*
1. فحص الاتصال بـ Firestore وقراءة الكتالوج والكوبونات.
2. التحقق من كود الخصم (`HEBA10`).
3. إنشاء أوردر حقيقي وحفظه في Firestore.
4. تتبع الأوردر برقم الطلب وبكافة صيغ أرقام التليفون المصرية (+20).
5. تسجيل دخول الإدارة والحصول على توكن الجلسة.
6. إدارة وتحديث حالة الطلب (جديد ⬅️ تجهيز ⬅️ شحن ⬅️ تسليم) وحفظ الخط الزمني في Firestore.
7. التحقق من ظهور التحديثات الأربعة للمستخدم في صفحة التتبع.
8. حذف وتطهير طلب الاختبار نهائياً من Firestore والتأكد من إرجاع 404.

---

## 🔐 لوحة التحكم الإدارية (`/admin`)
- **عزل تام عن واجهة المتجر:** إخفاء تلقائي للنافبار والفووتر وزر الواتساب والسلة لتوفير مساحة عمل إدارية متكاملة.
- **إدارة الطلبات (Orders CRUD):** استعراض حي، فلترة الحالات، إنشاء طلب يدوي، طباعة فاتورة وبوليصة شحن، تحديث الحالات بضغطة زر، وحذف الطلب.
- **إدارة المنتجات (Products CRUD):** إضافة عطر جديد، تعديل بيانات وأسعار ونوتات العطر، وتفعيل/تعطيل المخزون (`inStock`).
- **إدارة الكوبونات (Coupons CRUD):** إنشاء كوبون خصم جديد، تحديد نوع الخصم (نسبة مئوية أو مبلغ ثابت)، وتفعيل أو إلغاء الكوبون.

---

## 📦 خطوات التوثيق والرفع إلى GitHub و Vercel

### 1. تهيئة مستودع Git محلي
```bash
git init
git add .
git commit -m "feat: complete heba perfumes store with quiet luxury ui, firestore e2e integration, and full admin crud"
```

### 2. الربط مع مستودع GitHub بعيد
```bash
git remote add origin https://github.com/YOUR_USERNAME/heba-perfumes.git
git branch -M main
git push -u origin main
```
*(ملاحظة أمنية هامة: تم تضمين مفتاح الـ Firebase الخاص والملفات السرية في `.gitignore` لمنع رفعها إلى GitHub بالخطأ).*

### 3. النشر على Vercel
1. استورد المشروع من حسابك على GitHub إلى لوحة تحكم Vercel.
2. في إعدادات البيئة (Environment Variables)، أضف:
   - `ADMIN_PASSWORD` = `heba2026` (أو كلمتك السرية المختارة).
   - `ADMIN_SESSION_SECRET` = سلسلة نصية طويلة عشوائية.
   - `FIREBASE_PROJECT_ID` = `heba-7747d`.
   - محتوى ملف الـ Service Account بصيغة JSON داخل متغير `FIREBASE_SERVICE_ACCOUNT_JSON` إذا رغبت في وضعه مباشرة.
3. اضغط **Deploy**.

---
*تم تطوير وتجهيز المشروع وفق أعلى معايير الجودة والأمان والأداء.*
