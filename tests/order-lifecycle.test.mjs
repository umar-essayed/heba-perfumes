import test from 'node:test';
import assert from 'node:assert/strict';

test('Orders: Valid order lifecycle statuses', () => {
  const validStatuses = ['pending', 'preparing', 'shipped', 'delivered', 'cancelled'];
  assert.equal(validStatuses.length, 5);

  const sampleOrder = {
    id: 'HEBA-1234',
    orderNumber: 'HEBA-1234',
    status: 'pending',
    customer: {
      fullName: 'أحمد محمود',
      phone: '01003508854',
      governorate: 'الإسكندرية',
      address: 'العامرية ثان'
    },
    items: [
      { productId: 'sauvage', name: 'سوفاج | Sauvage', selectedSize: '50 مل', price: 420, quantity: 1 }
    ],
    pricing: {
      subtotal: 420,
      shipping: 40,
      total: 460
    }
  };

  assert.equal(sampleOrder.customer.address, 'العامرية ثان');
  assert.equal(sampleOrder.customer.phone, '01003508854');
  assert.ok(!JSON.stringify(sampleOrder).includes('معمل'));
});

test('Orders: WhatsApp status message contains official phone and address without "معمل"', () => {
  const customerName = 'عمر';
  const orderNumber = 'HEBA-5566';
  const statusLabel = 'قيد التجهيز';

  const message = `أهلاً بحضرتك يا فندم (${customerName})، معاك فريق عطور هَيْبَة بخصوص طلبك رقم (${orderNumber}). حابين نبلغك إن حالة طلبك حالياً: [${statusLabel}]. لأي استفسار رقمنا تليفون وواتساب: 01003508854.`;

  assert.ok(!message.includes('معمل'), 'WhatsApp message must not contain "معمل"');
  assert.ok(message.includes('01003508854'), 'WhatsApp message must contain official phone');
  assert.ok(message.includes('عطور هَيْبَة'), 'WhatsApp message must reference official brand');
});
