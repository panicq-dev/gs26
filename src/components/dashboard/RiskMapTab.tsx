import React, { useState } from 'react';
import {
  Map,
  Layers,
  Flame,
  Activity,
  Droplets,
  Thermometer,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  Sliders,
  Send,
  Plane,
  ChevronRight,
  Info,
} from 'lucide-react';
import { Talhao } from '../../types/agro';
import { FieldTerrain3D } from '../three/FieldTerrain3D';

interface RiskMapTabProps {
  talhoes: Talhao[];
  selectedTalhao: Talhao | null;
  onSelectTalhao: (talhao: Talhao) => void;
  onScheduleSpray?: (talhao: Talhao) => void;
}

export const RiskMapTab: React.FC<RiskMapTabProps> = ({
  talhoes,
  selectedTalhao,
  onSelectTalhao,
  onScheduleSpray,
}) => {
  const [filterRisk, setFilterRisk] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const filteredTalhoes = talhoes.filter((t) => {
    if (filterRisk === 'all') return true;
    return t.riskLevel === filterRisk;
  });

  const highRiskCount = talhoes.filter((t) => t.riskLevel === 'high').length;
  const mediumRiskCount = talhoes.filter((t) => t.riskLevel === 'medium').length;
  const lowRiskCount = talhoes.filter((t) => t.riskLevel === 'low').length;

  const currentTalhao = selectedTalhao || talhoes.find((t) => t.id === 't-08') || talhoes[0];

  const handleAction = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  return (
    <div className="space-y-5">
      {/* Header & Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#1f2c22] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#79907c]">
            <span>Gêmeo Digital Topográfico</span>
            <span>·</span>
            <span>Modelagem 3D em Tempo Real</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
            Mapa de Risco Fitossanitário 3D
          </h1>
          <p className="mt-1 text-xs text-[#8ca290]">
            Navegue pelo relevo tridimensional da Fazenda Santa Helena, identifique focos de pragas e simule sobrevoos.
          </p>
        </div>

        {/* Quick Filter Pill Buttons */}
        <div className="flex items-center gap-1.5 bg-[#121a14] p-1 rounded-lg border border-[#233127]">
          <button
            type="button"
            onClick={() => setFilterRisk('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              filterRisk === 'all' ? 'bg-[#213024] text-white shadow-sm' : 'text-[#7e9381] hover:text-white'
            }`}
          >
            Todos ({talhoes.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterRisk('high')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              filterRisk === 'high' ? 'bg-[#42291d] text-[#ff9e85] border border-[#eb7351]/40' : 'text-[#7e9381] hover:text-[#ff9e85]'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-[#eb7351]" />
            Alto Risco ({highRiskCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterRisk('medium')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              filterRisk === 'medium' ? 'bg-[#3b321a] text-[#ffd875] border border-[#d1a342]/40' : 'text-[#7e9381] hover:text-[#ffd875]'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-[#d1a342]" />
            Atenção ({mediumRiskCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterRisk('low')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              filterRisk === 'low' ? 'bg-[#182e1f] text-[#a5e0b6] border border-[#52a66e]/40' : 'text-[#7e9381] hover:text-[#a5e0b6]'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-[#52a66e]" />
            Normal ({lowRiskCount})
          </button>
        </div>
      </div>

      {/* Talhões Quick Bar to Focus Camera */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-mono uppercase text-[#6f8272] shrink-0">Talhões:</span>
        {filteredTalhoes.map((t) => {
          const isSelected = currentTalhao.id === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectTalhao(t)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-medium whitespace-nowrap transition-colors ${
                isSelected
                  ? 'border-[#70a37e] bg-[#1a2f21] text-white shadow'
                  : 'border-[#223026] bg-[#111713] text-[#8ca08f] hover:border-[#334638] hover:text-white'
              }`}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor:
                    t.riskLevel === 'high' ? '#eb7351' : t.riskLevel === 'medium' ? '#d1a342' : '#52a66e',
                }}
              />
              <span>{t.code}</span>
              <span className="text-[10px] text-[#6d8070]">({t.areaHa} ha)</span>
            </button>
          );
        })}
      </div>

      {/* Main 3D Viewport & Inspector Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Full 3D Field Map (8 cols) */}
        <div className="lg:col-span-8">
          <FieldTerrain3D
            talhoes={talhoes}
            selectedTalhaoId={currentTalhao.id}
            onSelectTalhao={onSelectTalhao}
          />
        </div>

        {/* Selected Talhão Inspector Card (4 cols) */}
        <div className="lg:col-span-4 flex flex-col rounded-xl border border-[#232f26] bg-[#111713] p-4 text-[#e0eae0]">
          <div className="flex items-center justify-between border-b border-[#1f2b21] pb-3 mb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#708472]">
                DETALHES DO TALHÃO
              </span>
              <h2 className="text-lg font-bold text-white">{currentTalhao.code}</h2>
              <p className="text-xs text-[#8ca28f]">{currentTalhao.name}</p>
            </div>
            <span
              className={`rounded-lg px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider ${
                currentTalhao.riskLevel === 'high'
                  ? 'bg-[#eb7351]/20 text-[#ff8f70] border border-[#eb7351]/40'
                  : currentTalhao.riskLevel === 'medium'
                  ? 'bg-[#d1a342]/20 text-[#ebd173] border border-[#d1a342]/40'
                  : 'bg-[#639777]/20 text-[#8ec7a0] border border-[#639777]/30'
              }`}
            >
              {currentTalhao.riskPct}% Risco
            </span>
          </div>

          {/* Key Properties Grid */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="rounded-lg border border-[#202b22] bg-[#141d16] p-2.5">
              <span className="text-[11px] text-[#718574]">Área Total</span>
              <p className="text-base font-bold text-white font-mono">{currentTalhao.areaHa} ha</p>
            </div>
            <div className="rounded-lg border border-[#202b22] bg-[#141d16] p-2.5">
              <span className="text-[11px] text-[#718574]">Altitude Média</span>
              <p className="text-base font-bold text-white font-mono">{currentTalhao.elevationM} m</p>
            </div>
            <div className="rounded-lg border border-[#202b22] bg-[#141d16] p-2.5">
              <span className="text-[11px] text-[#718574]">Umidade do Solo</span>
              <p className="text-base font-bold text-[#6b95a8] font-mono">{currentTalhao.moisturePct}%</p>
            </div>
            <div className="rounded-lg border border-[#202b22] bg-[#141d16] p-2.5">
              <span className="text-[11px] text-[#718574]">Índice NDVI</span>
              <p className="text-base font-bold text-[#86a88b] font-mono">{currentTalhao.ndvi.toFixed(2)}</p>
            </div>
          </div>

          {/* Agronomic Details */}
          <div className="mt-3.5 space-y-2 text-xs border-t border-[#1c271f] pt-3 flex-1">
            <div className="flex justify-between">
              <span className="text-[#728574]">Cultura & Variedade:</span>
              <strong className="text-white">{currentTalhao.crop} ({currentTalhao.variety})</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#728574]">Tipo de Solo:</span>
              <strong className="text-white">{currentTalhao.soilType}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#728574]">Ameaça Principal:</span>
              <strong className={currentTalhao.riskLevel === 'high' ? 'text-[#ff8f70]' : 'text-white'}>
                {currentTalhao.primaryThreat}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-[#728574]">Último Voo Ortofoto:</span>
              <strong className="text-[#8ca28e]">{currentTalhao.lastDronePass}</strong>
            </div>
          </div>

          {/* Action recommendation */}
          <div className="mt-3 rounded-lg border border-[#2e3e32] bg-[#152219] p-3 text-xs">
            <div className="flex items-center gap-1.5 text-[#86a88b] font-semibold mb-1">
              <Info className="h-3.5 w-3.5" />
              <span>Diagnóstico Agronômico:</span>
            </div>
            <p className="text-[11px] text-[#b4c9b7] leading-relaxed">
              {currentTalhao.riskLevel === 'high'
                ? 'Pressão de bicudo em expansão pela bordadura da mata. Recomenda-se aplicação seletiva de Clorantraniliprole na borda de 50 metros antes das 16:00.'
                : currentTalhao.riskLevel === 'medium'
                ? 'Manchas iniciais de Ramularia na baixada úmida. Monitorar fechamento da entrelinha e umidade noturna.'
                : 'Condição vegetativa excelente. Manter monitoramento quinzenal de armadilhas de feromônio.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 pt-3 border-t border-[#1f2b21] space-y-2">
            <button
              type="button"
              onClick={() => {
                if (onScheduleSpray) onScheduleSpray(currentTalhao);
                handleAction(`Pulverização agendada com sucesso para ${currentTalhao.code}!`);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#70a37e]/40 bg-[#193322] py-2 text-xs font-semibold text-[#b8e8c3] hover:bg-[#20402b] transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Agendar Manejo em {currentTalhao.code}</span>
            </button>

            <button
              type="button"
              onClick={() => handleAction(`Ordem de sobrevoo prioritário enviada ao drone para ${currentTalhao.code}.`)}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#2b3a2f] bg-[#141c16] py-2 text-xs font-medium text-[#8da290] hover:bg-[#1a261d] hover:text-white transition-colors"
            >
              <Plane className="h-3.5 w-3.5" />
              <span>Solicitar Voo Focal de Drone</span>
            </button>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border border-[#70a37e]/40 bg-[#14261b] px-4 py-2.5 text-xs text-[#d6f0dd] shadow-2xl backdrop-blur-md animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-[#70a37e]" />
          <span>{successToast}</span>
        </div>
      )}
    </div>
  );
};
