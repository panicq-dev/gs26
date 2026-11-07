import React, { useState } from 'react';
import {
  Wheat,
  Plus,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle2,
  Package,
  Calendar,
  Building2,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { SupplyItem } from '../../types/agro';

interface SuppliesTabProps {
  supplies: SupplyItem[];
  onUpdateSupplies: (supplies: SupplyItem[]) => void;
}

export const SuppliesTab: React.FC<SuppliesTabProps> = ({
  supplies,
  onUpdateSupplies,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSupplyId, setSelectedSupplyId] = useState(supplies[0]?.id || '');
  const [movementType, setMovementType] = useState<'entrada' | 'saida'>('saida');
  const [quantity, setQuantity] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [toast, setToast] = useState<string | null>(null);

  const categories = ['all', 'Fertilizante', 'Inseticida', 'Biológico', 'Adjuvante'];

  const filteredSupplies = supplies.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoryFilter === 'all' || s.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const criticalCount = supplies.filter((s) => s.status === 'critical').length;
  const warningCount = supplies.filter((s) => s.status === 'warning').length;
  const optimalCount = supplies.filter((s) => s.status === 'optimal').length;

  const handleRegisterMovement = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = supplies.map((item) => {
      if (item.id === selectedSupplyId) {
        const delta = movementType === 'entrada' ? quantity : -quantity;
        const newStock = Math.max(0, Number((item.currentStock + delta).toFixed(2)));
        const newDays = item.consumptionPerDay > 0 ? Math.floor(newStock / item.consumptionPerDay) : 99;
        const newStatus: 'critical' | 'warning' | 'optimal' =
          newStock < item.minimumSafeStock * 0.8
            ? 'critical'
            : newStock <= item.minimumSafeStock
            ? 'warning'
            : 'optimal';

        return {
          ...item,
          currentStock: newStock,
          daysRemaining: newDays,
          status: newStatus,
        };
      }
      return item;
    });

    onUpdateSupplies(updated);
    setModalOpen(false);
    setToast(
      `${movementType === 'entrada' ? 'Recebimento de' : 'Aplicação em campo de'} ${quantity} registrado no estoque!`
    );
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#1f2c22] pb-4">
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
            Acompanhe o nível de fertilizantes, defensivos e bioinsumos com cálculo automático de dias de cobertura.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg border border-[#70a37e]/40 bg-[#172c1e] px-4 py-2 text-xs font-semibold text-[#b8e8c3] hover:bg-[#1f3b29] transition-colors"
        >
          <Plus className="h-4 w-4 text-[#70a37e]" />
          <span>Registrar Movimentação</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="rounded-xl border border-[#232f26] bg-[#111713] p-4 text-[#e0eae0]">
          <span className="text-xs text-[#718574]">Itens com Autonomia Crítica</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#ff8f70] font-mono">{criticalCount}</span>
            <span className="text-xs text-[#ff8f70]/80">urgência de compra (&lt; 14 dias)</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#232f26] bg-[#111713] p-4 text-[#e0eae0]">
          <span className="text-xs text-[#718574]">Itens em Nível de Atenção</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#ffd875] font-mono">{warningCount}</span>
            <span className="text-xs text-[#ffd875]/80">repor nas próximas semanas</span>
          </div>
        </div>

        <div className="rounded-xl border border-[#232f26] bg-[#111713] p-4 text-[#e0eae0]">
          <span className="text-xs text-[#718574]">Itens com Cobertura Segura</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#9de8b2] font-mono">{optimalCount}</span>
            <span className="text-xs text-[#9de8b2]/80">estoque acima do limiar mínimo</span>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-[#121a14] p-1 rounded-lg border border-[#233127] overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                categoryFilter === cat ? 'bg-[#223125] text-white shadow' : 'text-[#7e9381] hover:text-white'
              }`}
            >
              {cat === 'all' ? 'Todos os Insumos' : cat}
            </button>
          ))}
        </div>

        <div className="flex items-center rounded-lg border border-[#233127] bg-[#121a14] px-3 py-1.5 text-xs text-white">
          <Search className="h-3.5 w-3.5 text-[#6c8270] mr-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar por nome do insumo..."
            className="bg-transparent placeholder-[#617765] focus:outline-none w-48 sm:w-60"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="rounded-xl border border-[#222e25] bg-[#111713] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#dce6dc]">
            <thead className="bg-[#141d16] text-[#718574] font-mono uppercase text-[10px] tracking-wider border-b border-[#1f2c22]">
              <tr>
                <th className="py-3 px-4 font-semibold">Insumo & Categoria</th>
                <th className="py-3 px-4 font-semibold text-right">Estoque Atual</th>
                <th className="py-3 px-4 font-semibold text-right">Estoque Mínimo</th>
                <th className="py-3 px-4 font-semibold text-right">Consumo / Dia</th>
                <th className="py-3 px-4 font-semibold text-right">Autonomia</th>
                <th className="py-3 px-4 font-semibold">Talhões Destino</th>
                <th className="py-3 px-4 font-semibold">Último Fornecedor</th>
                <th className="py-3 px-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c271f]">
              {filteredSupplies.map((item) => (
                <tr key={item.id} className="hover:bg-[#151f17] transition-colors">
                  <td className="py-3.5 px-4">
                    <strong className="block text-white font-medium">{item.name}</strong>
                    <span className="text-[11px] text-[#718574]">{item.category}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-white tabular-nums">
                    {item.currentStock} <span className="text-[#869b89] font-normal">{item.unit}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-[#8ca08e] tabular-nums">
                    {item.minimumSafeStock} {item.unit}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-[#718574] tabular-nums">
                    {item.consumptionPerDay} {item.unit}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-semibold tabular-nums">
                    <span
                      className={
                        item.status === 'critical'
                          ? 'text-[#ff8f70]'
                          : item.status === 'warning'
                          ? 'text-[#ffd875]'
                          : 'text-[#9de8b2]'
                      }
                    >
                      {item.daysRemaining} dias
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[11px] text-[#869b89] max-w-[180px] truncate">
                    {item.targetTalhoes.join(', ')}
                  </td>
                  <td className="py-3.5 px-4 text-[11px] text-[#718574]">
                    {item.lastSupplier}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-block rounded px-2 py-0.5 text-[10px] font-mono font-bold uppercase ${
                        item.status === 'critical'
                          ? 'bg-[#eb7351]/20 text-[#ff8f70] border border-[#eb7351]/40'
                          : item.status === 'warning'
                          ? 'bg-[#d1a342]/20 text-[#ebd173] border border-[#d1a342]/40'
                          : 'bg-[#639777]/20 text-[#8ec7a0] border border-[#639777]/30'
                      }`}
                    >
                      {item.status === 'critical' ? 'Crítico' : item.status === 'warning' ? 'Atenção' : 'Seguro'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Movement Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#2d3f31] bg-[#121a14] p-6 shadow-2xl text-[#e0eae0]">
            <div className="flex items-center justify-between border-b border-[#212f24] pb-3 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#70a37e]">
                  CONTROLE DE ALMOXARIFADO
                </span>
                <h3 className="text-lg font-bold text-white">Registrar Movimentação</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-[#6d8270] hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterMovement} className="space-y-4 text-xs">
              <div>
                <label className="text-[#8ca290] block mb-1">Insumo:</label>
                <select
                  value={selectedSupplyId}
                  onChange={(e) => setSelectedSupplyId(e.target.value)}
                  className="w-full rounded-lg border border-[#293a2d] bg-[#162118] px-3 py-2 text-white focus:outline-none"
                >
                  {supplies.map((s) => (
                    <option key={s.id} value={s.id} className="bg-[#121a14]">
                      {s.name} ({s.currentStock} {s.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#8ca290] block mb-1">Tipo de Movimento:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setMovementType('saida')}
                    className={`py-2 rounded-lg border text-xs font-semibold transition-colors ${
                      movementType === 'saida'
                        ? 'border-[#70a37e] bg-[#1b2f21] text-[#b8e8c3]'
                        : 'border-[#223025] bg-[#141c16] text-[#718574]'
                    }`}
                  >
                    Saída para Pulverização
                  </button>
                  <button
                    type="button"
                    onClick={() => setMovementType('entrada')}
                    className={`py-2 rounded-lg border text-xs font-semibold transition-colors ${
                      movementType === 'entrada'
                        ? 'border-[#70a37e] bg-[#1b2f21] text-[#b8e8c3]'
                        : 'border-[#223025] bg-[#141c16] text-[#718574]'
                    }`}
                  >
                    Entrada de Nota Fiscal
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[#8ca290] block mb-1">Quantidade a Movimentar:</label>
                <input
                  type="number"
                  step="any"
                  min="0.1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full rounded-lg border border-[#293a2d] bg-[#162118] px-3 py-2 text-white font-mono focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#202d23] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-[#2b3a2e] px-4 py-2 text-xs font-medium text-[#8da290] hover:bg-[#18231a] hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg border border-[#70a37e]/40 bg-[#1a3523] px-4 py-2 text-xs font-semibold text-[#b8e8c3] hover:bg-[#21432c] transition-colors"
                >
                  <CheckCircle2 className="h-4 w-4 text-[#70a37e]" />
                  <span>Salvar Lançamento</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border border-[#70a37e]/40 bg-[#14261b] px-4 py-2.5 text-xs text-[#d6f0dd] shadow-2xl backdrop-blur-md animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-[#70a37e]" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
};
