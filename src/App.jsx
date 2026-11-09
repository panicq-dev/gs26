import { lazy, Suspense, useState } from 'react';
import { CheckCircle2, Sprout, WifiOff } from 'lucide-react';
import { DroneTutorial } from './components/drone/DroneTutorial.jsx';
import { Sidebar } from './components/layout/Sidebar.jsx';
import { Topbar } from './components/layout/Topbar.jsx';
import {
  FARM_PROFILE,
  INITIAL_PESTS,
  INITIAL_SUPPLIERS,
  INITIAL_TALHOES,
} from './data/mockAgroData.js';
import { useAgroData } from './hooks/useAgroData.js';
import { useConnectionStatus } from './hooks/useConnectionStatus.js';

const OverviewTab = lazy(() =>
  import('./components/dashboard/OverviewTab.jsx').then((module) => ({
    default: module.OverviewTab,
  }))
);
const RiskMapTab = lazy(() =>
  import('./components/dashboard/RiskMapTab.jsx').then((module) => ({
    default: module.RiskMapTab,
  }))
);
const PestsTab = lazy(() =>
  import('./components/dashboard/PestsTab.jsx').then((module) => ({
    default: module.PestsTab,
  }))
);
const SuppliesTab = lazy(() =>
  import('./components/dashboard/SuppliesTab.jsx').then((module) => ({
    default: module.SuppliesTab,
  }))
);
const SuppliersTab = lazy(() =>
  import('./components/dashboard/SuppliersTab.jsx').then((module) => ({
    default: module.SuppliersTab,
  }))
);
const FinancialSimulatorTab = lazy(() =>
  import('./components/dashboard/FinancialSimulatorTab.jsx').then((module) => ({
    default: module.FinancialSimulatorTab,
  }))
);

const DRONE_TUTORIAL_COMPLETED_KEY = 'campoalto.drone-tutorial.completed';

