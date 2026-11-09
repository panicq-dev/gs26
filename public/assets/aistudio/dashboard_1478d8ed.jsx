"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Bug,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Cloud,
  CloudRain,
  Compass,
  Droplets,
  Ellipsis,
  Gauge,
  Layers2,
  Leaf,
  Map,
  Menu,
  PanelLeftClose,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sprout,
  Sun,
  Thermometer,
  TrendingDown,
  Wheat,
  Wind,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";

const navigation = [
  {
    label: "Visão geral",
    icon: Gauge,
    items: [{ label: "Dashboard", active: true }],
  },
  {
    label: "Inteligência",
    icon: Activity,
    items: [
      { label: "Mapa de risco", icon: Map, badge: "3" },
      { label: "Pragas e doenças", icon: Bug },
    ],
  },
  {
    label: "Operação",
    icon: Layers2,
    items: [
      { label: "Insumos & estoque", icon: Wheat },
      { label: "Fornecedores", icon: Compass },
    ],
  },
  {
    label: "Planejamento",
    icon: SlidersHorizontal,
    items: [{ label: "Simulador financeiro", icon: TrendingDown }],
  },
];

const riskRows = [
  {
    name: "Bicudo-do-algodoeiro",
    scientific: "Anthonomus grandis",
    probability: 78,
    level: "Alto",
    levelClass: "high",
    color: "#d47b42",
    icon: Bug,
    field: "Talhão 08 · Setor Norte",
  },
  {
    name: "Ramularia",
    scientific: "Ramularia areola",
    probability: 42,
    level: "Atenção",
    levelClass: "medium",
    color: "#d1a342",
    icon: Leaf,
    field: "Talhão 12 · Baixada",
  },
  {
    name: "Mosca-branca",
    scientific: "Bemisia tabaci",
    probability: 19,
    level: "Baixo",
    levelClass: "low",
    color: "#639777",
    icon: Wind,
    field: "Talhão 03 · Leste",
  },
];

const cashFlowData = [
  { day: "Out 10", value: 121 },
  { day: "Out 17", value: 134 },
  { day: "Out 24", value: 148 },
  { day: "Out 31", value: 159 },
  { day: "Nov 01", value: 166 },
  { day: "Nov 03", value: 173 },
  { day: "Nov 05", value: 179 },
  { day: "Nov 07", value: 184.6 },
];

function Logo({ compact = false }) {
  return (
    <div className={`brand ${compact ? "brand-compact" : ""}`}>
      <div className="brand-mark" aria-hidden="true">
        <Sprout size={19} strokeWidth={2.2} />
      </div>
      {!compact && (
        <span className="brand-name">
          campo<span>alto</span>
        </span>
      )}
    </div>
  );
}

