export function getInventoryStatus(stock, minimumSafeStock) {
  if (stock < minimumSafeStock * 0.8) {
    return 'critical';
  }

  if (stock <= minimumSafeStock) {
    return 'warning';
  }

  return 'optimal';
}

export function calculateSupply(supply) {
  const currentStock = Number(supply.currentStock);
  const minimumSafeStock = Number(supply.minimumSafeStock);
  const consumptionPerDay = Number(supply.consumptionPerDay);

  if (
    !supply.name.trim() ||
    !Number.isFinite(currentStock) ||
    !Number.isFinite(minimumSafeStock) ||
    !Number.isFinite(consumptionPerDay) ||
    currentStock < 0 ||
    minimumSafeStock < 0 ||
    consumptionPerDay < 0
  ) {
    throw new Error('Informe um nome e valores de estoque e consumo válidos e não negativos.');
  }

  return {
    ...supply,
    currentStock: Number(currentStock.toFixed(2)),
    minimumSafeStock: Number(minimumSafeStock.toFixed(2)),
    consumptionPerDay: Number(consumptionPerDay.toFixed(2)),
    daysRemaining:
      consumptionPerDay > 0
        ? Math.floor(currentStock / consumptionPerDay)
        : 99,
    status: getInventoryStatus(currentStock, minimumSafeStock),
  };
}

export function applyStockMovement(supply, movement, quantity) {
  const amount = Number(quantity);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error('Informe uma quantidade de movimentação maior que zero.');
  }

  const currentStock =
    supply.currentStock + (movement === 'entrada' ? amount : -amount);

  if (currentStock < 0) {
    throw new Error('A saída não pode ser maior que o estoque disponível.');
  }

  return calculateSupply({ ...supply, currentStock });
}
