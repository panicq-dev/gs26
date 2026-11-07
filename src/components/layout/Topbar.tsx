import React, { useState } from 'react';
import {
  ChevronRight,
  Bell,
  Search,
  Calendar,
  CloudRain,
  ShieldAlert,
  Wheat,
  X,
  CheckCircle2,
  Menu,
} from 'lucide-react';
import { NavPage } from './Sidebar';

interface TopbarProps {
  activePage: NavPage;
  farmName: string;
  onOpenMobileMenu?: () => void;
  onNewInspection?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  activePage,
  farmName,
  onOpenMobileMenu,
  onNewInspection,
}) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  const notifications = [
    {
      id: 'n1',
      title: 'Pressão de bicudo atinge 78%',
      subtitle: 'Talhões 08 e 09 (Setor Norte) · Voo de drone 06:42',
      type: 'alert',
      time: 'há 18 min',
      icon: ShieldAlert,
      color: 'text-[#eb7351] bg-[#eb7351]/10 border-[#eb7351]/30',
    },
    {
      id: 'n2',
      title: 'Janela de pulverização se encerra às 16:00',
      subtitle: 'Frente de chuva acumulada de 48 mm prevista para a noite',
      type: 'weather',
      time: 'há 45 min',
      icon: CloudRain,
      color: 'text-[#6b95a8] bg-[#6b95a8]/10 border-[#6b95a8]/30',
    },
    {
      id: 'n3',
      title: 'Reposição de adjuvante siliconado necessária',
      subtitle: 'Estoque atual cobre apenas 11 dias de operação',
      type: 'stock',
      time: 'há 2 horas',
      icon: Wheat,
      color: 'text-[#d1a342] bg-[#d1a342]/10 border-[#d1a342]/30',
    },
  ];

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-[#1c271f] bg-[#0c120e]/85 px-4 lg:px-8 backdrop-blur-md">
      {/* Left: Mobile Menu & Breadcrumbs */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="rounded-lg border border-[#27352b] p-1.5 text-[#869a89] hover:bg-[#162118] hover:text-white lg:hidden"
            title="Menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        )}

        <nav aria-label="Trilha de navegação" className="flex items-center gap-1.5 text-xs text-[#7e9381]">
          <span className="font-medium text-[#9eb4a2]">{farmName}</span>
          <ChevronRight className="h-3.5 w-3.5 text-[#4e6352]" />
          <span className="font-semibold text-white">{activePage}</span>
        </nav>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5">
        {/* Drone & Station live indicator */}
        <div className="hidden sm:flex items-center gap-2 rounded-lg border border-[#223026] bg-[#111813] px-3 py-1 text-[11px] text-[#869b89]">
          <span className="h-2 w-2 rounded-full bg-[#70a37e]" />
          <span>Telemetria Ortofoto <strong>06:42</strong></span>
        </div>

        {/* Season Badge */}
        <div className="hidden md:flex items-center gap-1.5 rounded-lg border border-[#27362b] bg-[#121a14] px-2.5 py-1 text-xs text-[#c89b53]">
          <Calendar className="h-3.5 w-3.5" />
          <span className="font-medium">Safra 26/27</span>
        </div>

        {/* Search Input toggle */}
        <div className="relative">
          {searchOpen ? (
            <div className="flex items-center rounded-lg border border-[#304334] bg-[#131b15] px-2.5 py-1 text-xs">
              <Search className="h-3.5 w-3.5 text-[#6c8270] mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar talhão, praga..."
                className="w-36 sm:w-48 bg-transparent text-white placeholder-[#607464] focus:outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-[#6c8270] hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#222e25] bg-[#111713] text-[#819684] hover:bg-[#18231a] hover:text-white transition-colors"
              title="Buscar no sistema"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Notification Bell with Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              if (unreadCount > 0) setUnreadCount(0);
            }}
            className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-[#222e25] bg-[#111713] text-[#819684] hover:bg-[#18231a] hover:text-white transition-colors"
            title="Notificações agronômicas"
          >
            <Bell className="h-3.5 w-3.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#eb7351] text-[9px] font-mono font-bold text-white px-1 shadow">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Popover */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-[#2a3a2e] bg-[#111813] p-3 shadow-2xl backdrop-blur-md z-50">
              <div className="flex items-center justify-between border-b border-[#202c22] pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Alertas Operacionais</span>
                  <span className="rounded bg-[#1b271d] px-1.5 py-0.5 text-[10px] font-mono text-[#8fa391]">
                    Hoje
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(false)}
                  className="text-[#6f8272] hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto">
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div
                      key={n.id}
                      className="flex gap-2.5 rounded-lg border border-[#212d24] bg-[#141d16] p-2.5 text-xs hover:border-[#304133] transition-colors"
                    >
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border ${n.color}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <strong className="text-[11px] font-semibold text-[#e1eae0] truncate">{n.title}</strong>
                          <span className="text-[9px] font-mono text-[#6e8271] shrink-0 ml-1">{n.time}</span>
                        </div>
                        <p className="mt-0.5 text-[10px] text-[#869b89] line-clamp-2">{n.subtitle}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-2.5 pt-2 border-t border-[#1f2b21] flex justify-between items-center text-[11px]">
                <span className="text-[#6e8271]">Tudo atualizado</span>
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(false)}
                  className="font-medium text-[#70a37e] hover:underline"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Action */}
        {onNewInspection && (
          <button
            type="button"
            onClick={onNewInspection}
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-[#70a37e]/40 bg-[#172c1e] px-3 py-1.5 text-xs font-semibold text-[#b8e8c3] hover:bg-[#1f3a28] transition-colors"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-[#70a37e]" />
            <span>Validar Decisão</span>
          </button>
        )}
      </div>
    </header>
  );
};
