const RISK_COLORS = {
  low: {
    selected: 'border-[#728866] bg-[#dfe8d5] text-[#364b35]',
    default: 'border-[#dfe6d9] bg-[#f7f8f2] text-[#536b4f] hover:bg-[#eaf0e4]',
    indicator: 'bg-[#83986e]',
  },
  medium: {
    selected: 'border-[#b6924e] bg-[#f3ebd8] text-[#735b30]',
    default: 'border-[#e8dfce] bg-[#faf7ef] text-[#766445] hover:bg-[#f5efe2]',
    indicator: 'bg-[#b79556]',
  },
  high: {
    selected: 'border-[#b87459] bg-[#f3e5dc] text-[#754b3a]',
    default: 'border-[#eadbd2] bg-[#faf3ee] text-[#795644] hover:bg-[#f6e9df]',
    indicator: 'bg-[#b8785c]',
  },
};

export function FarmFieldPreview({ talhoes, selectedTalhaoId, onSelectTalhao }) {
  return (
    <figure
      aria-labelledby="field-preview-title"
      className="flex min-h-[340px] flex-col overflow-hidden rounded-xl border border-[#e4e6d9] bg-[#f0f1e8] p-4 text-[#455344]"
    >
      <figcaption className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 id="field-preview-title" className="text-sm font-semibold text-[#354735]">
            Talhões da fazenda
          </h3>
          <p className="mt-1 text-[11px] text-[#858778]">
            Selecione um talhão para atualizar o destaque.
          </p>
        </div>
        <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-medium text-[#78806d]">
          Mapa esquemático
        </span>
      </figcaption>

      <div className="flex flex-1 items-center rounded-[14px] border border-[#e2e4d7] bg-[#e8ebdf] p-3 sm:p-5">
        <div className="grid w-full grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3">
          {talhoes.map((talhao) => {
            const isSelected = talhao.id === selectedTalhaoId;
            const color = RISK_COLORS[talhao.riskLevel] ?? RISK_COLORS.low;

            return (
              <button
                key={talhao.id}
                type="button"
                aria-pressed={isSelected}
                aria-label={`${talhao.code}, ${talhao.areaHa} hectares, risco ${talhao.riskLevel}, exemplo`}
                onClick={() => onSelectTalhao(talhao)}
                className={`group relative flex min-h-[67px] flex-col justify-center rounded-[12px] border px-2.5 text-left shadow-[0_1px_2px_rgba(47,60,45,.05)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#70865e] ${
                  isSelected ? color.selected : color.default
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${color.indicator}`} />
                  <span className="truncate text-[11px] font-semibold">{talhao.code}</span>
                </span>
                <span className="mt-1.5 pl-3 text-[10px] opacity-75">{talhao.areaHa} ha</span>
                {isSelected && (
                  <span className="absolute right-2 top-1.5 text-[8px] font-semibold uppercase tracking-wide">
                    Selecionado
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-[#747969]">
        {[
          ['bg-[#83986e]', 'Risco baixo'],
          ['bg-[#b79556]', 'Atenção'],
          ['bg-[#b8785c]', 'Risco alto'],
        ].map(([color, label]) => (
          <span key={label} className="flex items-center gap-1.5">
            <span aria-hidden="true" className={`h-2 w-2 rounded-full ${color}`} />
            {label}
          </span>
        ))}
        <span className="sm:ml-auto">Dados de exemplo · sem localização geográfica</span>
      </div>
    </figure>
  );
}