function Sidebar({ collapsed, onToggle, activePage, onNavigate }) {
  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>
      <div className="sidebar-top">
        <Logo compact={collapsed} />
        {!collapsed && <span className="sidebar-edition">AGRO INTELLIGENCE</span>}
      </div>

      <button className="farm-switcher" type="button" title="Fazenda Santa Helena">
        <span className="farm-avatar"><Wheat size={17} /></span>
        {!collapsed && (
          <>
            <span className="farm-copy">
              <strong>Santa Helena</strong>
              <small>Ribeirão Preto, SP</small>
            </span>
            <ChevronDown size={15} className="farm-chevron" />
          </>
        )}
      </button>

      <nav className="side-nav" aria-label="Navegação principal">
        {navigation.map((group) => (
          <div className="nav-group" key={group.label}>
            {!collapsed && <p className="nav-heading">{group.label}</p>}
            {group.items.map((item) => {
              const Icon = item.icon ?? group.icon;
              const selected = activePage === item.label;
              return (
                <button
                  type="button"
                  key={item.label}
                  className={`nav-link ${selected ? "nav-link-active" : ""}`}
                  aria-current={selected ? "page" : undefined}
                  title={collapsed ? item.label : undefined}
                  onClick={() => onNavigate(item.label)}
                >
                  <Icon size={17} strokeWidth={1.8} />
                  {!collapsed && <span>{item.label}</span>}
                  {!collapsed && item.badge && <span className="nav-badge">{item.badge}</span>}
                  {collapsed && item.badge && <span className="nav-dot" />}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="season-mini">
          <span className="season-icon"><Sun size={15} /></span>
          {!collapsed && (
            <span>
              <strong>Safra 26/27</strong>
              <small>Em andamento</small>
            </span>
          )}
          {!collapsed && <span className="season-status" />}
        </div>
        <button
          type="button"
          className="collapse-button"
          onClick={onToggle}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          {collapsed ? <PanelLeftClose size={17} /> : <ChevronLeft size={17} />}
          {!collapsed && <span>Recolher menu</span>}
        </button>
        <button className="profile-link" type="button" title="Perfil de Mariana Costa">
          <span className="profile-avatar">MC</span>
          {!collapsed && (
            <>
              <span className="profile-copy"><strong>Mariana Costa</strong><small>Gerente agrícola</small></span>
              <Ellipsis size={18} />
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

function Topbar({ onMobileMenu, noticeOpen, onNoticeToggle }) {
  return (
    <header className="topbar">
      <button className="mobile-menu" type="button" onClick={onMobileMenu} aria-label="Abrir menu">
        <Menu size={20} />
      </button>
      <div className="breadcrumbs">
        <span>Santa Helena</span>
        <ChevronRight size={14} />
        <strong>Visão geral</strong>
      </div>
      <div className="topbar-actions">
        <div className="sync-status"><span className="sync-dot" /> Cenário demonstrativo</div>
        <button className="icon-button search-button" aria-label="Buscar" type="button"><Search size={17} /><kbd>⌘ K</kbd></button>
        <div className="notification-wrap">
          <button
            className="icon-button notification-button"
            aria-label="Notificações"
            aria-expanded={noticeOpen}
            type="button"
            onClick={onNoticeToggle}
          >
            <Bell size={17} />
            <span className="notification-dot" />
          </button>
          <AnimatePresence>
            {noticeOpen && (
              <motion.div
                className="notification-popover"
                initial={{ opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 7 }}
              >
                <div className="popover-heading"><strong>Notificações</strong><span>2 novas</span></div>
                <div className="popover-item"><span className="popover-icon warning"><CloudRain size={15} /></span><span><strong>Chuva intensa prevista</strong><small>Talhões 08 e 09 · há 12 min</small></span></div>
                <div className="popover-item"><span className="popover-icon success"><ShieldCheck size={15} /></span><span><strong>Alerta preventivo resolvido</strong><small>Talhão 03 · há 1 h</small></span></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <span className="topbar-divider" />
        <button className="topbar-avatar" type="button" aria-label="Perfil de Mariana Costa">MC</button>
      </div>
    </header>
  );
}

function SectionHeading({ eyebrow, title, action, icon: Icon }) {
  return (
    <div className="section-heading">
      <div className="section-title-wrap">
        {Icon && <span className="section-icon"><Icon size={16} /></span>}
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h2>{title}</h2>
        </div>
      </div>
      {action}
    </div>
  );
}

function MetricCard({ label, value, suffix, detail, trend, trendUp, icon: Icon, tone }) {
  return (
    <motion.article className={`metric-card ${tone ?? ""}`} whileHover={{ y: -2 }} transition={{ duration: 0.18 }}>
      <div className="metric-top">
        <span>{label}</span>
        <span className={`metric-icon ${tone ?? ""}`}><Icon size={16} /></span>
      </div>
      <div className="metric-value">{value}<small>{suffix}</small></div>
      <div className="metric-bottom">
        <span className={`metric-trend ${trendUp ? "trend-positive" : "trend-neutral"}`}>
          {trendUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{trend}
        </span>
        <span>{detail}</span>
      </div>
    </motion.article>
  );
}

function FieldMap({ riskLayer, setRiskLayer }) {
  return (
    <article className="surface map-card">
      <div className="map-header">
        <SectionHeading
          eyebrow="SANTA HELENA · RIBEIRÃO PRETO, SP"
          title="Mapa de incidência"
          icon={Map}
          action={<button className="more-button" type="button" aria-label="Mais opções do mapa"><Ellipsis size={19} /></button>}
        />
        <div className="map-tools">
          <div className="segmented-control" aria-label="Camada do mapa">
            <button type="button" className={!riskLayer ? "selected" : ""} onClick={() => setRiskLayer(false)}><Layers2 size={14} /> Talhões</button>
            <button type="button" className={riskLayer ? "selected" : ""} onClick={() => setRiskLayer(true)}><Activity size={14} /> Risco</button>
          </div>
          <button className="map-expand" type="button" aria-label="Expandir mapa"><Plus size={16} /></button>
        </div>
      </div>
      <div className={`map-canvas ${riskLayer ? "risk-layer" : ""}`}>
        <svg className="field-svg" viewBox="0 0 760 340" role="img" aria-label="Mapa ilustrativo dos talhões da Fazenda Santa Helena com focos de risco no setor norte">
          <defs>
            <pattern id="fieldRows" width="12" height="12" patternTransform="rotate(32)" patternUnits="userSpaceOnUse">
              <rect width="12" height="12" fill="#e8ece2" />
              <path d="M 0 0 L 0 12" stroke="#dce3d6" strokeWidth="2" />
            </pattern>
            <pattern id="fieldRowsDark" width="12" height="12" patternTransform="rotate(32)" patternUnits="userSpaceOnUse">
              <rect width="12" height="12" fill="#d9e3d3" />
              <path d="M 0 0 L 0 12" stroke="#c6d5c1" strokeWidth="2" />
            </pattern>
            <radialGradient id="hotspot">
              <stop offset="0%" stopColor="#eb7351" stopOpacity=".72" />
              <stop offset="50%" stopColor="#e9a259" stopOpacity=".38" />
              <stop offset="100%" stopColor="#e9a259" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="coolspot">
              <stop offset="0%" stopColor="#d0a646" stopOpacity=".53" />
              <stop offset="100%" stopColor="#d0a646" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="760" height="340" fill="#e9ede5" />
          <path d="M0 64 Q120 36 240 72 T480 56 T760 78 V0 H0Z" fill="#e1e9e4" />
          <path d="M0 292 C130 270 172 312 278 284 S456 280 552 302 S672 286 760 298 V340 H0Z" fill="#dde7dd" />
          <path d="M12 185 C136 163 156 207 270 180 S416 168 520 195 S660 211 760 174" fill="none" stroke="#b8cdbb" strokeWidth="15" opacity=".8" />
          <path d="M12 185 C136 163 156 207 270 180 S416 168 520 195 S660 211 760 174" fill="none" stroke="#f4f4e9" strokeWidth="3" opacity=".9" />
          <g className="field-boundaries">
            <path d="M55 58 L196 42 L217 119 L74 139Z" fill="url(#fieldRows)" />
            <path d="M202 40 L343 49 L337 128 L220 119Z" fill="url(#fieldRowsDark)" />
            <path d="M349 47 L502 36 L520 112 L342 129Z" fill="url(#fieldRows)" />
            <path d="M510 39 L676 58 L654 132 L523 114Z" fill="url(#fieldRowsDark)" />
            <path d="M73 144 L215 125 L234 215 L89 224Z" fill="url(#fieldRowsDark)" />
            <path d="M221 126 L340 134 L334 220 L238 214Z" fill="url(#fieldRows)" />
            <path d="M346 133 L518 119 L536 217 L338 222Z" fill="url(#fieldRowsDark)" />
            <path d="M523 120 L651 137 L670 216 L540 220Z" fill="url(#fieldRows)" />
            <path d="M92 230 L236 220 L250 302 L112 310Z" fill="url(#fieldRows)" />
            <path d="M242 220 L335 226 L348 303 L255 300Z" fill="url(#fieldRowsDark)" />
            <path d="M343 228 L536 223 L551 301 L354 306Z" fill="url(#fieldRows)" />
            <path d="M543 225 L672 222 L697 293 L560 302Z" fill="url(#fieldRowsDark)" />
            <path d="M55 58 L196 42 L217 119 L74 139Z" />
            <path d="M202 40 L343 49 L337 128 L220 119Z" />
            <path d="M349 47 L502 36 L520 112 L342 129Z" />
            <path d="M510 39 L676 58 L654 132 L523 114Z" />
            <path d="M73 144 L215 125 L234 215 L89 224Z" />
            <path d="M221 126 L340 134 L334 220 L238 214Z" />
            <path d="M346 133 L518 119 L536 217 L338 222Z" />
            <path d="M523 120 L651 137 L670 216 L540 220Z" />
            <path d="M92 230 L236 220 L250 302 L112 310Z" />
            <path d="M242 220 L335 226 L348 303 L255 300Z" />
            <path d="M343 228 L536 223 L551 301 L354 306Z" />
            <path d="M543 225 L672 222 L697 293 L560 302Z" />
          </g>
          {riskLayer && (
            <g className="heat-layer">
              <ellipse cx="588" cy="91" rx="112" ry="76" fill="url(#hotspot)" />
              <ellipse cx="430" cy="169" rx="99" ry="66" fill="url(#coolspot)" />
              <ellipse cx="174" cy="256" rx="91" ry="58" fill="url(#coolspot)" />
            </g>
          )}
          <g className="map-labels">
            <text x="127" y="94">TALHÃO 02</text><text x="127" y="106">128 ha</text>
            <text x="269" y="86">TALHÃO 05</text><text x="269" y="98">96 ha</text>
            <text x="426" y="86">TALHÃO 08</text><text x="426" y="98">142 ha</text>
            <text x="579" y="89">TALHÃO 09</text><text x="579" y="101">118 ha</text>
            <text x="143" y="181">TALHÃO 03</text><text x="143" y="193">104 ha</text>
            <text x="276" y="177">TALHÃO 06</text><text x="276" y="189">86 ha</text>
            <text x="433" y="178">TALHÃO 12</text><text x="433" y="190">113 ha</text>
            <text x="588" y="177">TALHÃO 14</text><text x="588" y="189">91 ha</text>
            <text x="167" y="267">TALHÃO 04</text><text x="167" y="279">108 ha</text>
            <text x="439" y="269">TALHÃO 11</text><text x="439" y="281">127 ha</text>
          </g>
          {riskLayer && (
            <>
              <g className="risk-marker"><circle cx="595" cy="83" r="13" /><Bug x="588" y="76" width="14" height="14" /><text x="615" y="81">78%</text></g>
              <g className="risk-marker risk-marker-secondary"><circle cx="438" cy="164" r="11" /><Leaf x="432" y="158" width="12" height="12" /><text x="455" y="162">42%</text></g>
            </>
          )}
          <g transform="translate(720 25)" className="north-marker"><path d="M0 17 7 0l7 17-7-4z" /><text x="4" y="28">N</text></g>
        </svg>
        <div className="map-legend"><span className="legend-dot low" /> Baixo <span className="legend-dot medium" /> Atenção <span className="legend-dot high" /> Alto</div>
        <div className="map-location"><span className="location-dot" /><span>Fazenda Santa Helena</span><small>21°10&apos; S · 47°48&apos; O</small></div>
        <div className="map-scale"><span>0</span><i /><span>500 m</span></div>
      </div>
      <div className="map-footer">
        <span><span className="status-pulse" /> <strong>12 talhões monitorados</strong></span>
        <span>Último voo de drone <strong>hoje, 06:42</strong></span>
        <button type="button" onClick={() => setRiskLayer(!riskLayer)}>{riskLayer ? "Ocultar focos" : "Ver focos no mapa"} <ArrowRight size={14} /></button>
      </div>
    </article>
  );
}

function RiskPanel() {
  return (
    <article className="surface risk-card">
      <SectionHeading
        eyebrow="MODELO PREDITIVO · PRÓXIMOS 7 DIAS"
        title="Risco fitossanitário"
        icon={ShieldCheck}
        action={<button className="text-action" type="button">Ver análises <ArrowRight size={14} /></button>}
      />
      <div className="risk-context">
        <span><Droplets size={14} /> Umidade média <strong>78%</strong></span>
        <span><Thermometer size={14} /> Temperatura <strong>27°</strong></span>
      </div>
      <div className="risk-list">
        {riskRows.map((risk) => {
          const Icon = risk.icon;
          return (
            <div className="risk-row" key={risk.name}>
              <span className="risk-pest-icon" style={{ "--risk-color": risk.color }}><Icon size={16} /></span>
              <div className="risk-info">
                <div className="risk-name-line"><strong>{risk.name}</strong><span className={`risk-tag ${risk.levelClass}`}>{risk.level}</span></div>
                <small>{risk.scientific} · {risk.field}</small>
                <div className="risk-progress"><span style={{ width: `${risk.probability}%`, background: risk.color }} /></div>
              </div>
              <div className="risk-probability">{risk.probability}<small>%</small></div>
            </div>
          );
        })}
      </div>
      <div className="risk-note"><span className="risk-note-icon"><Activity size={15} /></span><p><strong>Ação recomendada · próximas 36 h</strong><br />Inspecionar botões florais no setor norte antes de definir o manejo.</p></div>
      <button className="risk-cta" type="button">Abrir plano de manejo <ArrowRight size={15} /></button>
    </article>
  );
}

function SavingsCard() {
  return (
    <article className="surface savings-card">
      <div className="savings-heading">
        <span className="savings-icon"><ShieldCheck size={17} /></span>
        <span className="savings-period">CENÁRIO DEMONSTRATIVO · SAFRA 26/27</span>
        <button className="more-button" type="button" aria-label="Mais opções de perdas evitadas"><Ellipsis size={19} /></button>
      </div>
      <p className="savings-label">Perdas evitadas · estimativa simulada</p>
      <div className="savings-value">R$ 184.620<span>,40</span></div>
      <p className="savings-description">Estimativa de economia com decisões preventivas validadas pela plataforma.</p>
      <div className="savings-divider" />
      <div className="chart-label-row"><span>Economia acumulada</span><span>out — nov</span></div>
      <div className="savings-breakdown">
        <span><span className="breakdown-dot green" /> Defensivos poupados <strong>R$ 62,4 mil</strong></span>
        <span><span className="breakdown-dot ochre" /> Perda de produtividade <strong>R$ 122,2 mil</strong></span>
      </div>
      <div className="savings-chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={cashFlowData} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="savingsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6d9d7e" stopOpacity={0.24} />
                <stop offset="100%" stopColor="#6d9d7e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#edf0eb" strokeDasharray="3 4" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#92988f", fontSize: 10 }} tickMargin={7} />
            <Tooltip
              cursor={{ stroke: "#9bb6a0", strokeDasharray: "3 3" }}
              contentStyle={{ border: "1px solid #e8ece6", borderRadius: 9, fontSize: 12, boxShadow: "0 6px 20px rgba(28,43,32,.08)" }}
              formatter={(value) => [`R$ ${value} mil`, "Economia acumulada"]}
            />
            <Area type="monotone" dataKey="value" stroke="#588568" strokeWidth={2} fill="url(#savingsFill)" activeDot={{ r: 4, fill: "#588568", stroke: "#fff", strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}

function DecisionCard() {
  return (
    <article className="surface decision-card">
      <div className="decision-head">
        <span className="decision-icon"><Droplets size={16} /></span>
        <span className="eyebrow">IMPACTO DE ONTEM</span>
        <span className="decision-check"><Check size={13} /> Aplicada</span>
      </div>
      <h2>Sua decisão evitou aplicar<br /><em>3.420 litros</em> de calda.</h2>
      <p>Adiar a aplicação no Talhão 03 evitou uma pulverização desnecessária. O monitoramento confirmou baixa pressão de mosca-branca.</p>
      <div className="decision-outcome">
        <div><small>Economia estimada</small><strong>R$ 8.960</strong></div>
        <span className="outcome-divider" />
        <div><small>Emissões evitadas</small><strong>1,2 t CO₂e</strong></div>
      </div>
      <button className="decision-link" type="button">Ver histórico de decisões <ArrowRight size={14} /></button>
      <div className="decision-decoration" aria-hidden="true"><div /><div /><div /></div>
    </article>
  );
}

function WeatherCard() {
  return (
    <article className="surface weather-card">
      <div className="weather-title">
        <div>
          <p className="eyebrow">CLIMA · PRÓXIMAS 48 HORAS</p>
          <h2>Chuva pode interromper a operação</h2>
        </div>
        <span className="weather-icon"><CloudRain size={22} /></span>
      </div>
      <p className="weather-alert"><span className="alert-dot" /> Janela para aplicação se encerra hoje às 16h</p>
      <div className="weather-main">
        <div className="rain-chance"><strong>48<span> mm</span></strong><small>chuva acumulada</small></div>
        <div className="rain-details">
          <span><Cloud size={14} /> Previsão para os talhões 08–12</span>
          <span><Wind size={14} /> Vento abaixo de 12 km/h até 16h</span>
          <span><Thermometer size={14} /> Mín. 19° <i /> Máx. 29°</span>
        </div>
      </div>
      <div className="weather-source"><CloudRain size={13} /><span>Planeje a pulverização antes da mudança de tempo</span><strong>16:00</strong></div>
      <p className="weather-disclaimer">Exemplo de operação · previsão ilustrativa, sem leitura de estação.</p>
    </article>
  );
}

function EmptySupplyCard({ onNavigate }) {
  return (
    <article className="supply-strip">
      <div className="supply-strip-icon"><Wheat size={18} /></div>
      <div className="supply-strip-copy">
        <strong>Próxima reposição de ureia em 18 dias</strong>
        <span>Estoque atual cobre a adubação de cobertura dos talhões 05, 08 e 09.</span>
      </div>
      <div className="stock-indicator"><span /><span /><span /><span /><span /></div>
      <span className="stock-quantity"><strong>2,4 t</strong><small>estoque seguro</small></span>
      <button type="button" onClick={() => onNavigate("Insumos & estoque")}>Ver estoque <ArrowRight size={14} /></button>
    </article>
  );
}

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");
  const [riskLayer, setRiskLayer] = useState(true);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState("");

  function navigate(label) {
    setActivePage(label);
    setMobileMenuOpen(false);
    if (label !== "Dashboard" && label !== "Mapa de risco") {
      setToast(`${label} estará disponível nesta próxima etapa.`);
      window.setTimeout(() => setToast(""), 3200);
    } else if (label === "Mapa de risco") {
      setRiskLayer(true);
    }
  }

  return (
    <div className="app-shell">
      <div className={`mobile-scrim ${mobileMenuOpen ? "visible" : ""}`} onClick={() => setMobileMenuOpen(false)} />
      <div className={`sidebar-wrap ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} activePage={activePage} onNavigate={navigate} />
        <button className="mobile-close" type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Fechar menu"><X size={18} /></button>
      </div>

      <main className={`main-panel ${collapsed ? "main-expanded" : ""}`}>
        <Topbar
          onMobileMenu={() => {
            setCollapsed(false);
            setMobileMenuOpen(true);
          }}
          noticeOpen={noticeOpen}
          onNoticeToggle={() => setNoticeOpen(!noticeOpen)}
        />
        <div className="dashboard-content">
          <motion.div
            className="page-intro"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div>
              <div className="welcome-line"><span className="welcome-sun"><Sun size={15} /></span> SÁBADO, 7 DE NOVEMBRO DE 2026</div>
              <h1>Bom dia, Mariana <span>—</span></h1>
              <p>Prioridades para a operação de hoje na Fazenda Santa Helena.</p>
            </div>
            <div className="intro-actions">
              <span className="demo-badge"><span /> DADOS DE EXEMPLO · SEM TELEMETRIA</span>
              <button className="date-filter" type="button"><CalendarDays size={15} /><span>Safra 26/27</span><ChevronDown size={14} /></button>
            </div>
          </motion.div>

          <section className="metrics-section" aria-label="Indicadores operacionais da safra">
            <div className="metrics-heading">
              <div>
                <p className="eyebrow">INDICADORES · VISÃO DA SAFRA</p>
                <h2>Resumo da operação</h2>
              </div>
              <span>Algodão <i /> 12 talhões <i /> 1.248 ha mapeados</span>
            </div>
            <div className="metric-grid">
              <MetricCard label="Área monitorada" value="1.248" suffix=" ha" detail="cadastro demonstrativo" trend="12 talhões" trendUp icon={Map} />
              <MetricCard label="Perdas evitadas" value="R$ 184,6" suffix=" mil" detail="prevenção · cenário de exemplo" trend="+18,4%" trendUp icon={ShieldCheck} tone="metric-green" />
              <MetricCard label="Calda poupada" value="3.420" suffix=" L" detail="comparativo simulado de aplicação" trend="−12,8%" trendUp={false} icon={Droplets} tone="metric-blue" />
              <MetricCard label="Produtividade estimada" value="318" suffix=" @/ha" detail="comparada à projeção de base" trend="+6,2%" trendUp icon={Sprout} tone="metric-gold" />
            </div>
          </section>

          <section className="dashboard-grid" aria-label="Operação e prioridades da fazenda">
            <FieldMap riskLayer={riskLayer} setRiskLayer={setRiskLayer} />
            <RiskPanel />
            <WeatherCard />
            <SavingsCard />
            <DecisionCard />
            <EmptySupplyCard onNavigate={navigate} />
          </section>

          <footer className="dashboard-footer">
            <span><span className="footer-leaf"><Leaf size={13} /></span> Inteligência que cultiva decisões melhores.</span>
            <span>Dados ilustrativos · sem integração com estação, satélite ou maquinário <i /> Campoalto v1.8.2</span>
            <button type="button"><CircleHelp size={14} /> Central de ajuda</button>
          </footer>
        </div>
      </main>

      <AnimatePresence>
        {toast && (
          <motion.div className="toast-message" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}>
            <CircleHelp size={16} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
