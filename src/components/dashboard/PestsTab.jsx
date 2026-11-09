import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import {
  Bug,
  Clock,
  Search,
  CheckCircle2,
  FileText,
  MapPin,
  ExternalLink,
  Leaf,
  FlaskConical
} from "lucide-react";
const PestsTab = ({
  pests,
  talhoes,
  onSelectTalhao,
  onNavigateToMap
}) => {
  const [selectedPest, setSelectedPest] = useState(pests[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [prescriptionModalPest, setPrescriptionModalPest] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const filteredPests = pests.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.scientificName.toLowerCase().includes(searchTerm.toLowerCase()) || p.activeIngredient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === "all" || p.riskLevel === filterSeverity;
    return matchesSearch && matchesSeverity;
  });
  const handleIssuePrescription = (pest) => {
    setPrescriptionModalPest(pest);
  };
  const confirmPrescription = () => {
    if (!prescriptionModalPest) return;
    setToastMessage(`Prévia demonstrativa de ${prescriptionModalPest.name} concluída. Nenhuma prescrição foi emitida.`);
    setPrescriptionModalPest(null);
    setTimeout(() => setToastMessage(null), 3500);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#1f2c22] pb-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#79907c]", children: [
          /* @__PURE__ */ jsx("span", { children: "Manejo Integrado de Pragas (MIP)" }),
          /* @__PURE__ */ jsx("span", { children: "\xB7" }),
          /* @__PURE__ */ jsx("span", { children: "Algodoeiro & Soja" })
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "mt-1 text-2xl font-bold tracking-tight text-white", children: "Cat\xE1logo Fitossanit\xE1rio & Prescri\xE7\xF5es" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#8ca290]", children: "Monitoramento de press\xE3o biol\xF3gica, limiares de dano econ\xF4mico e defensivos recomendados por talh\xE3o." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center rounded-lg border border-[#233127] bg-[#121a14] px-3 py-1.5 text-xs text-white", children: [
          /* @__PURE__ */ jsx(Search, { className: "h-3.5 w-3.5 text-[#6c8270] mr-2" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              placeholder: "Buscar praga ou ativo...",
              className: "bg-transparent placeholder-[#617765] focus:outline-none w-36 sm:w-48"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 bg-[#121a14] p-1 rounded-lg border border-[#233127]", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setFilterSeverity("all"),
              className: `px-2.5 py-1 rounded text-xs font-medium transition-colors ${filterSeverity === "all" ? "bg-[#213024] text-white" : "text-[#7e9381] hover:text-white"}`,
              children: "Todas"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setFilterSeverity("high"),
              className: `px-2.5 py-1 rounded text-xs font-medium transition-colors ${filterSeverity === "high" ? "bg-[#402a1e] text-[#ff9980]" : "text-[#7e9381] hover:text-[#ff9980]"}`,
              children: "Cr\xEDticas"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setFilterSeverity("medium"),
              className: `px-2.5 py-1 rounded text-xs font-medium transition-colors ${filterSeverity === "medium" ? "bg-[#3b3119] text-[#ffd875]" : "text-[#7e9381] hover:text-[#ffd875]"}`,
              children: "Aten\xE7\xE3o"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-5", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-5 space-y-3", children: filteredPests.map((pest) => {
        const isSelected = selectedPest.id === pest.id;
        return /* @__PURE__ */ jsxs(
          "div",
          {
            onClick: () => setSelectedPest(pest),
            className: `cursor-pointer rounded-xl border p-4 transition-all ${isSelected ? "border-[#70a37e] bg-[#142017] shadow-lg" : "border-[#202c22] bg-[#111713] hover:border-[#2f4233] hover:bg-[#131b15]"}`,
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
                  /* @__PURE__ */ jsx(
                    "div",
                    {
                      className: "flex h-9 w-9 items-center justify-center rounded-lg border text-white font-bold",
                      style: {
                        backgroundColor: `${pest.color}15`,
                        borderColor: `${pest.color}40`,
                        color: pest.color
                      },
                      children: /* @__PURE__ */ jsx(Bug, { className: "h-4 w-4" })
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-white", children: pest.name }),
                    /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#7d917f] italic", children: pest.scientificName })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs(
                  "span",
                  {
                    className: `rounded px-2 py-0.5 text-[10px] font-mono font-bold uppercase ${pest.riskLevel === "high" ? "bg-[#eb7351]/20 text-[#ff8f70] border border-[#eb7351]/40" : pest.riskLevel === "medium" ? "bg-[#d1a342]/20 text-[#ebd173] border border-[#d1a342]/40" : "bg-[#639777]/20 text-[#8ec7a0] border border-[#639777]/30"}`,
                    children: [
                      pest.probabilityPct,
                      "% Risco"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("p", { className: "mt-2.5 text-xs text-[#8da290] line-clamp-2 leading-relaxed", children: pest.damageDescription }),
              /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between text-[11px] text-[#718574] pt-2 border-t border-[#1d271f]", children: [
                /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 text-[#869b89]", children: [
                  /* @__PURE__ */ jsx(Clock, { className: "h-3 w-3 text-[#c89b53]" }),
                  "Janela: ",
                  /* @__PURE__ */ jsxs("strong", { children: [
                    pest.urgencyHours,
                    " horas"
                  ] })
                ] }),
                /* @__PURE__ */ jsx("span", { children: pest.affectedTalhoes.join(", ") })
              ] })
            ]
          },
          pest.id
        );
      }) }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7 rounded-xl border border-[#232f26] bg-[#111713] p-5 text-[#e0eae0]", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between border-b border-[#1f2b21] pb-4 mb-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-mono uppercase tracking-wider text-[#708472]", children: "PROTOCOLO DE MANEJO AGRON\xD4MICO" }),
              /* @__PURE__ */ jsx("span", { className: "text-[#4e6352]", children: "\xB7" }),
              /* @__PURE__ */ jsx("span", { className: "text-xs text-[#86a88b]", children: selectedPest.cropTarget })
            ] }),
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-white mt-1", children: selectedPest.name }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-[#8ca28f] italic", children: selectedPest.scientificName })
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => handleIssuePrescription(selectedPest),
              className: "flex items-center gap-1.5 rounded-lg border border-[#70a37e]/40 bg-[#182f20] px-3.5 py-2 text-xs font-semibold text-[#b8e8c3] hover:bg-[#203d2b] transition-colors",
              children: [
                /* @__PURE__ */ jsx(FileText, { className: "h-3.5 w-3.5 text-[#70a37e]" }),
                /* @__PURE__ */ jsx("span", { children: "Ver prévia demonstrativa" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-xs", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold text-[#8ca290] uppercase tracking-wider block mb-1", children: "Sintomatologia & Comportamento de Dano" }),
            /* @__PURE__ */ jsx("p", { className: "rounded-lg border border-[#202b22] bg-[#141d16] p-3 text-[#c4d6c6] leading-relaxed", children: selectedPest.damageDescription })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-[#202b22] bg-[#141d16] p-3", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold text-[#c89b53] uppercase tracking-wider block mb-1", children: "Limiar de Dano Econ\xF4mico (LDE)" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-white", children: selectedPest.economicThreshold })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-[#202b22] bg-[#141d16] p-3", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold text-[#eb7351] uppercase tracking-wider block mb-1", children: "Janela Cr\xEDtica de A\xE7\xE3o" }),
              /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium text-white", children: [
                "Intervir em at\xE9 ",
                /* @__PURE__ */ jsxs("strong", { className: "text-[#ff9e85] font-mono", children: [
                  selectedPest.urgencyHours,
                  " horas"
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3 pt-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-[#253528] bg-[#121c15] p-3.5", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[#70a37e] font-semibold mb-1.5", children: [
                /* @__PURE__ */ jsx(FlaskConical, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs", children: "Exemplo ilustrativo · confirmar com agrônomo" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:justify-between text-xs gap-1", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[#728574]", children: "Ingrediente fictício:" }),
                  /* @__PURE__ */ jsx("strong", { className: "text-white block sm:inline sm:ml-1", children: selectedPest.activeIngredient })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[#728574]", children: "Dosagem ilustrativa · não utilizar:" }),
                  /* @__PURE__ */ jsx("strong", { className: "text-[#9de8b2] font-mono ml-1", children: selectedPest.dosagePerHa })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-[#2b392e] bg-[#111913] p-3.5", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-[#86a88b] font-semibold mb-1.5", children: [
                /* @__PURE__ */ jsx(Leaf, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsx("span", { className: "text-xs", children: "Alternativa Biol\xF3gica Homologada (Bioinsumo)" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-[#cad9cc]", children: selectedPest.biologicalAlternative })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pt-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[11px] font-semibold text-[#8ca290] uppercase tracking-wider block mb-2", children: "Talh\xF5es com Detec\xE7\xE3o Desta Praga" }),
            /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: selectedPest.affectedTalhoes.map((talhaoCode) => {
              const targetTalhao = talhoes.find((t) => t.code === talhaoCode);
              return /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    if (targetTalhao) onSelectTalhao(targetTalhao);
                    onNavigateToMap();
                  },
                  className: "flex items-center gap-1.5 rounded-lg border border-[#2d3f31] bg-[#17241b] px-3 py-1.5 text-xs text-[#d3e3d5] hover:border-[#70a37e] hover:text-white transition-colors",
                  children: [
                    /* @__PURE__ */ jsx(MapPin, { className: "h-3 w-3 text-[#70a37e]" }),
                    /* @__PURE__ */ jsx("span", { children: talhaoCode }),
                    /* @__PURE__ */ jsx(ExternalLink, { className: "h-2.5 w-2.5 text-[#6c8270]" })
                  ]
                },
                talhaoCode
              );
            }) })
          ] })
        ] })
      ] })
    ] }),
    prescriptionModalPest && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-lg rounded-2xl border border-[#2d3f31] bg-[#121a14] p-6 shadow-2xl text-[#e0eae0]", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-[#212f24] pb-3 mb-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-mono uppercase tracking-wider text-[#d1a342]", children: "PRÉVIA DE DEMONSTRAÇÃO · SEM VALIDADE TÉCNICA" }),
          /* @__PURE__ */ jsxs("h3", { className: "text-lg font-bold text-white", children: [
            "Exemplo · ",
            prescriptionModalPest.name
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setPrescriptionModalPest(null),
            className: "text-[#6d8270] hover:text-white",
            children: "\u2715"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-xs", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-[#222e25] bg-[#151f17] p-3", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[#728574] block", children: "Alvo Biol\xF3gico:" }),
          /* @__PURE__ */ jsxs("strong", { className: "text-white text-sm", children: [
            prescriptionModalPest.name,
            " (",
            prescriptionModalPest.scientificName,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2.5", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-[#222e25] bg-[#151f17] p-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[#728574] block", children: "Ingrediente fictício:" }),
            /* @__PURE__ */ jsx("strong", { className: "text-white", children: prescriptionModalPest.activeIngredient })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-[#222e25] bg-[#151f17] p-3", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[#728574] block", children: "Dosagem ilustrativa · não utilizar:" }),
            /* @__PURE__ */ jsx("strong", { className: "text-[#9de8b2] font-mono", children: prescriptionModalPest.dosagePerHa })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-[#222e25] bg-[#151f17] p-3", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[#728574] block", children: "Talh\xF5es Destinat\xE1rios:" }),
          /* @__PURE__ */ jsx("strong", { className: "text-white", children: prescriptionModalPest.affectedTalhoes.join(" \xB7 ") })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-[#3b321a] bg-[#1c1911] p-3 text-[#d1b882]", children: [
          /* @__PURE__ */ jsx("span", { className: "font-semibold block mb-0.5", children: "Condi\xE7\xE3o Operacional Recomendada:" }),
          "Pulverizar antes das 16:00 (vento < 10 km/h, umidade > 60%) com bicos de indu\xE7\xE3o de ar para evitar deriva."
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-5 flex items-center justify-end gap-3 pt-3 border-t border-[#202d23]", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setPrescriptionModalPest(null),
            className: "rounded-lg border border-[#2b3a2e] px-4 py-2 text-xs font-medium text-[#8da290] hover:bg-[#18231a] hover:text-white transition-colors",
            children: "Cancelar"
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: confirmPrescription,
            className: "flex items-center gap-1.5 rounded-lg border border-[#70a37e]/40 bg-[#1a3523] px-4 py-2 text-xs font-semibold text-[#b8e8c3] hover:bg-[#21432c] transition-colors",
            children: [
              /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4 text-[#70a37e]" }),
              /* @__PURE__ */ jsx("span", { children: "Simular prévia · nada será emitido" })
            ]
          }
        )
      ] })
    ] }) }),
    toastMessage && /* @__PURE__ */ jsxs("div", { className: "fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border border-[#70a37e]/40 bg-[#14261b] px-4 py-2.5 text-xs text-[#d6f0dd] shadow-2xl backdrop-blur-md animate-fade-in", children: [
      /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4 text-[#70a37e]" }),
      /* @__PURE__ */ jsx("span", { children: toastMessage })
    ] })
  ] });
};
export {
  PestsTab
};
