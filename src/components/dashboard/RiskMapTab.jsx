import { jsx, jsxs } from "react/jsx-runtime";
import { lazy, Suspense, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Send,
  Plane,
  Info
} from "lucide-react";
const FieldTerrain3D = lazy(() =>
  import("../three/FieldTerrain3D.jsx").then((module) => ({
    default: module.FieldTerrain3D,
  }))
);
const RiskMapTab = ({
  talhoes,
  selectedTalhao,
  onSelectTalhao,
  onScheduleSpray,
  onOpenTutorial
}) => {
  const [filterRisk, setFilterRisk] = useState("all");
  const [successToast, setSuccessToast] = useState(null);
  const filteredTalhoes = talhoes.filter((t) => {
    if (filterRisk === "all") return true;
    return t.riskLevel === filterRisk;
  });
  const highRiskCount = talhoes.filter((t) => t.riskLevel === "high").length;
  const mediumRiskCount = talhoes.filter((t) => t.riskLevel === "medium").length;
  const lowRiskCount = talhoes.filter((t) => t.riskLevel === "low").length;
  const currentTalhao = selectedTalhao || talhoes.find((t) => t.id === "t-08") || talhoes[0];
  const handleAction = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#1f2c22] pb-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#79907c]", children: [
          /* @__PURE__ */ jsx("span", { children: "Mapa demonstrativo" }),
          /* @__PURE__ */ jsx("span", { children: "\xB7" }),
          /* @__PURE__ */ jsx("span", { children: "Modelo 3D ilustrativo" })
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "mt-1 text-2xl font-bold tracking-tight text-white", children: "Explore a fazenda" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#8ca290]", children: "Explore os talhões e compare os indicadores de exemplo. Este mapa não controla drones nem mostra imagens reais." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2 sm:justify-end", children: [
        /* @__PURE__ */ jsxs("button", {
          type: "button",
          onClick: onOpenTutorial,
          className: "flex items-center gap-2 rounded-lg border border-[#dfe2d5] bg-[#f7f6f0] px-3 py-2 text-xs font-medium text-[#526449] transition-colors hover:bg-white",
          children: [/* @__PURE__ */ jsx(BookOpen, { className: "h-3.5 w-3.5" }), "Como funciona o voo"]
        }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 bg-[#121a14] p-1 rounded-lg border border-[#233127]", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setFilterRisk("all"),
            className: `px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filterRisk === "all" ? "bg-[#213024] text-white shadow-sm" : "text-[#7e9381] hover:text-white"}`,
            children: [
              "Todos (",
              talhoes.length,
              ")"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setFilterRisk("high"),
            className: `flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filterRisk === "high" ? "bg-[#42291d] text-[#ff9e85] border border-[#eb7351]/40" : "text-[#7e9381] hover:text-[#ff9e85]"}`,
            children: [
              /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-[#eb7351]" }),
              "Alto Risco (",
              highRiskCount,
              ")"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setFilterRisk("medium"),
            className: `flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filterRisk === "medium" ? "bg-[#3b321a] text-[#ffd875] border border-[#d1a342]/40" : "text-[#7e9381] hover:text-[#ffd875]"}`,
            children: [
              /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-[#d1a342]" }),
              "Aten\xE7\xE3o (",
              mediumRiskCount,
              ")"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setFilterRisk("low"),
            className: `flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${filterRisk === "low" ? "bg-[#182e1f] text-[#a5e0b6] border border-[#52a66e]/40" : "text-[#7e9381] hover:text-[#a5e0b6]"}`,
            children: [
              /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-[#52a66e]" }),
              "Normal (",
              lowRiskCount,
              ")"
            ]
          }
        )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 overflow-x-auto pb-1 text-xs", children: [
      /* @__PURE__ */ jsx("span", { className: "text-[11px] font-mono uppercase text-[#6f8272] shrink-0", children: "Talh\xF5es:" }),
      filteredTalhoes.map((t) => {
        const isSelected = currentTalhao.id === t.id;
        return /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => onSelectTalhao(t),
            className: `flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-medium whitespace-nowrap transition-colors ${isSelected ? "border-[#70a37e] bg-[#1a2f21] text-white shadow" : "border-[#223026] bg-[#111713] text-[#8ca08f] hover:border-[#334638] hover:text-white"}`,
            children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: "h-1.5 w-1.5 rounded-full",
                  style: {
                    backgroundColor: t.riskLevel === "high" ? "#eb7351" : t.riskLevel === "medium" ? "#d1a342" : "#52a66e"
                  }
                }
              ),
              /* @__PURE__ */ jsx("span", { children: t.code }),
              /* @__PURE__ */ jsxs("span", { className: "text-[10px] text-[#6d8070]", children: [
                "(",
                t.areaHa,
                " ha)"
              ] })
            ]
          },
          t.id
        );
      })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-5", children: [
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-8", children: /* @__PURE__ */ jsx(
        Suspense,
        {
          fallback: /* @__PURE__ */ jsx("div", { role: "status", className: "flex min-h-[360px] items-center justify-center rounded-xl border border-[#dfe2d5] bg-[#f7f6f0] text-sm text-[#747969]", children: "Preparando visualização 3D demonstrativa..." }),
          children: /* @__PURE__ */ jsx(FieldTerrain3D, {
            talhoes,
            selectedTalhaoId: currentTalhao.id,
            onSelectTalhao
          })
        }
      ) }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-4 flex flex-col rounded-xl border border-[#232f26] bg-[#111713] p-4 text-[#e0eae0]", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-[#1f2b21] pb-3 mb-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-mono uppercase tracking-wider text-[#708472]", children: "DETALHES DO TALH\xC3O" }),
            /* @__PURE__ */ jsx("h2", { className: "text-lg font-bold text-white", children: currentTalhao.code }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-[#8ca28f]", children: currentTalhao.name })
          ] }),
          /* @__PURE__ */ jsxs(
            "span",
            {
              className: `rounded-lg px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider ${currentTalhao.riskLevel === "high" ? "bg-[#eb7351]/20 text-[#ff8f70] border border-[#eb7351]/40" : currentTalhao.riskLevel === "medium" ? "bg-[#d1a342]/20 text-[#ebd173] border border-[#d1a342]/40" : "bg-[#639777]/20 text-[#8ec7a0] border border-[#639777]/30"}`,
              children: [
                currentTalhao.riskPct,
                "% Risco"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2.5 text-xs", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-[#202b22] bg-[#141d16] p-2.5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[11px] text-[#718574]", children: "\xC1rea Total" }),
            /* @__PURE__ */ jsxs("p", { className: "text-base font-bold text-white font-mono", children: [
              currentTalhao.areaHa,
              " ha"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-[#202b22] bg-[#141d16] p-2.5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[11px] text-[#718574]", children: "Altitude M\xE9dia" }),
            /* @__PURE__ */ jsxs("p", { className: "text-base font-bold text-white font-mono", children: [
              currentTalhao.elevationM,
              " m"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-[#202b22] bg-[#141d16] p-2.5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[11px] text-[#718574]", children: "Umidade do Solo" }),
            /* @__PURE__ */ jsxs("p", { className: "text-base font-bold text-[#6b95a8] font-mono", children: [
              currentTalhao.moisturePct,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-[#202b22] bg-[#141d16] p-2.5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[11px] text-[#718574]", children: "\xCDndice NDVI" }),
            /* @__PURE__ */ jsx("p", { className: "text-base font-bold text-[#86a88b] font-mono", children: currentTalhao.ndvi.toFixed(2) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3.5 space-y-2 text-xs border-t border-[#1c271f] pt-3 flex-1", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[#728574]", children: "Cultura & Variedade:" }),
            /* @__PURE__ */ jsxs("strong", { className: "text-white", children: [
              currentTalhao.crop,
              " (",
              currentTalhao.variety,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[#728574]", children: "Tipo de Solo:" }),
            /* @__PURE__ */ jsx("strong", { className: "text-white", children: currentTalhao.soilType })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[#728574]", children: "Amea\xE7a Principal:" }),
            /* @__PURE__ */ jsx("strong", { className: currentTalhao.riskLevel === "high" ? "text-[#ff8f70]" : "text-white", children: currentTalhao.primaryThreat })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[#728574]", children: "\xDAltimo voo cadastrado · exemplo:" }),
            /* @__PURE__ */ jsx("strong", { className: "text-[#8ca28e]", children: currentTalhao.lastDronePass })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 rounded-lg border border-[#2e3e32] bg-[#152219] p-3 text-xs", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-[#86a88b] font-semibold mb-1", children: [
            /* @__PURE__ */ jsx(Info, { className: "h-3.5 w-3.5" }),
            /* @__PURE__ */ jsx("span", { children: "Observação ilustrativa" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#b4c9b7] leading-relaxed", children: "Os indicadores deste talhão são dados fictícios. Confira o que acontece na lavoura e consulte um profissional habilitado antes de decidir qualquer manejo." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-3 border-t border-[#1f2b21] space-y-2", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                if (onScheduleSpray) onScheduleSpray(currentTalhao);
                handleAction(`Simulação atualizada para ${currentTalhao.code}. Nenhuma aplicação real foi agendada.`);
              },
              className: "flex w-full items-center justify-center gap-2 rounded-lg border border-[#70a37e]/40 bg-[#193322] py-2 text-xs font-semibold text-[#b8e8c3] hover:bg-[#20402b] transition-colors",
              children: [
                /* @__PURE__ */ jsx(Send, { className: "h-3.5 w-3.5" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  "Simular atualização de risco em ",
                  currentTalhao.code
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: onOpenTutorial,
              className: "flex w-full items-center justify-center gap-2 rounded-lg border border-[#2b3a2f] bg-[#141c16] py-2 text-xs font-medium text-[#8da290] hover:bg-[#1a261d] hover:text-white transition-colors",
              children: [
                /* @__PURE__ */ jsx(Plane, { className: "h-3.5 w-3.5" }),
                /* @__PURE__ */ jsx("span", { children: "Ver guia de voo" })
              ]
            }
          )
        ] })
      ] })
    ] }),
    successToast && /* @__PURE__ */ jsxs("div", { className: "fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border border-[#70a37e]/40 bg-[#14261b] px-4 py-2.5 text-xs text-[#d6f0dd] shadow-2xl backdrop-blur-md animate-fade-in", children: [
      /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4 text-[#70a37e]" }),
      /* @__PURE__ */ jsx("span", { children: successToast })
    ] })
  ] });
};
export {
  RiskMapTab
};
