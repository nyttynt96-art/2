# نظام ترقية المستوى الكامل - PromoHive

## 📋 ملخص النظام

نظام كامل لترقية المستوى يتضمن اختيار وسيلة الدفع وإضافة رقم العملية والتحقق من قبل Admin.

---

## ✅ المكونات المضافة

### 1. Database Schema (`prisma/schema.prisma`)

#### PaymentMethod Model:
```prisma
model PaymentMethod {
  id          String    @id @default(cuid())
  name        String    // "USDT (TRC20)"
  type        String    // "Crypto", "Bank", etc.
  address     String    // Wallet address
  network     String?   // "TRC20", "ERC20"
  qrCode      String?   // QR code URL
  isActive    Boolean   @default(true)
  description String?   @db.Text
  metadata    Json?
}
```

#### Updated LevelRequest Model:
```prisma
model LevelRequest {
  id              String             @id @default(cuid())
  userId          String
  requestedLevel  Int
  paymentMethodId String?            // NEW!
  paymentTxHash   String?            // NEW!
  paymentAmount   Decimal?           @db.Decimal(10, 2) // NEW!
  status          LevelRequestStatus @default(PENDING)
  ...
}
```

---

### 2. API Routes

#### For Users:
- **GET** `/api/payment-methods/active` - الحصول على وسائل الدفع المتاحة
- **POST** `/api/user/level-upgrade` - طلب ترقية المستوى مع رقم العملية

#### For Admins:
- **GET** `/api/payment-methods` - جميع وسائل الدفع
- **POST** `/api/payment-methods` - إضافة وسيلة دفع جديدة
- **PUT** `/api/payment-methods/:id` - تحديث وسيلة دفع
- **DELETE** `/api/payment-methods/:id` - حذف وسيلة دفع
- **GET** `/api/admin/level-requests` - طلبات الترقية مع بيانات الدفع
- **POST** `/api/admin/level-requests/:id/process` - معالجة الطلب

---

### 3. مسار العمل الكامل

#### للعميل:
```
1. يختار المستوى المراد ترقيته (L1, L2, L3)
2. النظام يعرض:
   - تكلفة الترقية
   - وسائل الدفع المتاحة (التي حددها Admin)
   - رمز الاستجابة السريعة QR Code
   - عنوان المحفظة
3. العميل يختار وسيلة دفع
4. العميل يرسل المبلغ على العنوان المحدد
5. العميل يدخل رقم العملية (Transaction Hash)
6. العميل يرسل الطلب
7. ينتظر موافقة Admin
```

#### للـ Admin:
```
1. يستقبل طلب الترقية مع:
   - معلومات العميل
   - المستوى المطلوب
   - وسيلة الدفع المختارة
   - عنوان الدفع
   - رقم العملية (TxHash)
   - المبلغ المدفوع
2. Admin يتحقق من:
   - صحة رقم العملية على Blockchain
   - مطابقة المبلغ المطلوب
   - صحة الحساب والعميل
3. Admin يوافق أو يرفض:
   - الموافقة: ترقية المستوى + إرسال بريد موافقة
   - الرفض: إرجاع المبلغ + إرسال بريد رفض مع السبب
```

---

### 4. أمثلة الطلبات

#### طلب ترقية مستوى من العميل:
```json
POST /api/user/level-upgrade
{
  "requestedLevel": 2,
  "paymentMethodId": "crypto-usdt-tron",
  "paymentTxHash": "abc123def456...",
  "paymentAmount": 50.00
}
```

#### الحصول على وسائل الدفع:
```json
GET /api/payment-methods/active

Response:
{
  "success": true,
  "paymentMethods": [
    {
      "id": "crypto-usdt-tron",
      "name": "USDT (TRC20)",
      "type": "Crypto",
      "address": "TXYZ1234...",
      "network": "TRC20",
      "qrCode": "https://...",
      "description": "Send USDT via TRC20"
    }
  ]
}
```

---

### 5. إدارة وسائل الدفع (Admin)

#### إضافة وسيلة دفع:
```json
POST /api/payment-methods
{
  "name": "USDT (TRC20)",
  "type": "Crypto",
  "address": "TXYZ1234567890abcdef...",
  "network": "TRC20",
  "qrCode": "https://api.qrserver.com/v1/create-qr-code/?data=TXYZ...",
  "description": "Pay with USDT via TRC20 network",
  "isActive": true
}
```

#### عرض طلبات الترقية (مع بيانات الدفع):
```json
GET /api/admin/level-requests

Response:
{
  "success": true,
  "levelRequests": [
    {
      "id": "...",
      "user": {
        "username": "john_doe",
        "email": "john@example.com",
        "level": 1
      },
      "requestedLevel": 2,
      "paymentMethod": {
        "name": "USDT (TRC20)",
        "address": "TXYZ...",
        "network": "TRC20"
      },
      "paymentTxHash": "abc123...",
      "paymentAmount": 50.00,
      "status": "PENDING",
      "createdAt": "2024-..."
    }
  ]
}
```

---

## ✅ الأمان والتحقق

### التحقق من صحة البيانات:
- ✅ التحقق من المستوى المطلوب (1-3 فقط)
- ✅ التحقق من وجود وسيلة دفع صالحة
- ✅ التحقق من المبلغ المدفوع ≥ المبلغ المطلوب
- ✅ التحقق من عدم وجود طلب معلق سابق
- ✅ التحقق من صحة رقم العملية (يدوي من Admin)

### منع الإجراءات المتكررة:
- ✅ لا يمكن طلب ترقية مستوى أقل أو مساوٍ
- ✅ لا يمكن عمل طلب جديد مع وجود طلب معلق
- ✅ لا يمكن استخدام وسيلة دفع غير نشطة

---

## 📧 رسائل البريد الإلكتروني

### عند الموافقة:
- ✅ `sendLevelUpgradeApprovedEmail` - بريد موافقة الترقية

### عند الرفض:
- ✅ `sendLevelUpgradeRejectedEmail` - بريد رفض الترقية مع السبب

---

## 🎯 الخطوات المتبقية

1. ✅ إضافة PaymentMethod table
2. ✅ إضافة حقول payment إلى LevelRequest
3. ✅ إنشاء API لوسائل الدفع
4. ✅ تحديث نظام طلب الترقية
5. ✅ تحديث نظام عرض طلبات الترقية
6. ✅ إضافة رسائل بريدية
7. ⏳ إنشاء واجهة المستخدم (Frontend)
8. ⏳ اختبار النظام بالكامل

---

## 🚀 تشغيل النظام

```bash
# تطبيق Migration
npx prisma migrate dev --name add_payment_methods

# توليد Prisma Client
npx prisma generate

# تشغيل النظام
npm run dev
```

---

## 📝 ملاحظات مهمة

1. **Admin يجب أن يحدد وسائل الدفع أولاً** قبل أن يتمكن المستخدمون من طلب الترقية
2. **رقم العملية** يجب أن يتحقق منه Admin يدوياً على Blockchain
3. **المبلغ** يجب أن يطابق تماماً المبلغ المطلوب
4. **النظام يدعم** عدة وسائل دفع متزامنة

---

**🎉 النظام جاهز للتطبيق والاختبار!**

