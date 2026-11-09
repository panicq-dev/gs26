import { ArrowUpRight, CircleHelp, Leaf, Menu } from 'lucide-react';

export function Topbar({ activePage, farmName, onOpenMobileMenu, onOpenTutorial }) {
  return (
    <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-[#27272a] bg-[#09090b]/95 px-4 backdrop-blur-md sm:px-6 lg:px-9">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Abrir menu de navegação"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#303034] bg-[#1b1b1f] text-[#c4cfad] transition-colors hover:bg-[#292a21] lg:hidden"
        >
          <Menu className="h-[18px] w-[18px]" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 truncate text-xs text-[#a1a1aa]">
            <Leaf aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-[#a3b18a]" />
            <span className="truncate">{farmName}</span>
          </div>
          <p aria-current="page" className="truncate text-sm font-semibold text-[#f4f4f5]">
            {activePage === 'Dashboard' ? 'Visão geral' : activePage}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onOpenTutorial}
        className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[#303034] bg-[#1b1b1f] px-3.5 text-xs font-medium text-[#e4e4e7] transition-colors hover:border-[#45454a] hover:bg-[#202023] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a3b18a]"
      >
        <CircleHelp className="h-4 w-4 text-[#a3b18a]" />
        <span className="hidden sm:inline">Guia do drone</span>
        <span className="sm:hidden">Ajuda</span>
        <ArrowUpRight aria-hidden="true" className="hidden h-3.5 w-3.5 text-[#a1a1aa] sm:block" />
      </button>
    </header>
  );
}
