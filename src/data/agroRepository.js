import {
  isSupabaseConfigured,
  supabase,
  supabaseConfigurationError,
} from '../lib/supabase.js';

const TABLE = 'agro_supplies';
const STORAGE_KEY = 'campoalto:agro-supplies';
const DATABASE_COLUMNS = {
  currentStock: 'current_stock',
  minimumSafeStock: 'minimum_safe_stock',
  consumptionPerDay: 'consumption_per_day',
  daysRemaining: 'days_remaining',
  targetTalhoes: 'target_talhoes',
  lastSupplier: 'last_supplier',
};

export async function listSupplies(initialSupplies) {
  assertSupabaseConfiguration();

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      throw new Error(`Não foi possível consultar os insumos no Supabase: ${error.message}`);
    }

    if (data.length > 0) {
      return data.map(deserializeSupply);
    }

    const savedSupplies = window.localStorage.getItem(STORAGE_KEY);
    const suppliesToSeed =
      savedSupplies === null ? initialSupplies : JSON.parse(savedSupplies);
    const { data: seededSupplies, error: seedError } = await supabase
      .from(TABLE)
      .upsert(suppliesToSeed.map(serializeSupply), { onConflict: 'id' })
      .select();

    if (seedError) {
      throw new Error(`Não foi possível inicializar o estoque no Supabase: ${seedError.message}`);
    }

    return seededSupplies.map(deserializeSupply);
  }

  const savedSupplies = window.localStorage.getItem(STORAGE_KEY);
  if (savedSupplies !== null) {
    return JSON.parse(savedSupplies);
  }

  persistSupplies(initialSupplies);
  return initialSupplies;
}

export async function createSupply(supply) {
  assertSupabaseConfiguration();

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from(TABLE)
      .insert(serializeSupply(supply))
      .select()
      .single();

    if (error) {
      throw new Error(`Não foi possível cadastrar o insumo: ${error.message}`);
    }

    return deserializeSupply(data);
  }

  const supplies = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
  const createdSupply = { ...supply, id: supply.id ?? crypto.randomUUID() };
  persistSupplies([...supplies, createdSupply]);
  return createdSupply;
}

export async function updateSupply(id, updates) {
  assertSupabaseConfiguration();

  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from(TABLE)
      .update(serializeSupply(updates))
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Não foi possível atualizar o insumo: ${error.message}`);
    }

    return deserializeSupply(data);
  }

  const supplies = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
  const updatedSupply = supplies.find((supply) => supply.id === id);

  if (!updatedSupply) {
    throw new Error('O insumo que você tentou atualizar não existe mais.');
  }

  const replacement = { ...updatedSupply, ...updates };
  persistSupplies(supplies.map((supply) => (supply.id === id ? replacement : supply)));
  return replacement;
}

export async function deleteSupply(id) {
  assertSupabaseConfiguration();

  if (isSupabaseConfigured) {
    const { error } = await supabase.from(TABLE).delete().eq('id', id);

    if (error) {
      throw new Error(`Não foi possível excluir o insumo: ${error.message}`);
    }

    return;
  }

  const supplies = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]');
  const remainingSupplies = supplies.filter((supply) => supply.id !== id);

  if (remainingSupplies.length === supplies.length) {
    throw new Error('O insumo que você tentou excluir não existe mais.');
  }

  persistSupplies(remainingSupplies);
}

function persistSupplies(supplies) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(supplies));
}

function assertSupabaseConfiguration() {
  if (supabaseConfigurationError) {
    throw new Error(supabaseConfigurationError);
  }
}

function serializeSupply(supply) {
  return Object.fromEntries(
    Object.entries(supply).map(([field, value]) => [DATABASE_COLUMNS[field] ?? field, value])
  );
}

function deserializeSupply(supply) {
  const fieldNames = Object.fromEntries(
    Object.entries(DATABASE_COLUMNS).map(([camelCase, snakeCase]) => [snakeCase, camelCase])
  );

  return Object.fromEntries(
    Object.entries(supply).map(([field, value]) => [fieldNames[field] ?? field, value])
  );
}
