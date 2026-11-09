import { useState } from 'react';
import { CheckCircle2, PackagePlus, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { applyStockMovement, calculateSupply } from '../../domain/inventory.js';

const INITIAL_FORM = {
  name: '',
  category: 'Fertilizante',
  currentStock: '',
  unit: 'kg',
  minimumSafeStock: '',
  consumptionPerDay: '',
  lastSupplier: 'Não informado',
};

const CATEGORIES = [
  'Fertilizante',
  'Inseticida',
  'Biológico',
  'Adjuvante',
  'Desfolhante',
];

const STATUS_LABELS = {
  critical: 'Crítico',
  warning: 'Atenção',
  optimal: 'Seguro',
};

const STATUS_CLASSES = {
  critical: 'border-[#eb7351]/40 bg-[#eb7351]/20 text-[#ff8f70]',
  warning: 'border-[#d1a342]/40 bg-[#d1a342]/20 text-[#ebd173]',
  optimal: 'border-[#639777]/30 bg-[#639777]/20 text-[#8ec7a0]',
};

export function SuppliesTab({
  supplies,
  isLoading,
  onCreateSupply,
  onUpdateSupply,
  onDeleteSupply,
}) {
  const [dialog, setDialog] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);
  const [quantity, setQuantity] = useState('10');
  const [movementType, setMovementType] = useState('saida');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [actionError, setActionError] = useState('');
  const [toast, setToast] = useState('');

  const filteredSupplies = supplies.filter(
    (supply) =>
      supply.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === 'Todos' || supply.category === category)
  );
  const criticalCount = supplies.filter((supply) => supply.status === 'critical').length;
  const warningCount = supplies.filter((supply) => supply.status === 'warning').length;
  const optimalCount = supplies.filter((supply) => supply.status === 'optimal').length;

  const openDialog = (mode, supply = null) => {
    setActionError('');
    setDialog({ mode, supply });
    if (supply && mode === 'edit') {
      setForm({
        name: supply.name,
        category: supply.category,
        currentStock: String(supply.currentStock),
        unit: supply.unit,
        minimumSafeStock: String(supply.minimumSafeStock),
        consumptionPerDay: String(supply.consumptionPerDay),
        lastSupplier: supply.lastSupplier,
      });
    } else {
      setForm(INITIAL_FORM);
    }
    if (mode === 'movement') {
      setQuantity('10');
      setMovementType('saida');
    }
  };

  const closeDialog = () => {
    setDialog(null);
    setActionError('');
  };

  const showSuccess = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 3500);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setActionError('');

    try {
      if (dialog.mode === 'movement') {
        const updatedSupply = applyStockMovement(
          dialog.supply,
          movementType,
          quantity
        );
        await onUpdateSupply(updatedSupply);
        showSuccess('Movimentação registrada e estoque atualizado.');
      } else {
        const supply = calculateSupply({
          ...(dialog.supply ?? { targetTalhoes: [] }),
          ...form,
          id: dialog.supply?.id ?? crypto.randomUUID(),
          targetTalhoes: dialog.supply?.targetTalhoes ?? [],
        });

        if (dialog.mode === 'edit') {
          await onUpdateSupply(supply);
          showSuccess('Insumo atualizado com sucesso.');
        } else {
          await onCreateSupply(supply);
          showSuccess('Insumo cadastrado com sucesso.');
        }
      }

      closeDialog();
    } catch (saveError) {
      setActionError(saveError.message || 'Não foi possível salvar as alterações.');
    }
  };

  const handleDelete = async (supply) => {
    if (!window.confirm(`Excluir o insumo "${supply.name}" do estoque?`)) {
      return;
    }

    setActionError('');
    try {
      await onDeleteSupply(supply.id);
      showSuccess(`${supply.name} foi excluído do estoque.`);
    } catch (deleteError) {
      setActionError(deleteError.message || 'Não foi possível excluir o insumo.');
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 border-b border-[#1f2c22] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#79907c]">
            <span>Armazém & Almoxarifado Central</span>
            <span>·</span>
            <span>Fazenda Santa Helena</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
            Insumos & Controle de Estoque
          </h1>
          <p className="mt-1 text-xs text-[#8ca290]">
            Cadastre, edite e exclua insumos; registre entradas e saídas com atualização automática da autonomia.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => openDialog('create')}
            className="flex items-center gap-1.5 rounded-lg border border-[#70a37e]/40 bg-[#172c1e] px-4 py-2 text-xs font-semibold text-[#b8e8c3] transition-colors hover:bg-[#1f3b29]"
          >
            <Plus className="h-4 w-4" />
            Novo insumo
          </button>
          <button
            type="button"
            disabled={supplies.length === 0}
            onClick={() => openDialog('movement', supplies[0])}
            className="flex items-center gap-1.5 rounded-lg border border-[#2b3a2e] bg-[#141c16] px-4 py-2 text-xs font-semibold text-[#8da290] transition-colors hover:bg-[#1c2a1f] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <PackagePlus className="h-4 w-4" />
            Registrar movimentação
          </button>
        </div>
      </header>

      <section aria-label="Resumo de estoque" className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        {[
          ['Itens com autonomia crítica', criticalCount, 'urgência de compra (< 14 dias)', 'text-[#ff8f70]'],
          ['Itens em nível de atenção', warningCount, 'repor nas próximas semanas', 'text-[#ffd875]'],
          ['Itens com cobertura segura', optimalCount, 'estoque acima do limiar mínimo', 'text-[#9de8b2]'],
        ].map(([label, count, description, color]) => (
          <article key={label} className="rounded-xl border border-[#232f26] bg-[#111713] p-4">
            <span className="text-xs text-[#718574]">{label}</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className={`font-mono text-2xl font-bold ${color}`}>{count}</span>
              <span className={`text-xs ${color} opacity-80`}>{description}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="flex flex-col justify-between gap-3 sm:flex-row">
        <div className="flex flex-wrap gap-1 rounded-lg border border-[#233127] bg-[#121a14] p-1">
          {['Todos', ...CATEGORIES].map((filter) => (
            <button
              type="button"
              key={filter}
              onClick={() => setCategory(filter)}
              className={`rounded-md px-3 py-1 text-xs transition-colors ${
                category === filter
                  ? 'bg-[#223125] text-white shadow'
                  : 'text-[#7e9381] hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <label className="flex items-center rounded-lg border border-[#233127] bg-[#121a14] px-3 py-2 text-xs text-white">
          <Search aria-hidden="true" className="mr-2 h-3.5 w-3.5 text-[#6c8270]" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar insumo..."
            aria-label="Buscar insumo por nome"
            className="w-full bg-transparent placeholder-[#617765] focus:outline-none sm:w-56"
          />
        </label>
      </section>

      {actionError && (
        <p role="alert" className="rounded-lg border border-[#eb7351]/40 bg-[#261914] px-4 py-3 text-xs text-[#ffb39e]">
          {actionError}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-[#222e25] bg-[#111713]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-left text-xs text-[#dce6dc]">
            <thead className="border-b border-[#1f2c22] bg-[#141d16] font-mono text-[10px] uppercase tracking-wider text-[#718574]">
              <tr>
                <th scope="col" className="px-4 py-3">Insumo</th>
                <th scope="col" className="px-4 py-3 text-right">Estoque</th>
                <th scope="col" className="px-4 py-3 text-right">Mínimo</th>
                <th scope="col" className="px-4 py-3 text-right">Consumo/dia</th>
                <th scope="col" className="px-4 py-3 text-right">Autonomia</th>
                <th scope="col" className="px-4 py-3">Fornecedor</th>
                <th scope="col" className="px-4 py-3 text-center">Status</th>
                <th scope="col" className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c271f]">
              {filteredSupplies.map((supply) => (
                <tr key={supply.id} className="transition-colors hover:bg-[#151f17]">
                  <td className="px-4 py-3.5">
                    <strong className="block font-medium text-white">{supply.name}</strong>
                    <span className="text-[11px] text-[#718574]">{supply.category}</span>
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono font-bold text-white tabular-nums">
                    {supply.currentStock} {supply.unit}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-[#8ca08e] tabular-nums">
                    {supply.minimumSafeStock} {supply.unit}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-[#718574] tabular-nums">
                    {supply.consumptionPerDay} {supply.unit}
                  </td>
                  <td className="px-4 py-3.5 text-right font-mono text-[#9de8b2] tabular-nums">
                    {supply.daysRemaining} dias
                  </td>
                  <td className="px-4 py-3.5 text-[#869b89]">{supply.lastSupplier}</td>
                  <td className="px-4 py-3.5 text-center">
                    <span
                      className={`inline-block rounded border px-2 py-0.5 text-[10px] font-mono font-bold uppercase ${STATUS_CLASSES[supply.status]}`}
                    >
                      {STATUS_LABELS[supply.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        aria-label={`Registrar movimentação de ${supply.name}`}
                        title="Registrar movimentação"
                        onClick={() => openDialog('movement', supply)}
                        className="rounded p-1.5 text-[#8da290] hover:bg-[#1a3523] hover:text-white"
                      >
                        <PackagePlus className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Editar ${supply.name}`}
                        title="Editar"
                        onClick={() => openDialog('edit', supply)}
                        className="rounded p-1.5 text-[#8da290] hover:bg-[#1a3523] hover:text-white"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Excluir ${supply.name}`}
                        title="Excluir"
                        onClick={() => handleDelete(supply)}
                        className="rounded p-1.5 text-[#be7561] hover:bg-[#351d17] hover:text-[#ff8f70]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSupplies.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-4 py-10 text-center text-[#8ca290]">
                    {isLoading
                      ? 'Carregando estoque...'
                      : 'Nenhum insumo encontrado. Cadastre um insumo para começar.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {dialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="inventory-dialog-title"
            className="w-full max-w-md rounded-2xl border border-[#2d3f31] bg-[#121a14] p-6 text-[#e0eae0] shadow-2xl"
          >
            <header className="mb-5 flex items-center justify-between border-b border-[#212f24] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#70a37e]">
                  CONTROLE DE ALMOXARIFADO
                </span>
                <h2 id="inventory-dialog-title" className="text-lg font-bold text-white">
                  {dialog.mode === 'movement'
                    ? 'Registrar movimentação'
                    : dialog.mode === 'edit'
                      ? 'Editar insumo'
                      : 'Cadastrar insumo'}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Fechar"
                onClick={closeDialog}
                className="text-[#8ca290] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {dialog.mode === 'movement' ? (
                <>
                  <p className="text-[#8ca290]">{dialog.supply.name}</p>
                  <p className="text-[#718574]">
                    Estoque atual: {dialog.supply.currentStock} {dialog.supply.unit}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      ['saida', 'Saída para pulverização'],
                      ['entrada', 'Entrada de material'],
                    ].map(([type, label]) => (
                      <button
                        type="button"
                        key={type}
                        onClick={() => setMovementType(type)}
                        aria-pressed={movementType === type}
                        className={`rounded-lg border px-2 py-2 font-semibold transition-colors ${
                          movementType === type
                            ? 'border-[#70a37e] bg-[#1b2f21] text-[#b8e8c3]'
                            : 'border-[#223025] bg-[#141c16] text-[#718574]'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <label className="block text-[#8ca290]">
                    Quantidade ({dialog.supply.unit})
                    <input
                      type="number"
                      inputMode="decimal"
                      min="0.01"
                      step="any"
                      required
                      autoFocus
                      value={quantity}
                      onChange={(event) => setQuantity(event.target.value)}
                      className="mt-1 block w-full rounded-lg border border-[#293a2d] bg-[#162118] px-3 py-2 text-white focus:outline-none"
                    />
                  </label>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <label className="col-span-2 text-[#8ca290]">
                    Nome
                    <input
                      required
                      autoFocus
                      maxLength="120"
                      value={form.name}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, name: event.target.value }))
                      }
                      className="mt-1 block w-full rounded-lg border border-[#293a2d] bg-[#162118] px-3 py-2 text-white focus:outline-none"
                    />
                  </label>
                  <label className="text-[#8ca290]">
                    Categoria
                    <select
                      value={form.category}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, category: event.target.value }))
                      }
                      className="mt-1 block w-full rounded-lg border border-[#293a2d] bg-[#162118] px-2 py-2 text-white focus:outline-none"
                    >
                      {CATEGORIES.map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </label>
                  <label className="text-[#8ca290]">
                    Unidade
                    <select
                      value={form.unit}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, unit: event.target.value }))
                      }
                      className="mt-1 block w-full rounded-lg border border-[#293a2d] bg-[#162118] px-2 py-2 text-white focus:outline-none"
                    >
                      {['kg', 'L', 't'].map((unit) => <option key={unit}>{unit}</option>)}
                    </select>
                  </label>
                  {[
                    ['currentStock', 'Estoque atual'],
                    ['minimumSafeStock', 'Estoque mínimo'],
                    ['consumptionPerDay', 'Consumo por dia'],
                  ].map(([name, label]) => (
                    <label className="text-[#8ca290]" key={name}>
                      {label}
                      <input
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step="any"
                        required
                        value={form[name]}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, [name]: event.target.value }))
                        }
                        className="mt-1 block w-full rounded-lg border border-[#293a2d] bg-[#162118] px-3 py-2 text-white focus:outline-none"
                      />
                    </label>
                  ))}
                  <label className="col-span-2 text-[#8ca290]">
                    Último fornecedor
                    <input
                      maxLength="120"
                      value={form.lastSupplier}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, lastSupplier: event.target.value }))
                      }
                      className="mt-1 block w-full rounded-lg border border-[#293a2d] bg-[#162118] px-3 py-2 text-white focus:outline-none"
                    />
                  </label>
                </div>
              )}

              {actionError && (
                <p role="alert" className="rounded-lg border border-[#eb7351]/40 bg-[#261914] px-3 py-2 text-[#ffb39e]">
                  {actionError}
                </p>
              )}

              <footer className="flex justify-end gap-3 border-t border-[#202d23] pt-3">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="rounded-lg border border-[#2b3a2e] px-4 py-2 font-medium text-[#8da290] hover:bg-[#18231a] hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg border border-[#70a37e]/40 bg-[#1a3523] px-4 py-2 font-semibold text-[#b8e8c3] hover:bg-[#21432c]"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Salvar alterações
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border border-[#70a37e]/40 bg-[#14261b] px-4 py-2.5 text-xs text-[#d6f0dd] shadow-2xl"
        >
          <CheckCircle2 className="h-4 w-4 text-[#70a37e]" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
