import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyStockMovement,
  calculateSupply,
  getInventoryStatus,
} from './inventory.js';

const supply = {
  id: 's-01',
  name: 'Fertilizante',
  category: 'Fertilizante',
  currentStock: 100,
  unit: 'kg',
  minimumSafeStock: 50,
  consumptionPerDay: 10,
  daysRemaining: 10,
  targetTalhoes: [],
  lastSupplier: 'Cooperativa',
  status: 'optimal',
};

test('calculates remaining stock and classifies its safety threshold', () => {
  assert.deepEqual(calculateSupply(supply), { ...supply, daysRemaining: 10 });
  assert.equal(getInventoryStatus(39, 50), 'critical');
  assert.equal(getInventoryStatus(50, 50), 'warning');
  assert.equal(getInventoryStatus(51, 50), 'optimal');
});

test('applies incoming and outgoing stock movements', () => {
  assert.equal(applyStockMovement(supply, 'entrada', 15).currentStock, 115);
  assert.equal(applyStockMovement(supply, 'saida', 20).currentStock, 80);
  assert.equal(applyStockMovement(supply, 'saida', 61).status, 'critical');
});

test('rejects invalid supply information and impossible stock movements', () => {
  assert.throws(() => calculateSupply({ ...supply, currentStock: -1 }), /não negativos/);
  assert.throws(() => calculateSupply({ ...supply, name: '  ' }), /nome/);
  assert.throws(() => applyStockMovement(supply, 'entrada', 0), /maior que zero/);
  assert.throws(() => applyStockMovement(supply, 'saida', 101), /estoque disponível/);
});
