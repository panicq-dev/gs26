import {
  Bug,
  ChevronLeft,
  ChevronRight,
  Compass,
  Gauge,
  Map,
  Sprout,
  TrendingDown,
  Wheat,
} from 'lucide-react';

const navigationGroups = [
  {
    label: 'A fazenda',
    items: [{ label: 'Dashboard', icon: Gauge }],
  },
  {
    label: 'Monitoramento',
    items: [
      { label: 'Mapa de risco', icon: Map },
      { label: 'Pragas e doenças', icon: Bug },
    ],
  },
  {
    label: 'Gestão',
    items: [
      { label: 'Insumos & estoque', icon: Wheat },
      { label: 'Fornecedores', icon: Compass },
      { label: 'Simulador financeiro', icon: TrendingDown },
    ],
  },
];

export function Sidebar({
  collapsed,
  onToggleCollapse,
  activePage,
  onNavigate,
  farmName,
}) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-[#27272a] bg-[#101012] transition-all duration-200 lg:z-30 ${
        collapsed ? 'w-[76px]' : 'w-[256px]'
      }`}
    >
      <div className="flex h-[72px] items-center justify-between border-b border-[#27272a] px-5">
        <a
          href="#conteudo"
          aria-label="Campoalto, ir para o conteúdo"
          className="flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-[#638251]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#1b1b1f] text-[#c4cfad]">
            <Sprout className="h-[21px] w-[21px]" strokeWidth={1.8} />
          </span>
          {!collapsed && (
            <span className="min-w-0">
              <span className="block text-[17px] font-bold leading-tight tracking-[-.7px] text-[#f4f4f5]">
                campo<span className="font-medium text-[#71895c]">alto</span>
              </span>
              <span className="mt-1 block text-[9px] font-medium tracking-[1.4px] text-[#7f9285]">
                CADERNO DE CAMPO
              </span>
            </span>
          )}
        </a>
        <button
          type="button"
          onClick={onToggleCollapse}
          title={collapsed ? 'Expandir navegação' : 'Recolher navegação'}
          aria-label={collapsed ? 'Expandir navegação' : 'Recolher navegação'}
          className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#92929b] transition-colors hover:bg-[#202023] hover:text-white focus-visible:outline-2 focus-visible:outline-[#a3b18a]"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <div className={`px-4 py-[18px] ${collapsed ? 'px-2.5' : ''}`}>
        <div className={`flex items-center gap-3 rounded-xl border border-[#29292d] bg-[#17171a] px-3 py-3 ${collapsed ? 'justify-center px-2' : ''}`}>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] bg-[#29291f] text-[#c0c99e]">
            <Wheat aria-hidden="true" className="h-[17px] w-[17px]" strokeWidth={1.8} />
          </span>
          {!collapsed && (
            <span className="min-w-0">
              <span className="block truncate text-xs font-semibold text-[#e4e4e7]">{farmName}</span>
              <span className="mt-1 block text-[10px] text-[#93a398]">Unidade demonstrativa</span>
            </span>
          )}
        </div>
      </div>

      <nav aria-label="Navegação da fazenda" className="flex-1 space-y-6 overflow-y-auto px-3 py-1">
        {navigationGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="mb-2 px-2.5 text-[10px] font-semibold tracking-[1px] text-[#7f877d]">
                {group.label.toLocaleUpperCase('pt-BR')}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map(({ label, icon: Icon }) => {
                const isSelected = activePage === label;

                return (
                  <button
                    key={label}
                    type="button"
                    title={collapsed ? label : undefined}
                    aria-current={isSelected ? 'page' : undefined}
                    onClick={() => onNavigate(label)}
                    className={`relative flex min-h-10 w-full items-center gap-3 rounded-[10px] px-3 text-[13px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#638251] ${
                      collapsed ? 'justify-center px-0' : ''
                    } ${
                      isSelected
                        ? 'bg-[#1b1b1f] font-semibold text-[#fafafa]'
                        : 'font-medium text-[#a1a1aa] hover:bg-[#202023] hover:text-white'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-[#a3b18a]" />
                    )}
                    <Icon
                      aria-hidden="true"
                      className={`h-[17px] w-[17px] shrink-0 ${isSelected ? 'text-[#a3b18a]' : 'text-[#81818b]'}`}
                      strokeWidth={1.8}
                    />
                    {!collapsed && <span className="truncate text-left">{label}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {!collapsed && (
        <div className="mx-4 mb-4 rounded-xl border border-[#29292d] bg-[#17171a] p-3.5">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[#bc9558]" />
            <div>
              <p className="text-[11px] font-semibold text-[#e4e4e7]">Projeto em demonstração</p>
              <p className="mt-1 text-[10px] leading-relaxed text-[#a1a1aa]">
                Os dados são ilustrativos; não representam uma fazenda real.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-[#27272a] px-4 py-3">
        <p className="text-center text-[10px] text-[#7f877d]">
          {!collapsed && 'CAMPOALTO · PROJETO ACADÊMICO'}
        </p>
      </div>
    </aside>
  );
}
