const test = require('node:test');
const assert = require('node:assert');
const path = require('path');
const { loadBandsFromCsv } = require('../../src/data/csvBandRepository');

test('loadBandsFromCsv parses bands', () => {
  const csvPath = path.join(__dirname, 'bands.csv');
  const bands = loadBandsFromCsv(csvPath);
  assert.strictEqual(bands.length, 3);
  assert.strictEqual(bands[0].name, 'BandA');
  assert.strictEqual(bands[0].duration, 10);
  assert.strictEqual(bands[0].availability[1][10], true);
  assert.strictEqual(bands[0].availability[1][11], false);
});

test('loadBandsFromCsv handles BOM, unknown headers, and blank lines', () => {
  const csvPath = path.join(__dirname, 'bands_mixed.csv');
  const bands = loadBandsFromCsv(csvPath);
  assert.strictEqual(bands.length, 2);
  assert.strictEqual(bands[0].name, 'BandA');
  assert.strictEqual(bands[0].duration, 10);
  assert.strictEqual(bands[1].name, 'BandB');
});