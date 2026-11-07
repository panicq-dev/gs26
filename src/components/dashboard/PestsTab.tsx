import React, { useState } from 'react';
import {
  Bug,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  Search,
  CheckCircle2,
  FileText,
  MapPin,
  ExternalLink,
  Leaf,
  FlaskConical,
} from 'lucide-react';
import { PestRecord, Talhao } from '../../types/agro';

interface PestsTabProps {
  pests: PestRecord[];
  talhoes: Talhao[];
  onSelectTalhao: (talhao: Talhao) => void;
  onNavigateToMap: () => void;
}

export const PestsTab: React.FC<PestsTabProps> = ({
  pests,
  talhoes,
  onSelectTalhao,
  onNavigateToMap,
}) => {
  const [selectedPest, setSelectedPest] = useState<PestRecord>(pests[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [prescriptionModalPest, setPrescriptionModalPest] = useState<PestRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredPests = pests.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.scientificName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || p.riskLevel === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  const handleIssuePrescription = (pest: PestRecord) => {
    setPrescriptionModalPest(pest);
  };

  const confirmPrescription = () => {
    if (!prescriptionModalPest) return;
    setToastMessage(`Receituário agronômico emitido para controle de ${prescriptionModalPest.name} com sucesso.`);
    setPrescriptionModalPest(null);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#1f2c22] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#79907c]">
            <span>Manejo Integrado de Pragas (MIP)</span>
            <span>·</span>
            <span>Algodoeiro & Soja</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
            Catálogo Fitossanitário & Prescrições
          </h1>
          <p className="mt-1 text-xs text-[#8ca290]">
            Monitoramento de pressão biológica, limiares de dano econômico e defensivos recomendados por talhão.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-lg border border-[#233127] bg-[#121a14] px-3 py-1.5 text-xs text-white">
            <Search className="h-3.5 w-3.5 text-[#6c8270] mr-2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar praga ou ativo..."
              className="bg-transparent placeholder-[#617765] focus:outline-none w-36 sm:w-48"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#121a14] p-1 rounded-lg border border-[#233127]">
            <button
              type="button"
              onClick={() => setFilterSeverity('all')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                filterSeverity === 'all' ? 'bg-[#213024] text-white' : 'text-[#7e9381] hover:text-white'
              }`}
            >
              Todas
            </button>
            <button
              type="button"
              onClick={() => setFilterSeverity('high')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                filterSeverity === 'high' ? 'bg-[#402a1e] text-[#ff9980]' : 'text-[#7e9381] hover:text-[#ff9980]'
              }`}
            >
              Críticas
            </button>
            <button
              type="button"
              onClick={() => setFilterSeverity('medium')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                filterSeverity === 'medium' ? 'bg-[#3b3119] text-[#ffd875]' : 'text-[#7e9381] hover:text-[#ffd875]'
              }`}
            >
              Atenção
            </button>
          </div>
        </div>
      </div>

      {/* Main Pest Grid + Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Pest Cards List (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredPests.map((pest) => {
            const isSelected = selectedPest.id === pest.id;
            return (
              <div
                key={pest.id}
                onClick={() => setSelectedPest(pest)}
                className={`cursor-pointer rounded-xl border p-4 transition-all ${
                  isSelected
                    ? 'border-[#70a37e] bg-[#142017] shadow-lg'
                    : 'border-[#202c22] bg-[#111713] hover:border-[#2f4233] hover:bg-[#131b15]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg border text-white font-bold"
                      style={{
                        backgroundColor: `${pest.color}15`,
                        borderColor: `${pest.color}40`,
                        color: pest.color,
                      }}
                    >
                      <Bug className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{pest.name}</h3>
                      <p className="text-[11px] text-[#7d917f] italic">{pest.scientificName}</p>
                    </div>
                  </div>

                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-mono font-bold uppercase ${
                      pest.riskLevel === 'high'
                        ? 'bg-[#eb7351]/20 text-[#ff8f70] border border-[#eb7351]/40'
                        : pest.riskLevel === 'medium'
                        ? 'bg-[#d1a342]/20 text-[#ebd173] border border-[#d1a342]/40'
                        : 'bg-[#639777]/20 text-[#8ec7a0] border border-[#639777]/30'
                    }`}
                  >
                    {pest.probabilityPct}% Risco
                  </span>
                </div>

                <p className="mt-2.5 text-xs text-[#8da290] line-clamp-2 leading-relaxed">
                  {pest.damageDescription}
                </p>

                <div className="mt-3 flex items-center justify-between text-[11px] text-[#718574] pt-2 border-t border-[#1d271f]">
                  <span className="flex items-center gap-1 text-[#869b89]">
                    <Clock className="h-3 w-3 text-[#c89b53]" />
                    Janela: <strong>{pest.urgencyHours} horas</strong>
                  </span>
                  <span>{pest.affectedTalhoes.join(', ')}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pest Detail / Prescription Sheet (7 cols) */}
        <div className="lg:col-span-7 rounded-xl border border-[#232f26] bg-[#111713] p-5 text-[#e0eae0]">
          <div className="flex items-start justify-between border-b border-[#1f2b21] pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#708472]">
                  PROTOCOLO DE MANEJO AGRONÔMICO
                </span>
                <span className="text-[#4e6352]">·</span>
                <span className="text-xs text-[#86a88b]">{selectedPest.cropTarget}</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">{selectedPest.name}</h2>
              <p className="text-xs text-[#8ca28f] italic">{selectedPest.scientificName}</p>
            </div>

            <button
              type="button"
              onClick={() => handleIssuePrescription(selectedPest)}
              className="flex items-center gap-1.5 rounded-lg border border-[#70a37e]/40 bg-[#182f20] px-3.5 py-2 text-xs font-semibold text-[#b8e8c3] hover:bg-[#203d2b] transition-colors"
            >
              <FileText className="h-3.5 w-3.5 text-[#70a37e]" />
              <span>Emitir Receituário</span>
            </button>
          </div>

          {/* Damage & Biological Context */}
          <div className="space-y-4 text-xs">
            <div>
              <span className="text-[11px] font-semibold text-[#8ca290] uppercase tracking-wider block mb-1">
                Sintomatologia & Comportamento de Dano
              </span>
              <p className="rounded-lg border border-[#202b22] bg-[#141d16] p-3 text-[#c4d6c6] leading-relaxed">
                {selectedPest.damageDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-lg border border-[#202b22] bg-[#141d16] p-3">
                <span className="text-[11px] font-semibold text-[#c89b53] uppercase tracking-wider block mb-1">
                  Limiar de Dano Econômico (LDE)
                </span>
                <p className="text-sm font-medium text-white">{selectedPest.economicThreshold}</p>
              </div>

              <div className="rounded-lg border border-[#202b22] bg-[#141d16] p-3">
                <span className="text-[11px] font-semibold text-[#eb7351] uppercase tracking-wider block mb-1">
                  Janela Crítica de Ação
                </span>
                <p className="text-sm font-medium text-white">
                  Intervir em até <strong className="text-[#ff9e85] font-mono">{selectedPest.urgencyHours} horas</strong>
                </p>
              </div>
            </div>

            {/* Prescriptions chemical & bio */}
            <div className="space-y-3 pt-2">
              <div className="rounded-lg border border-[#253528] bg-[#121c15] p-3.5">
                <div className="flex items-center gap-2 text-[#70a37e] font-semibold mb-1.5">
                  <FlaskConical className="h-4 w-4" />
                  <span className="text-xs">Tratamento Químico Recomendado (Seletivo)</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between text-xs gap-1">
                  <div>
                    <span className="text-[#728574]">Princípio Ativo:</span>
                    <strong className="text-white block sm:inline sm:ml-1">{selectedPest.activeIngredient}</strong>
                  </div>
                  <div>
                    <span className="text-[#728574]">Dosagem:</span>
                    <strong className="text-[#9de8b2] font-mono ml-1">{selectedPest.dosagePerHa}</strong>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-[#2b392e] bg-[#111913] p-3.5">
                <div className="flex items-center gap-2 text-[#86a88b] font-semibold mb-1.5">
                  <Leaf className="h-4 w-4" />
                  <span className="text-xs">Alternativa Biológica Homologada (Bioinsumo)</span>
                </div>
                <p className="text-xs text-[#cad9cc]">
                  {selectedPest.biologicalAlternative}
                </p>
              </div>
            </div>

            {/* Affected Talhões Interactive Links */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-[#8ca290] uppercase tracking-wider block mb-2">
                Talhões com Detecção Desta Praga
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedPest.affectedTalhoes.map((talhaoCode) => {
                  const targetTalhao = talhoes.find((t) => t.code === talhaoCode);
                  return (
                    <button
                      key={talhaoCode}
                      type="button"
                      onClick={() => {
                        if (targetTalhao) onSelectTalhao(targetTalhao);
                        onNavigateToMap();
                      }}
                      className="flex items-center gap-1.5 rounded-lg border border-[#2d3f31] bg-[#17241b] px-3 py-1.5 text-xs text-[#d3e3d5] hover:border-[#70a37e] hover:text-white transition-colors"
                    >
                      <MapPin className="h-3 w-3 text-[#70a37e]" />
                      <span>{talhaoCode}</span>
                      <ExternalLink className="h-2.5 w-2.5 text-[#6c8270]" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prescription Issue Modal */}
      {prescriptionModalPest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-[#2d3f31] bg-[#121a14] p-6 shadow-2xl text-[#e0eae0]">
            <div className="flex items-center justify-between border-b border-[#212f24] pb-3 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#70a37e]">
                  RECEITUÁRIO AGRONÔMICO ELETRÔNICO
                </span>
                <h3 className="text-lg font-bold text-white">
                  Ordem de Aplicação · {prescriptionModalPest.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPrescriptionModalPest(null)}
                className="text-[#6d8270] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-lg border border-[#222e25] bg-[#151f17] p-3">
                <span className="text-[#728574] block">Alvo Biológico:</span>
                <strong className="text-white text-sm">{prescriptionModalPest.name} ({prescriptionModalPest.scientificName})</strong>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-lg border border-[#222e25] bg-[#151f17] p-3">
                  <span className="text-[#728574] block">Princípio Ativo:</span>
                  <strong className="text-white">{prescriptionModalPest.activeIngredient}</strong>
                </div>
                <div className="rounded-lg border border-[#222e25] bg-[#151f17] p-3">
                  <span className="text-[#728574] block">Dosagem Recomendada:</span>
                  <strong className="text-[#9de8b2] font-mono">{prescriptionModalPest.dosagePerHa}</strong>
                </div>
              </div>

              <div className="rounded-lg border border-[#222e25] bg-[#151f17] p-3">
                <span className="text-[#728574] block">Talhões Destinatários:</span>
                <strong className="text-white">{prescriptionModalPest.affectedTalhoes.join(' · ')}</strong>
              </div>

              <div className="rounded-lg border border-[#3b321a] bg-[#1c1911] p-3 text-[#d1b882]">
                <span className="font-semibold block mb-0.5">Condição Operacional Recomendada:</span>
                Pulverizar antes das 16:00 (vento &lt; 10 km/h, umidade &gt; 60%) com bicos de indução de ar para evitar deriva.
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-3 pt-3 border-t border-[#202d23]">
              <button
                type="button"
                onClick={() => setPrescriptionModalPest(null)}
                className="rounded-lg border border-[#2b3a2e] px-4 py-2 text-xs font-medium text-[#8da290] hover:bg-[#18231a] hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmPrescription}
                className="flex items-center gap-1.5 rounded-lg border border-[#70a37e]/40 bg-[#1a3523] px-4 py-2 text-xs font-semibold text-[#b8e8c3] hover:bg-[#21432c] transition-colors"
              >
                <CheckCircle2 className="h-4 w-4 text-[#70a37e]" />
                <span>Confirmar & Transmitir à Frota</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border border-[#70a37e]/40 bg-[#14261b] px-4 py-2.5 text-xs text-[#d6f0dd] shadow-2xl backdrop-blur-md animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-[#70a37e]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
