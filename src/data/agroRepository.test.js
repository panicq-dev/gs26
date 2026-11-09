import test, { afterEach } from 'node:test';
import assert from 'node:assert/strict';
import {
  createSupply,
  deleteSupply,
  listSupplies,
  updateSupply,
} from './agroRepository.js';

const STORAGE_KEY = 'campoalto:agro-supplies';
const previousWindow = globalThis.window;
const storedValues = new Map();

globalThis.window = {
  localStorage: {
    getItem(key) {
      return storedValues.get(key) ?? null;
    },
    setItem(key, value) {
      storedValues.set(key, value);
    },
  },
};

afterEach(() => {
  storedValues.clear();
});

test('lists and locally persists the demonstration stock', async () => {
  const seeds = [{ id: 's-01', name: 'Fertilizante' }];

  assert.deepEqual(await listSupplies(seeds), seeds);
  assert.deepEqual(JSON.parse(storedValues.get(STORAGE_KEY)), seeds);
  assert.deepEqual(await listSupplies([]), seeds);
});

test('creates, reads, updates, and deletes a supply in demonstration mode', async () => {
  const created = await createSupply({
    name: 'Semente',
    currentStock: 8,
  });

  assert.ok(created.id);
  assert.deepEqual(await listSupplies([]), [created]);

  const updated = await updateSupply(created.id, { currentStock: 12 });
  assert.equal(updated.currentStock, 12);
  assert.deepEqual(await listSupplies([]), [updated]);

  await deleteSupply(created.id);
  assert.deepEqual(await listSupplies([]), []);
});

test('reports attempts to edit and delete missing records', async () => {
  await assert.rejects(updateSupply('missing', {}), /não existe/);
  await assert.rejects(deleteSupply('missing'), /não existe/);
});

test.after(() => {
  if (previousWindow === undefined) {
    delete globalThis.window;
  } else {
    globalThis.window = previousWindow;
  }
});
