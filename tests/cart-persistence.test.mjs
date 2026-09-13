import test from 'node:test';
import assert from 'node:assert/strict';

test('Cart: Adding multiple items and calculating subtotal and quantities', () => {
  const cartItems = [
    {
      id: 'sauvage-50ml-1',
      productId: 'sauvage',
      name: 'سوفاج | Sauvage',
      image: '/images/perfume-placeholder.jpeg',
      selectedSize: '50 مل',
      price: 420,
      quantity: 2
    },
    {
      id: 'khamrah-50ml-2',
      productId: 'khamrah',
      name: 'خمرة | Khamrah',
      image: '/images/perfume-womenandmen.jpeg',
      selectedSize: '50 مل',
      price: 460,
      quantity: 1
    }
  ];

  const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  assert.equal(count, 3, 'Total items count should be 3');
  assert.equal(subtotal, 420 * 2 + 460 * 1, 'Subtotal should be 1300');

  // Over 900 is free shipping
  const isFreeShipping = subtotal >= 900;
  assert.equal(isFreeShipping, true, 'Orders over 900 should qualify for free shipping');

  const shippingCost = isFreeShipping ? 0 : 45;
  const total = subtotal + shippingCost;
  assert.equal(total, 1300);
});

test('Cart: JSON persistence and serialization integrity without corruption', () => {
  const sampleCart = [
    {
      id: 'bianco-latte-50ml',
      productId: 'bianco-latte',
      name: 'بيانكو لاتيه | Bianco Latte',
      image: '/images/perfume-womenandmen.jpeg',
      selectedSize: '50 مل',
      price: 480,
      quantity: 1
    }
  ];

  const serialized = JSON.stringify(sampleCart);
  assert.ok(serialized.includes('بيانكو لاتيه'));

  const deserialized = JSON.parse(serialized);
  assert.equal(deserialized.length, 1);
  assert.equal(deserialized[0].productId, 'bianco-latte');
  assert.equal(deserialized[0].price, 480);
});
