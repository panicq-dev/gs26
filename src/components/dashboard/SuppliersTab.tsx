import React, { useState } from 'react';
import {
  Compass,
  Star,
  Clock,
  ShieldCheck,
  Phone,
  Mail,
  Send,
  Building2,
  CheckCircle2,
  Search,
} from 'lucide-react';
import { SupplierItem } from '../../types/agro';

interface SuppliersTabProps {
  suppliers: SupplierItem[];
}

export const SuppliersTab: React.FC<SuppliersTabProps> = ({ suppliers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [quoteModalSupplier, setQuoteModalSupplier] = useState<SupplierItem | null>(null);
  const [quoteProduct, setQuoteProduct] = useState('Clorantraniliprole 200 SC');
  const [quoteQty, setQuoteQty] = useState('100 Litros');
  const [toast, setToast] = useState<string | null>(null);

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.categories.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteModalSupplier) return;
    setToast(
      `Cotação de ${quoteQty} de ${quoteProduct} enviada para ${quoteModalSupplier.name}. Resposta estimada em 2 horas.`
    );
    setQuoteModalSupplier(null);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#1f2c22] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#79907c]">
            <span>Rede Homologada de Suprimentos</span>
            <span>·</span>
            <span>Região de Ribeirão Preto</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
            Fornecedores & Cotação de Insumos
          </h1>
          <p className="mt-1 text-xs text-[#8ca290]">
            Distribuidores qualificados de defensivos, sementes e biológicos com tempo médio de entrega e índice de confiabilidade.
          </p>
        </div>

        <div className="flex items-center rounded-lg border border-[#233127] bg-[#121a14] px-3 py-1.5 text-xs text-white">
          <Search className="h-3.5 w-3.5 text-[#6c8270] mr-2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar distribuidor ou categoria..."
            className="bg-transparent placeholder-[#617765] focus:outline-none w-48 sm:w-60"
          />
        </div>
      </div>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map((supplier) => (
          <div
            key={supplier.id}
            className="rounded-xl border border-[#222e25] bg-[#111713] p-4 text-[#e0eae0] flex flex-col justify-between hover:border-[#324535] transition-colors"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">{supplier.name}</h3>
                  <p className="text-xs text-[#7f9482]">{supplier.city}, {supplier.state}</p>
                </div>
                {supplier.certified && (
                  <span className="flex items-center gap-1 rounded bg-[#70a37e]/20 px-2 py-0.5 text-[10px] font-medium text-[#9de8b2] border border-[#70a37e]/30">
                    <ShieldCheck className="h-3 w-3" /> Homologado
                  </span>
                )}
              </div>

              {/* Performance Scores */}
              <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg border border-[#202b22] bg-[#141d16] p-2.5">
                  <span className="text-[10px] text-[#718574]">Prazo de Entrega</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Clock className="h-3.5 w-3.5 text-[#c89b53]" />
                    <strong className="text-sm text-white font-mono">{supplier.leadTimeDays} {supplier.leadTimeDays === 1 ? 'dia' : 'dias'}</strong>
                  </div>
                </div>

                <div className="rounded-lg border border-[#202b22] bg-[#141d16] p-2.5">
                  <span className="text-[10px] text-[#718574]">Confiabilidade</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="h-3.5 w-3.5 text-[#d1a342] fill-[#d1a342]" />
                    <strong className="text-sm text-white font-mono">{supplier.reliabilityPct}%</strong>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {supplier.categories.map((cat) => (
                  <span
                    key={cat}
                    className="rounded bg-[#17221a] px-2 py-0.5 text-[10px] text-[#8ea290] border border-[#253629]"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              {/* Contact info */}
              <div className="mt-3 space-y-1 text-[11px] text-[#7a8f7d] pt-2 border-t border-[#1c271f]">
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3 w-3 text-[#6c8270]" />
                  <span>{supplier.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3 w-3 text-[#6c8270]" />
                  <span className="truncate">{supplier.email}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setQuoteModalSupplier(supplier)}
              className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#2e4233] bg-[#16241b] py-2 text-xs font-semibold text-[#86a88b] hover:bg-[#1d3023] hover:text-white transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Solicitar Cotação Rápida</span>
            </button>
          </div>
        ))}
      </div>

      {/* Quote Modal */}
      {quoteModalSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-[#2d3f31] bg-[#121a14] p-6 shadow-2xl text-[#e0eae0]">
            <div className="flex items-center justify-between border-b border-[#212f24] pb-3 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#70a37e]">
                  COTAÇÃO DIRETA
                </span>
                <h3 className="text-lg font-bold text-white">{quoteModalSupplier.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setQuoteModalSupplier(null)}
                className="text-[#6d8270] hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendQuote} className="space-y-4 text-xs">
              <div>
                <label className="text-[#8ca290] block mb-1">Insumo Desejado:</label>
                <input
                  type="text"
                  required
                  value={quoteProduct}
                  onChange={(e) => setQuoteProduct(e.target.value)}
                  className="w-full rounded-lg border border-[#293a2d] bg-[#162118] px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[#8ca290] block mb-1">Volume / Quantidade:</label>
                <input
                  type="text"
                  required
                  value={quoteQty}
                  onChange={(e) => setQuoteQty(e.target.value)}
                  className="w-full rounded-lg border border-[#293a2d] bg-[#162118] px-3 py-2 text-white focus:outline-none font-mono"
                />
              </div>

              <div className="rounded-lg border border-[#202b22] bg-[#141d16] p-3 text-[11px] text-[#869b88]">
                <span>Prazo médio contratual de entrega: <strong className="text-white">{quoteModalSupplier.leadTimeDays} dia(s) úteis</strong></span>
              </div>

              <div className="pt-3 border-t border-[#202d23] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setQuoteModalSupplier(null)}
                  className="rounded-lg border border-[#2b3a2e] px-4 py-2 text-xs font-medium text-[#8da290] hover:bg-[#18231a] hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg border border-[#70a37e]/40 bg-[#1a3523] px-4 py-2 text-xs font-semibold text-[#b8e8c3] hover:bg-[#21432c] transition-colors"
                >
                  <Send className="h-4 w-4 text-[#70a37e]" />
                  <span>Transmitir Solicitação</span>
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
