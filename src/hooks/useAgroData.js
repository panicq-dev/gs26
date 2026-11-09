import { useCallback, useEffect, useState } from 'react';
import {
  createSupply as insertSupply,
  deleteSupply as removeSupply,
  listSupplies,
  updateSupply as saveSupply,
} from '../data/agroRepository.js';
import { INITIAL_SUPPLIES } from '../data/mockAgroData.js';

export function useAgroData() {
  const [supplies, setSupplies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    listSupplies(INITIAL_SUPPLIES)
      .then((records) => {
        if (active) {
          setSupplies(records);
        }
      })
      .catch((loadError) => {
        console.error('Falha ao carregar o estoque agrícola.', loadError);

        if (active) {
          setSupplies(INITIAL_SUPPLIES);
          setError(loadError.message || 'Não foi possível carregar o estoque.');
        }
      })
      .finally(() => {
        if (active) {
          setIsLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const createSupply = useCallback(async (supply) => {
    try {
      const createdSupply = await insertSupply(supply);
      setSupplies((current) => [...current, createdSupply]);
      setError('');
      return createdSupply;
    } catch (mutationError) {
      setError(mutationError.message || 'Não foi possível cadastrar o insumo.');
      throw mutationError;
    }
  }, []);

  const updateSupply = useCallback(async (id, updates) => {
    try {
      const updatedSupply = await saveSupply(id, updates);
      setSupplies((current) =>
        current.map((supply) => (supply.id === id ? updatedSupply : supply))
      );
      setError('');
      return updatedSupply;
    } catch (mutationError) {
      setError(mutationError.message || 'Não foi possível atualizar o insumo.');
      throw mutationError;
    }
  }, []);

  const deleteSupply = useCallback(async (id) => {
    try {
      await removeSupply(id);
      setSupplies((current) => current.filter((supply) => supply.id !== id));
      setError('');
    } catch (mutationError) {
      setError(mutationError.message || 'Não foi possível excluir o insumo.');
      throw mutationError;
    }
  }, []);

  return { supplies, isLoading, error, createSupply, updateSupply, deleteSupply };
}
