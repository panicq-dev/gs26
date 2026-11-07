import React, { useState } from 'react';
import {
  TrendingDown,
  DollarSign,
  Droplets,
  Sprout,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Sliders,
  HelpCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';

export const FinancialSimulatorTab: React.FC = () => {
  // Simulator inputs
  const [pesticideCostPerHa, setPesticideCostPerHa] = useState<number>(145);
  const [areaHa, setAreaHa] = useState<number>(260); // Talhões 08 + 09
  const [cottonPricePerArroba, setCottonPricePerArroba] = useState<number>(138);
  const [expectedYield, setExpectedYield] = useState<number>(318); // @/ha
  const [delayDays, setDelayDays] = useState<number>(0);
  const [toast, setToast] = useState<string | null>(null);

  // Calculations:
  // Each day of delay in high-pressure pest zone causes approx 1.8% loss in bolls
  const baseLossRiskPct = 22; // if untreated
  const delayPenaltyPct = delayDays * 2.8;
  const actualAvoidedDamagePct = Math.max(2, baseLossRiskPct - delayPenaltyPct);

  const applicationCostTotal = areaHa * pesticideCostPerHa;
  const grossCropValueInArea = areaHa * expectedYield * cottonPricePerArroba;
  const valuePreservedBrl = (grossCropValueInArea * (actualAvoidedDamagePct / 100));
  const netFinancialBenefit = valuePreservedBrl - applicationCostTotal;
  const returnOnInvestment = applicationCostTotal > 0 ? (netFinancialBenefit / applicationCostTotal) * 100 : 0;
  const spraySavedLiters = Math.round(areaHa * (delayDays > 0 ? 0 : 13.5)); // 13.5 L/ha calda reduction from precision prescription

  const comparisonData = [
    {
      scenario: 'Hoje (Ideal)',
      custo: Math.round(applicationCostTotal / 1000),
      preservado: Math.round((grossCropValueInArea * (baseLossRiskPct / 100)) / 1000),
      liquido: Math.round(((grossCropValueInArea * (baseLossRiskPct / 100)) - applicationCostTotal) / 1000),
    },
    {
      scenario: `Cenário Atual (+${delayDays}d)`,
      custo: Math.round(applicationCostTotal / 1000),
      preservado: Math.round(valuePreservedBrl / 1000),
      liquido: Math.round(netFinancialBenefit / 1000),
    },
    {
      scenario: 'Atraso de 5 Dias',
      custo: Math.round(applicationCostTotal / 1000),
      preservado: Math.round((grossCropValueInArea * Math.max(2, baseLossRiskPct - 14) / 100) / 1000),
      liquido: Math.round(((grossCropValueInArea * Math.max(2, baseLossRiskPct - 14) / 100) - applicationCostTotal) / 1000),
    },
  ];

  const resetDefaults = () => {
    setPesticideCostPerHa(145);
    setAreaHa(260);
    setCottonPricePerArroba(138);
    setExpectedYield(318);
    setDelayDays(0);
  };

  const saveScenario = () => {
    setToast('Cenário de simulação salvo e anexado ao plano da Safra 26/27.');
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#1f2c22] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#79907c]">
            <span>Economia Agrícola de Precisão</span>
            <span>·</span>
            <span>Modelagem de Sensibilidade</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
            Simulador Financeiro de Manejo & Retorno
          </h1>
          <p className="mt-1 text-xs text-[#8ca290]">
            Calcule o retorno sobre investimento (ROI) de aplicações oportunas contra perdas de produtividade por pragas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetDefaults}
            className="flex items-center gap-1.5 rounded-lg border border-[#2b3a2f] bg-[#141c16] px-3 py-1.5 text-xs text-[#8da290] hover:text-white transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Redefinir Padrões</span>
          </button>
          <button
            type="button"
            onClick={saveScenario}
            className="flex items-center gap-1.5 rounded-lg border border-[#70a37e]/40 bg-[#172c1e] px-3.5 py-1.5 text-xs font-semibold text-[#b8e8c3] hover:bg-[#1f3b28] transition-colors"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-[#70a37e]" />
            <span>Salvar Cenário</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Sliders Input Panel (5 cols) */}
        <div className="lg:col-span-5 rounded-xl border border-[#222e25] bg-[#111713] p-5 text-[#e0eae0] space-y-5">
          <div className="border-b border-[#1f2b21] pb-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#708472]">
              PARÂMETROS DA OPERAÇÃO
            </span>
            <h2 className="text-sm font-semibold text-white">Variáveis de Custo & Mercado</h2>
          </div>

          {/* Slider 1: Custo Defensivo */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-[#8ca290]">Custo de Defensivo por Hectare:</span>
              <span className="font-mono font-bold text-white tabular-nums">
                R$ {pesticideCostPerHa} <span className="font-normal text-[#718574]">/ ha</span>
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="400"
              step="5"
              value={pesticideCostPerHa}
              onChange={(e) => setPesticideCostPerHa(Number(e.target.value))}
              className="w-full accent-[#70a37e] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#5f7463] mt-1">
              <span>R$ 50</span>
              <span>R$ 200</span>
              <span>R$ 400</span>
            </div>
          </div>

          {/* Slider 2: Área */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-[#8ca290]">Área em Aplicação:</span>
              <span className="font-mono font-bold text-white tabular-nums">
                {areaHa} <span className="font-normal text-[#718574]">hectares</span>
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="1248"
              step="10"
              value={areaHa}
              onChange={(e) => setAreaHa(Number(e.target.value))}
              className="w-full accent-[#70a37e] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#5f7463] mt-1">
              <span>50 ha</span>
              <span>260 ha (Talhões 08-09)</span>
              <span>1.248 ha (Total)</span>
            </div>
          </div>

          {/* Slider 3: Cotação Algodão */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-[#8ca290]">Cotação da Arroba de Algodão:</span>
              <span className="font-mono font-bold text-white tabular-nums">
                R$ {cottonPricePerArroba} <span className="font-normal text-[#718574]">/ @</span>
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="220"
              step="2"
              value={cottonPricePerArroba}
              onChange={(e) => setCottonPricePerArroba(Number(e.target.value))}
              className="w-full accent-[#70a37e] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#5f7463] mt-1">
              <span>R$ 100</span>
              <span>R$ 138 (Média CEPEA)</span>
              <span>R$ 220</span>
            </div>
          </div>

          {/* Slider 4: Atraso de Aplicação */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-[#8ca290]">Atraso Simulado de Aplicação:</span>
              <span className={`font-mono font-bold tabular-nums ${delayDays > 0 ? 'text-[#ff9e85]' : 'text-[#9de8b2]'}`}>
                {delayDays === 0 ? '0 dias (No Prazo Ideal)' : `+${delayDays} dias de atraso`}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="7"
              step="1"
              value={delayDays}
              onChange={(e) => setDelayDays(Number(e.target.value))}
              className="w-full accent-[#c89b53] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#5f7463] mt-1">
              <span>Hoje</span>
              <span>+3 dias</span>
              <span>+7 dias (Crítico)</span>
            </div>
          </div>
        </div>

        {/* Dynamic Financial Results & Chart (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-xl border border-[#222e25] bg-[#111713] p-5 text-[#e0eae0]">
          <div>
            <div className="flex items-center justify-between border-b border-[#1f2b21] pb-3 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#708472]">
                  RESULTADO ECONÔMICO PROJETADO
                </span>
                <h2 className="text-sm font-semibold text-white">Balanço de Perdas Evitadas vs Custo</h2>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#718574]">Benefício Líquido:</span>
                <p className="text-2xl font-bold font-mono text-[#9de8b2] tabular-nums">
                  R$ {netFinancialBenefit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* 3 Metric Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              <div className="rounded-lg border border-[#202b22] bg-[#141d16] p-3">
                <span className="text-[11px] text-[#718574] block">Custo Total de Aplicação</span>
                <p className="text-lg font-bold text-white font-mono mt-0.5 tabular-nums">
                  R$ {applicationCostTotal.toLocaleString('pt-BR')}
                </p>
              </div>

              <div className="rounded-lg border border-[#202b22] bg-[#141d16] p-3">
                <span className="text-[11px] text-[#718574] block">Valor Preservado na Safra</span>
                <p className="text-lg font-bold text-[#86a88b] font-mono mt-0.5 tabular-nums">
                  R$ {Math.round(valuePreservedBrl).toLocaleString('pt-BR')}
                </p>
              </div>

              <div className="rounded-lg border border-[#202b22] bg-[#141d16] p-3">
                <span className="text-[11px] text-[#718574] block">ROI da Decisão Preventiva</span>
                <p className="text-lg font-bold text-[#c89b53] font-mono mt-0.5 tabular-nums">
                  {Math.round(returnOnInvestment)}%
                </p>
              </div>
            </div>

            {/* Chart: Comparative Scenarios */}
            <div className="h-52 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1c271f" vertical={false} />
                  <XAxis dataKey="scenario" stroke="#637968" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#637968" tick={{ fontSize: 11 }} unit="k" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#111713',
                      borderColor: '#293a2d',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#e4eae2',
                    }}
                    formatter={(val: any) => [`R$ ${val} mil`, '']}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
                  <Bar dataKey="custo" name="Custo de Aplicação" fill="#586c5c" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="preservado" name="Valor Preservado" fill="#70a37e" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="liquido" name="Saldo Líquido" fill="#d1a342" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1c271f] flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-[#7f9482] gap-2">
            <span>Calda poupada via taxa variável: <strong className="text-white">{spraySavedLiters.toLocaleString()} L</strong></span>
            <span>Economia de carbono equivalente: <strong className="text-[#70a37e]">1,4 t CO₂e</strong></span>
          </div>
        </div>
      </div>

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
