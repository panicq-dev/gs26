import React from 'react';
import {
  Map,
  ShieldCheck,
  Droplets,
  Sprout,
  ArrowUpRight,
  ArrowDownRight,
  CloudRain,
  Wind,
  Thermometer,
  Activity,
  ArrowRight,
  Check,
  Wheat,
  Clock,
  ExternalLink,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Talhao, PestRecord } from '../../types/agro';
import { FieldTerrain3D } from '../three/FieldTerrain3D';
import {
  CUMULATIVE_SAVINGS_HISTORY,
  HOURLY_WEATHER_48H,
} from '../../data/mockAgroData';
import { NavPage } from '../layout/Sidebar';

interface OverviewTabProps {
  talhoes: Talhao[];
  pests: PestRecord[];
  selectedTalhao: Talhao | null;
  onSelectTalhao: (talhao: Talhao) => void;
  onNavigate: (page: NavPage) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  talhoes,
  pests,
  selectedTalhao,
  onSelectTalhao,
  onNavigate,
}) => {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#1f2c22] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#79907c]">
            <span>Sábado, 7 de Novembro de 2026</span>
            <span>·</span>
            <span>Estação Meteorológica Integrada</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Bom dia, Mariana <span className="font-light text-[#59705e]">—</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#8ba28f]">
            Prioridades agronômicas e monitoramento 3D para a Fazenda Santa Helena.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="rounded-lg border border-[#27382c] bg-[#121a14] px-3 py-1.5 text-xs text-[#cad9cc]">
            <span className="text-[#6d8270]">Safra: </span>
            <strong className="text-white font-semibold">2026/2027</strong>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('Mapa de risco')}
            className="flex items-center gap-1.5 rounded-lg border border-[#70a37e]/40 bg-[#172c1e] px-3.5 py-1.5 text-xs font-semibold text-[#b8e8c3] hover:bg-[#1e3b28] transition-colors"
          >
            <Map className="h-3.5 w-3.5 text-[#70a37e]" />
            <span>Abrir Mapa 3D Completo</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <article className="rounded-xl border border-[#222e25] bg-gradient-to-br from-[#131b15] to-[#0f1511] p-4 text-[#e0eae0]">
          <div className="flex items-center justify-between text-xs text-[#7f9482]">
            <span>Área Monitorada</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#2b3a2f] bg-[#172119] text-[#86a88b]">
              <Map className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
            1.248 <span className="text-sm font-sans font-normal text-[#869b89]">ha</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#718574]">
            <span className="font-semibold text-[#86a88b]">12 talhões</span>
            <span>·</span>
            <span>Algodão & rotação soja</span>
          </div>
        </article>

        <article className="rounded-xl border border-[#222e25] bg-gradient-to-br from-[#131b15] to-[#0f1511] p-4 text-[#e0eae0]">
          <div className="flex items-center justify-between text-xs text-[#7f9482]">
            <span>Perdas Evitadas</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#2b3a2f] bg-[#172119] text-[#70a37e]">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
            R$ 184,6 <span className="text-sm font-sans font-normal text-[#869b89]">mil</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#70a37e]">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span className="font-semibold">+18,4%</span>
            <span className="text-[#718574]">prevenção oportuna</span>
          </div>
        </article>

        <article className="rounded-xl border border-[#222e25] bg-gradient-to-br from-[#131b15] to-[#0f1511] p-4 text-[#e0eae0]">
          <div className="flex items-center justify-between text-xs text-[#7f9482]">
            <span>Calda Poupada</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#2b3a2f] bg-[#172119] text-[#6b95a8]">
              <Droplets className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
            3.420 <span className="text-sm font-sans font-normal text-[#869b89]">L</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#6b95a8]">
            <ArrowDownRight className="h-3.5 w-3.5" />
            <span className="font-semibold">−12,8%</span>
            <span className="text-[#718574]">menos defensivo</span>
          </div>
        </article>

        <article className="rounded-xl border border-[#222e25] bg-gradient-to-br from-[#131b15] to-[#0f1511] p-4 text-[#e0eae0]">
          <div className="flex items-center justify-between text-xs text-[#7f9482]">
            <span>Produtividade Estimada</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#2b3a2f] bg-[#172119] text-[#c89b53]">
              <Sprout className="h-3.5 w-3.5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
            318 <span className="text-sm font-sans font-normal text-[#869b89]">@/ha</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#c89b53]">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span className="font-semibold">+6,2%</span>
            <span className="text-[#718574]">acima do projetado</span>
          </div>
        </article>
      </section>

      {/* Main Grid: 3D Topography Viewport + Risk Panel */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 3D Field Map Card (7 cols) */}
        <article className="lg:col-span-7 flex flex-col rounded-xl border border-[#222e25] bg-[#111713] p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#708472]">
                TOPOGRAFIA 3D & RELEVO · RIBEIRÃO PRETO, SP
              </span>
              <h2 className="text-sm font-semibold text-white">Mapa de Incidência Espacial</h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('Mapa de risco')}
              className="flex items-center gap-1 text-xs text-[#86a88b] hover:text-white transition-colors"
            >
              <span>Tela cheia</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>

          {/* Interactive Three.js Topography Viewer */}
          <div className="flex-1 min-h-[340px]">
            <FieldTerrain3D
              talhoes={talhoes}
              selectedTalhaoId={selectedTalhao?.id}
              onSelectTalhao={onSelectTalhao}
              compact
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-[#718574] pt-2 border-t border-[#1c261e]">
            <span>Talhão focado: <strong className="text-white">{selectedTalhao?.code || 'Talhão 08'}</strong> ({selectedTalhao?.areaHa || 142} ha)</span>
            <span className="text-[#8da290]">Voo de drone: <strong>hoje, 06:42</strong></span>
          </div>
        </article>

        {/* Phytosanitary Risk Panel (5 cols) */}
        <article className="lg:col-span-5 flex flex-col rounded-xl border border-[#222e25] bg-[#111713] p-4 text-[#e0eae0]">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#708472]">
                MODELO PREDITIVO · PRÓXIMOS 7 DIAS
              </span>
              <h2 className="text-sm font-semibold text-white">Risco Fitossanitário Ativo</h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('Pragas e doenças')}
              className="text-xs text-[#86a88b] hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Ver todas</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          {/* Environment stats */}
          <div className="flex items-center justify-between rounded-lg border border-[#202c22] bg-[#141d16] px-3 py-2 text-xs text-[#869b88] mb-3">
            <span className="flex items-center gap-1.5">
              <Droplets className="h-3.5 w-3.5 text-[#6b95a8]" />
              Umidade média: <strong className="text-white">78%</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Thermometer className="h-3.5 w-3.5 text-[#c89b53]" />
              Temperatura: <strong className="text-white">27 °C</strong>
            </span>
          </div>

          {/* Top 3 Risk Rows */}
          <div className="space-y-2.5 flex-1">
            {pests.slice(0, 3).map((pest) => (
              <div
                key={pest.id}
                className="rounded-lg border border-[#202b22] bg-[#131b15] p-2.5 hover:border-[#304132] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: pest.color }}
                    />
                    <strong className="text-xs font-semibold text-white">{pest.name}</strong>
                  </div>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase ${
                      pest.riskLevel === 'high'
                        ? 'bg-[#eb7351]/20 text-[#ff8f70] border border-[#eb7351]/40'
                        : pest.riskLevel === 'medium'
                        ? 'bg-[#d1a342]/20 text-[#ebd173] border border-[#d1a342]/40'
                        : 'bg-[#639777]/20 text-[#8ec7a0] border border-[#639777]/30'
                    }`}
                  >
                    {pest.probabilityPct}%
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-[#7c907e] italic">
                  {pest.scientificName} · {pest.primaryLocation}
                </p>

                {/* Progress bar */}
                <div className="mt-2 h-1.5 w-full rounded-full bg-[#1e2a21] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pest.probabilityPct}%`,
                      backgroundColor: pest.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Action Callout */}
          <div className="mt-3 rounded-lg border border-[#3b3220] bg-[#1a1711] p-3 text-xs text-[#cfbc93]">
            <strong className="block font-semibold text-[#f0d499] mb-1">
              Ação Recomendada · Próximas 36h:
            </strong>
            <p className="text-[11px] text-[#b8a782]">
              Inspecionar botões florais no setor norte (Talhões 08 e 09) antes da frente de chuva prevista para o final da tarde.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('Pragas e doenças')}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#2e4032] bg-[#17221a] py-2 text-xs font-medium text-[#c0d4c2] hover:bg-[#1e2e23] hover:text-white transition-colors"
          >
            <span>Abrir Plano de Manejo Fitossanitário</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </article>
      </section>

      {/* Weather 48h Window Strip */}
      <section className="rounded-xl border border-[#222e25] bg-[#111713] p-4 text-[#e0eae0]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#708472]">
              JANELA CLIMÁTICA DE PULVERIZAÇÃO · PRÓXIMAS 48 HORAS
            </span>
            <h2 className="text-sm font-semibold text-white">Previsão e Condição de Aplicação</h2>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-[#c89b53]/40 bg-[#251e12] px-3 py-1.5 text-xs text-[#ecc482]">
            <Clock className="h-3.5 w-3.5" />
            <span>Janela de aplicação encerra hoje às <strong>16:00</strong></span>
          </div>
        </div>

        {/* Hourly Cards Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {HOURLY_WEATHER_48H.map((wh, idx) => (
            <div
              key={wh.hour}
              className={`flex flex-col items-center justify-center min-w-[90px] rounded-lg border p-2.5 text-xs transition-colors ${
                wh.sprayStatus === 'ideal'
                  ? 'border-[#293d2e] bg-[#142017]'
                  : wh.sprayStatus === 'alerta'
                  ? 'border-[#3d3420] bg-[#1f1a11]'
                  : 'border-[#3a2522] bg-[#1f1312]'
              }`}
            >
              <span className="text-[10px] font-mono text-[#829685]">{wh.hour}</span>
              <div className="my-1.5 text-sm font-bold text-white font-mono tabular-nums">
                {wh.temp}°
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[#869b89]">
                <Wind className="h-3 w-3 text-[#6b95a8]" />
                <span>{wh.windSpeed} km/h</span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-[10px]">
                <CloudRain className="h-3 w-3 text-[#6b95a8]" />
                <span className="text-[#829685]">{wh.rainProb}%</span>
              </div>
              <span
                className={`mt-2 rounded px-1.5 py-0.5 text-[9px] font-mono uppercase font-semibold ${
                  wh.sprayStatus === 'ideal'
                    ? 'text-[#8ec7a0] bg-[#639777]/20'
                    : wh.sprayStatus === 'alerta'
                    ? 'text-[#ebd173] bg-[#d1a342]/20'
                    : 'text-[#ff8f70] bg-[#eb7351]/20'
                }`}
              >
                {wh.sprayStatus}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Savings Chart & Decision Impact Strip */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Cumulative Savings (7 cols) */}
        <article className="lg:col-span-7 rounded-xl border border-[#222e25] bg-[#111713] p-4 text-[#e0eae0]">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#708472]">
                ECONOMIA ACUMULADA · SAFRA 26/27
              </span>
              <h2 className="text-sm font-semibold text-white">Evolução de Perdas Evitadas</h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#718574]">Total acumulado:</span>
              <p className="text-lg font-bold font-mono text-[#9de8b2] tabular-nums">R$ 184.620,40</p>
            </div>
          </div>

          <div className="h-48 w-full mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CUMULATIVE_SAVINGS_HISTORY}>
                <defs>
                  <linearGradient id="totalSavingsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#70a37e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#70a37e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2c22" vertical={false} />
                <XAxis dataKey="day" stroke="#5f7463" tick={{ fontSize: 11 }} />
                <YAxis stroke="#5f7463" tick={{ fontSize: 11 }} unit=" mil" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121914',
                    borderColor: '#2b3b2f',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#e4eae2',
                  }}
                  formatter={(val: any) => [`R$ ${val} mil`, 'Economia']}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#70a37e"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#totalSavingsGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 flex items-center justify-between text-xs text-[#7f9482] pt-2 border-t border-[#1c271f]">
            <span>Defensivos poupados: <strong className="text-white">R$ 62,4 mil</strong></span>
            <span>Produtividade preservada: <strong className="text-white">R$ 122,2 mil</strong></span>
          </div>
        </article>

        {/* Yesterday's Decision Impact (5 cols) */}
        <article className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-[#2b3c2e] bg-gradient-to-br from-[#142118] to-[#0f1712] p-4 text-[#e0eae0]">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#86a88b]">
                IMPACTO DA DECISÃO DE ONTEM
              </span>
              <span className="flex items-center gap-1 rounded bg-[#70a37e]/20 px-2 py-0.5 text-[10px] font-medium text-[#9de8b2] border border-[#70a37e]/30">
                <Check className="h-3 w-3" /> Aplicada
              </span>
            </div>

            <h3 className="text-base font-semibold text-white mt-2">
              Sua decisão evitou aplicar <em className="not-italic text-[#70a37e]">3.420 litros</em> de calda.
            </h3>
            <p className="mt-2 text-xs text-[#8da290] leading-relaxed">
              Adiar a aplicação preventiva no Talhão 03 evitou uma pulverização desnecessária. O monitoramento multiespectral confirmou que o limiar de dano econômico não foi ultrapassado.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#203124] grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[11px] text-[#718574]">Economia direta</span>
              <p className="text-base font-bold text-white font-mono tabular-nums">R$ 8.960</p>
            </div>
            <div>
              <span className="text-[11px] text-[#718574]">Pegada de carbono</span>
              <p className="text-base font-bold text-[#86a88b] font-mono tabular-nums">−1,2 t CO₂e</p>
            </div>
          </div>
        </article>
      </section>

      {/* Bottom Supply Strip */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#222e25] bg-[#111713] p-3.5 text-xs text-[#cad9cb]">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#3b321e] bg-[#221c10] text-[#c89b53]">
            <Wheat className="h-4 w-4" />
          </div>
          <div>
            <strong className="block text-white font-semibold">
              Próxima reposição de Ureia Protegida em 18 dias
            </strong>
            <span className="text-[11px] text-[#7f9482]">
              Estoque atual de 2,4 toneladas cobre a adubação de cobertura dos talhões 05, 08 e 09.
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('Insumos & estoque')}
          className="flex items-center gap-1.5 rounded-lg border border-[#2d3e30] bg-[#162218] px-3.5 py-1.5 text-xs font-semibold text-[#86a88b] hover:bg-[#1c2c20] hover:text-white transition-colors shrink-0"
        >
          <span>Conferir Estoque</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </section>
    </div>
  );
};