export default function App() {
  const [activePage, setActivePage] = useState('Dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const farmName = FARM_PROFILE.name;
  const [talhoes, setTalhoes] = useState(INITIAL_TALHOES);
  const [selectedTalhao, setSelectedTalhao] = useState(INITIAL_TALHOES[6]);
  const [pests] = useState(INITIAL_PESTS);
  const [suppliers] = useState(INITIAL_SUPPLIERS);
  const [globalToast, setGlobalToast] = useState('');
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [hasSeenDroneTutorial, setHasSeenDroneTutorial] = useState(() => {
    try {
      return window.localStorage.getItem(DRONE_TUTORIAL_COMPLETED_KEY) === 'true';
    } catch (storageError) {
      console.error('Não foi possível consultar o progresso do tutorial.', storageError);
      return false;
    }
  });
  const { supplies, isLoading, error, createSupply, updateSupply, deleteSupply } = useAgroData();
  const { isOnline, isSupabaseConfigured, modeLabel } = useConnectionStatus();

  const handleNavigate = (page) => {
    setMobileMenuOpen(false);
    if (page === 'Mapa de risco' && !hasSeenDroneTutorial) {
      setTutorialOpen(true);
      return;
    }
    setActivePage(page);
  };

  const handleTutorialComplete = () => {
    setTutorialOpen(false);
    setHasSeenDroneTutorial(true);
    try {
      window.localStorage.setItem(DRONE_TUTORIAL_COMPLETED_KEY, 'true');
    } catch (storageError) {
      console.error('Não foi possível salvar o progresso do tutorial.', storageError);
    }
    setActivePage('Mapa de risco');
  };

  const showToast = (message) => {
    setGlobalToast(message);
    window.setTimeout(() => setGlobalToast(''), 3600);
  };

  const handleMutation = async (operation, successMessage) => {
    try {
      await operation();
      showToast(successMessage);
    } catch (mutationError) {
      console.error('A operação de estoque falhou.', mutationError);
      throw mutationError;
    }
  };

  const handleScheduleSpray = (targetTalhao) => {
    setTalhoes((current) =>
      current.map((talhao) =>
        talhao.id === targetTalhao.id
          ? {
              ...talhao,
              riskLevel: 'medium',
              riskPct: Math.round(talhao.riskPct * 0.6),
              sprayWindowStatus: 'closing',
            }
          : talhao
      )
    );
    showToast(`Simulação atualizada para ${targetTalhao.code}; nenhuma ordem real foi enviada.`);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#29372b]">
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 z-40 bg-[#192319]/40 backdrop-blur-[2px] lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className={`lg:block ${mobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((current) => !current)}
          activePage={activePage}
          onNavigate={handleNavigate}
          farmName={farmName}
        />
      </div>

      <div
        className={`flex min-w-0 flex-1 flex-col transition-all duration-300 ${
          collapsed ? 'lg:ml-[76px]' : 'lg:ml-[256px]'
        }`}
      >
        <Topbar
          activePage={activePage}
          farmName={farmName}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenTutorial={() => setTutorialOpen(true)}
        />

        <main id="conteudo" tabIndex="-1" className="mx-auto w-full max-w-[1600px] flex-1 p-4 sm:p-6 lg:p-8">
          <div
            role={error ? 'alert' : 'status'}
            className={`mb-5 flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-xs leading-relaxed ${
              error
                ? 'border-[#dfc6b8] bg-[#fbf2ec] text-[#814f37]'
                : 'border-[#dfe2d5] bg-[#f7f6f0] text-[#6c7062]'
            }`}
          >
            {!isOnline ? (
              <WifiOff className="h-4 w-4 shrink-0" />
            ) : (
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${
                  isSupabaseConfigured ? 'bg-[#70a37e]' : 'bg-[#d1a342]'
                }`}
              />
            )}
            {error ||
              (isLoading
                ? 'Carregando dados ilustrativos de estoque...'
                : !isOnline
                  ? 'Sem conexão com a internet.'
                  : isSupabaseConfigured
                    ? 'Projeto demonstrativo: os dados agrícolas são ilustrativos; somente o estoque é conectado ao Supabase.'
                    : 'Projeto demonstrativo: os dados agrícolas são ilustrativos e o estoque fica salvo somente neste navegador.')}
          </div>

          <Suspense
            fallback={
              <div
                role="status"
                className="flex min-h-40 items-center justify-center rounded-xl border border-[#dfe2d5] bg-[#f7f6f0] text-sm text-[#747969]"
              >
                Abrindo esta seção...
              </div>
            }
          >
            {activePage === 'Dashboard' && (
              <OverviewTab
                talhoes={talhoes}
                pests={pests}
                selectedTalhao={selectedTalhao}
                onSelectTalhao={setSelectedTalhao}
                onNavigate={handleNavigate}
              />
            )}

            {activePage === 'Mapa de risco' && (
              <RiskMapTab
                talhoes={talhoes}
                selectedTalhao={selectedTalhao}
                onSelectTalhao={setSelectedTalhao}
                onScheduleSpray={handleScheduleSpray}
                onOpenTutorial={() => setTutorialOpen(true)}
              />
            )}

            {activePage === 'Pragas e doenças' && (
              <PestsTab
                pests={pests}
                talhoes={talhoes}
                onSelectTalhao={setSelectedTalhao}
                onNavigateToMap={() => handleNavigate('Mapa de risco')}
              />
            )}

            {activePage === 'Insumos & estoque' && (
              <SuppliesTab
                supplies={supplies}
                isLoading={isLoading}
                onCreateSupply={(supply) =>
                  handleMutation(() => createSupply(supply), 'Insumo cadastrado com sucesso.')
                }
                onUpdateSupply={(supply) =>
                  handleMutation(
                    () => updateSupply(supply.id, supply),
                    'Insumo atualizado com sucesso.'
                  )
                }
                onDeleteSupply={(id) =>
                  handleMutation(() => deleteSupply(id), 'Insumo excluído com sucesso.')
                }
              />
            )}

            {activePage === 'Fornecedores' && <SuppliersTab suppliers={suppliers} />}

            {activePage === 'Simulador financeiro' && <FinancialSimulatorTab />}
          </Suspense>
        </main>

        <footer className="flex flex-col items-center justify-between gap-3 border-t border-[#dcddd3] px-6 py-4 text-xs text-[#777a6d] sm:flex-row">
          <div className="flex items-center gap-2">
            <Sprout className="h-3.5 w-3.5 text-[#70865e]" />
            <span>Campoalto · Inteligência agronômica de precisão</span>
            <span>·</span>
            <span>Fazenda Santa Helena</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#828477]">
            <span>Safra 2026/2027</span>
            <span>·</span>
            <span className="font-mono">v2.4.0 · {modeLabel}</span>
          </div>
        </footer>
      </div>

      {globalToast && (
        <div
          role="status"
          className="fixed bottom-6 right-4 z-[60] flex max-w-[min(90vw,440px)] items-center gap-2 rounded-xl border border-[#d6ddca] bg-[#fbfaf6] px-4 py-3 text-xs text-[#43533f] shadow-[0_8px_24px_rgba(39,51,39,.14)] sm:right-6"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#70865e]" />
          <span>{globalToast}</span>
        </div>
      )}

      {tutorialOpen && (
        <DroneTutorial
          onClose={() => setTutorialOpen(false)}
          onOpenMap={handleTutorialComplete}
        />
      )}
    </div>
  );
}
