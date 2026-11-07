import React, { useState } from 'react';
import {
  Gauge,
  Map,
  Bug,
  Wheat,
  Compass,
  TrendingDown,
  Sprout,
  ChevronDown,
  PanelLeftClose,
  ChevronLeft,
  ChevronRight,
  Check,
  Building2,
  Calendar,
} from 'lucide-react';

export type NavPage =
  | 'Dashboard'
  | 'Mapa de risco'
  | 'Pragas e doenças'
  | 'Insumos & estoque'
  | 'Fornecedores'
  | 'Simulador financeiro';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  activePage: NavPage;
  onNavigate: (page: NavPage) => void;
  farmName: string;
  onSelectFarm: (name: string) => void;
}

const FARMS = [
  { name: 'Fazenda Santa Helena', location: 'Ribeirão Preto, SP', area: '1.248 ha' },
  { name: 'Estância Morro Verde', location: 'Franca, SP', area: '890 ha' },
  { name: 'Fazenda Rio Claro', location: 'Araraquara, SP', area: '2.150 ha' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  activePage,
  onNavigate,
  farmName,
  onSelectFarm,
}) => {
  const [farmMenuOpen, setFarmMenuOpen] = useState(false);

  const navigationGroups = [
    {
      label: 'Visão geral',
      items: [
        { label: 'Dashboard' as NavPage, icon: Gauge, badge: undefined },
      ],
    },
    {
      label: 'Inteligência',
      items: [
        { label: 'Mapa de risco' as NavPage, icon: Map, badge: '3' },
        { label: 'Pragas e doenças' as NavPage, icon: Bug, badge: undefined },
      ],
    },
    {
      label: 'Operação',
      items: [
        { label: 'Insumos & estoque' as NavPage, icon: Wheat, badge: '1' },
        { label: 'Fornecedores' as NavPage, icon: Compass, badge: undefined },
      ],
    },
    {
      label: 'Planejamento',
      items: [
        { label: 'Simulador financeiro' as NavPage, icon: TrendingDown, badge: undefined },
      ],
    },
  ];

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-30 flex flex-col border-r border-[#1e2820] bg-[#0c120e] transition-all duration-300 ${
        collapsed ? 'w-[72px]' : 'w-[260px]'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-[#1b251d]">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#2b3b2f] bg-[#162118] text-[#86a88b] shadow-inner">
            <Sprout className="h-4 w-4 text-[#86a88b]" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-[#f0f4ef]">
                campo<span className="font-normal text-[#86a88b]">alto</span>
              </span>
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#667a6a]">
                Inteligência Agrícola
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onToggleCollapse}
          className="rounded p-1 text-[#6e8271] hover:bg-[#162218] hover:text-[#e4eae2] transition-colors"
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Farm Switcher */}
      <div className="relative p-3">
        <button
          type="button"
          onClick={() => setFarmMenuOpen(!farmMenuOpen)}
          className={`flex w-full items-center gap-2.5 rounded-lg border border-[#222e24] bg-[#131b15] p-2 text-left hover:border-[#314234] transition-colors ${
            collapsed ? 'justify-center p-2' : ''
          }`}
          title={farmName}
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#1a291d] text-[#c89b53]">
            <Building2 className="h-4 w-4" />
          </div>
          {!collapsed && (
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-xs font-semibold text-[#e1e9e0]">{farmName}</span>
              <span className="truncate text-[10px] text-[#718574]">Ribeirão Preto, SP · 1.248 ha</span>
            </div>
          )}
          {!collapsed && <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#677a6a]" />}
        </button>

        {/* Farm dropdown */}
        {farmMenuOpen && !collapsed && (
          <div className="absolute top-full left-3 right-3 z-50 mt-1 rounded-lg border border-[#2c3c2f] bg-[#121a14] p-1.5 shadow-2xl backdrop-blur-md">
            <span className="block px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-[#6d8270]">
              Propriedades Rurais
            </span>
            {FARMS.map((f) => (
              <button
                key={f.name}
                type="button"
                onClick={() => {
                  onSelectFarm(f.name);
                  setFarmMenuOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-left transition-colors ${
                  f.name === farmName ? 'bg-[#1e2c21] text-[#9de8b2] font-semibold' : 'text-[#c2cec1] hover:bg-[#18231a]'
                }`}
              >
                <div>
                  <p className="font-medium">{f.name}</p>
                  <p className="text-[10px] text-[#718573]">{f.location} · {f.area}</p>
                </div>
                {f.name === farmName && <Check className="h-3.5 w-3.5 text-[#70a37e]" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 space-y-5 px-3 py-2 overflow-y-auto" aria-label="Navegação da Fazenda">
        {navigationGroups.map((group) => (
          <div key={group.label} className="space-y-1">
            {!collapsed && (
              <p className="px-2.5 text-[10px] font-mono uppercase tracking-wider text-[#5f7362]">
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isSelected = activePage === item.label;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => onNavigate(item.label)}
                  title={collapsed ? item.label : undefined}
                  className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-[#1c2920] text-[#f2f7f1] shadow-sm border border-[#2b3f30]'
                      : 'text-[#8da090] hover:bg-[#141d16] hover:text-[#e0ebe0]'
                  } ${collapsed ? 'justify-center px-0' : ''}`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isSelected ? 'text-[#86a88b]' : 'text-[#6e8372]'
                    }`}
                  />
                  {!collapsed && <span className="flex-1 text-left truncate">{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-[#eb7351]/20 px-1 text-[10px] font-mono font-bold text-[#ff9980] border border-[#eb7351]/40">
                      {item.badge}
                    </span>
                  )}
                  {collapsed && item.badge && (
                    <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-[#eb7351]" />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom Season & Profile */}
      <div className="border-t border-[#1c261e] p-3 space-y-2.5">
        {!collapsed && (
          <div className="flex items-center justify-between rounded-lg border border-[#202b22] bg-[#101712] p-2 text-xs text-[#8ca08e]">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-[#c89b53]" />
              <div className="flex flex-col">
                <span className="font-semibold text-[11px] text-[#e0eae0]">Safra 2026/2027</span>
                <span className="text-[9px] text-[#6e8271]">Em andamento · Algodão</span>
              </div>
            </div>
            <span className="h-2 w-2 rounded-full bg-[#70a37e]" title="Operação ativa" />
          </div>
        )}

        {/* Manager User */}
        <div className={`flex items-center gap-2.5 ${collapsed ? 'justify-center' : ''}`}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#37473a] bg-[#1e2c22] font-mono text-xs font-bold text-[#c9dbcc]">
            MC
          </div>
          {!collapsed && (
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-xs font-semibold text-[#e1e9e0]">Mariana Costa</span>
              <span className="truncate text-[10px] text-[#718574]">Gerente Agrícola de Precisão</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
