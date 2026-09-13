import test from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_PRODUCTS } from '../src/lib/data/initialProducts.ts';

test('Catalog: Exactly 22 official perfumes are loaded', () => {
  assert.equal(INITIAL_PRODUCTS.length, 22, 'Must have exactly 22 perfumes from menu');
});

test('Catalog: Category distribution matches perfume-menue.md specification', () => {
  const men = INITIAL_PRODUCTS.filter(p => p.gender === 'رجالي' || p.gender === 'رجال');
  const women = INITIAL_PRODUCTS.filter(p => p.gender === 'حريمي' || p.gender === 'نساء');
  const mix = INITIAL_PRODUCTS.filter(p => p.gender === 'الاتنين' || p.gender === 'للجنسين');

  assert.equal(men.length, 7, 'Must have 7 Men perfumes');
  assert.equal(women.length, 9, 'Must have 9 Women perfumes');
  assert.equal(mix.length, 6, 'Must have 6 Mix/Unisex perfumes');
  assert.equal(men.length + women.length + mix.length, 22);
});

test('Catalog: Image placeholders are strictly assigned per category', () => {
  for (const product of INITIAL_PRODUCTS) {
    if (product.gender === 'رجالي') {
      assert.equal(
        product.image,
        '/images/perfume-placeholder.jpeg',
        `Men perfume ${product.name} must use perfume-placeholder.jpeg`
      );
    } else if (product.gender === 'حريمي') {
      assert.equal(
        product.image,
        '/images/perfume-placeholde-women.jpeg',
        `Women perfume ${product.name} must use perfume-placeholde-women.jpeg`
      );
    } else if (product.gender === 'الاتنين') {
      assert.equal(
        product.image,
        '/images/perfume-womenandmen.jpeg',
        `Mix perfume ${product.name} must use perfume-womenandmen.jpeg`
      );
    }
  }
});

test('Metadata & Share: Product metadata description & share text strictly EXCLUDE price', () => {
  for (const product of INITIAL_PRODUCTS) {
    const description = product.description || '';
    const tagline = product.tagline || '';

    // Verify description has no price tags or 'ج.م' or numbers followed by 'جنيه'
    assert.doesNotMatch(
      description,
      /\d+\s*(ج\.م|جنيه|EGP)/i,
      `Product ${product.name} description must not leak price`
    );

    // Share payload text format
    const shareText = `${product.name} - ${product.description}`;
    assert.doesNotMatch(
      shareText,
      /\d+\s*(ج\.م|جنيه|EGP)/i,
      `Product ${product.name} share payload must not contain price`
    );
  }
});
