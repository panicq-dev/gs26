import React, { useState } from 'react';
import { Sidebar, NavPage } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { OverviewTab } from './components/dashboard/OverviewTab';
import { RiskMapTab } from './components/dashboard/RiskMapTab';
import { PestsTab } from './components/dashboard/PestsTab';
import { SuppliesTab } from './components/dashboard/SuppliesTab';
import { SuppliersTab } from './components/dashboard/SuppliersTab';
import { FinancialSimulatorTab } from './components/dashboard/FinancialSimulatorTab';
import {
  FARM_PROFILE,
  INITIAL_TALHOES,
  INITIAL_PESTS,
  INITIAL_SUPPLIES,
  INITIAL_SUPPLIERS,
} from './data/mockAgroData';
import { Talhao, SupplyItem, PestRecord } from './types/agro';
import { Sprout, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState<NavPage>('Dashboard');
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [farmName, setFarmName] = useState<string>(FARM_PROFILE.name);

  // Core state for interactive session
  const [talhoes, setTalhoes] = useState<Talhao[]>(INITIAL_TALHOES);
  const [selectedTalhao, setSelectedTalhao] = useState<Talhao | null>(INITIAL_TALHOES[6]); // Talhão 08 by default (high risk)
  const [supplies, setSupplies] = useState<SupplyItem[]>(INITIAL_SUPPLIES);
  const [pests, setPests] = useState<PestRecord[]>(INITIAL_PESTS);
  const [suppliers] = useState(INITIAL_SUPPLIERS);
  const [globalToast, setGlobalToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setGlobalToast(message);
    setTimeout(() => setGlobalToast(null), 3600);
  };

  const handleScheduleSpray = (targetTalhao: Talhao) => {
    // Update talhão status to treatment scheduled
    setTalhoes((prev) =>
      prev.map((t) =>
        t.id === targetTalhao.id
          ? {
              ...t,
              riskLevel: 'medium',
              riskPct: Math.round(t.riskPct * 0.6),
              sprayWindowStatus: 'closing',
            }
          : t
      )
    );
    showToast(`Pulverização e manejo registrados para ${targetTalhao.code}.`);
  };

  const handleSelectTalhao = (talhao: Talhao) => {
    setSelectedTalhao(talhao);
  };

  return (
    <div className="min-h-screen bg-[#090d0a] text-[#e4eae2] flex">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (Desktop + Mobile) */}
      <div className={`lg:block ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          activePage={activePage}
          onNavigate={(page) => {
            setActivePage(page);
            setMobileMenuOpen(false);
          }}
          farmName={farmName}
          onSelectFarm={(name) => {
            setFarmName(name);
            showToast(`Alternado para ${name}.`);
          }}
        />
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          collapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'
        }`}
      >
        <Topbar
          activePage={activePage}
          farmName={farmName}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onNewInspection={() => {
            setActivePage('Mapa de risco');
            showToast('Modo de inspeção e validação ativado no mapa 3D.');
          }}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {activePage === 'Dashboard' && (
            <OverviewTab
              talhoes={talhoes}
              pests={pests}
              selectedTalhao={selectedTalhao}
              onSelectTalhao={handleSelectTalhao}
              onNavigate={(page) => setActivePage(page)}
            />
          )}

          {activePage === 'Mapa de risco' && (
            <RiskMapTab
              talhoes={talhoes}
              selectedTalhao={selectedTalhao}
              onSelectTalhao={handleSelectTalhao}
              onScheduleSpray={handleScheduleSpray}
            />
          )}

          {activePage === 'Pragas e doenças' && (
            <PestsTab
              pests={pests}
              talhoes={talhoes}
              onSelectTalhao={handleSelectTalhao}
              onNavigateToMap={() => setActivePage('Mapa de risco')}
            />
          )}

          {activePage === 'Insumos & estoque' && (
            <SuppliesTab
              supplies={supplies}
              onUpdateSupplies={(updated) => setSupplies(updated)}
            />
          )}

          {activePage === 'Fornecedores' && (
            <SuppliersTab suppliers={suppliers} />
          )}

          {activePage === 'Simulador financeiro' && (
            <FinancialSimulatorTab />
          )}
        </main>

        {/* Quiet Professional Footer */}
        <footer className="border-t border-[#1a241c] py-4 px-6 text-xs text-[#687b6b] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sprout className="h-3.5 w-3.5 text-[#70a37e]" />
            <span>Campoalto · Inteligência agronômica de precisão</span>
            <span>·</span>
            <span>Fazenda Santa Helena</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#5b6e5e]">
            <span>Safra 2026/2027</span>
            <span>·</span>
            <span>Coordenadas 21°10′ S 47°48′ O</span>
            <span>·</span>
            <span className="font-mono">v2.4.0</span>
          </div>
        </footer>
      </div>

      {/* Global Toast */}
      {globalToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border border-[#70a37e]/40 bg-[#14261b] px-4 py-2.5 text-xs text-[#d6f0dd] shadow-2xl backdrop-blur-md animate-fade-in">
          <CheckCircle2 className="h-4 w-4 text-[#70a37e]" />
          <span>{globalToast}</span>
        </div>
      )}
    </div>
  );
}
