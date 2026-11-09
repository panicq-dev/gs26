import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import {
  RotateCcw,
  CheckCircle2
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";
const FinancialSimulatorTab = () => {
  const [pesticideCostPerHa, setPesticideCostPerHa] = useState(145);
  const [areaHa, setAreaHa] = useState(260);
  const [cottonPricePerArroba, setCottonPricePerArroba] = useState(138);
  const [expectedYield, setExpectedYield] = useState(318);
  const [delayDays, setDelayDays] = useState(0);
  const [toast, setToast] = useState(null);
  const baseLossRiskPct = 22;
  const delayPenaltyPct = delayDays * 2.8;
  const actualAvoidedDamagePct = Math.max(2, baseLossRiskPct - delayPenaltyPct);
  const applicationCostTotal = areaHa * pesticideCostPerHa;
  const grossCropValueInArea = areaHa * expectedYield * cottonPricePerArroba;
  const valuePreservedBrl = grossCropValueInArea * (actualAvoidedDamagePct / 100);
  const netFinancialBenefit = valuePreservedBrl - applicationCostTotal;
  const returnOnInvestment = applicationCostTotal > 0 ? netFinancialBenefit / applicationCostTotal * 100 : 0;
  const spraySavedLiters = Math.round(areaHa * (delayDays > 0 ? 0 : 13.5));
  const comparisonData = [
    {
      scenario: "Hoje (Ideal)",
      custo: Math.round(applicationCostTotal / 1e3),
      preservado: Math.round(grossCropValueInArea * (baseLossRiskPct / 100) / 1e3),
      liquido: Math.round((grossCropValueInArea * (baseLossRiskPct / 100) - applicationCostTotal) / 1e3)
    },
    {
      scenario: `Cen\xE1rio Atual (+${delayDays}d)`,
      custo: Math.round(applicationCostTotal / 1e3),
      preservado: Math.round(valuePreservedBrl / 1e3),
      liquido: Math.round(netFinancialBenefit / 1e3)
    },
    {
      scenario: "Atraso de 5 Dias",
      custo: Math.round(applicationCostTotal / 1e3),
      preservado: Math.round(grossCropValueInArea * Math.max(2, baseLossRiskPct - 14) / 100 / 1e3),
      liquido: Math.round((grossCropValueInArea * Math.max(2, baseLossRiskPct - 14) / 100 - applicationCostTotal) / 1e3)
    }
  ];
  const resetDefaults = () => {
    setPesticideCostPerHa(145);
    setAreaHa(260);
    setCottonPricePerArroba(138);
    setExpectedYield(318);
    setDelayDays(0);
  };
  const saveScenario = () => {
    setToast("Cen\xE1rio de simula\xE7\xE3o salvo e anexado ao plano da Safra 26/27.");
    setTimeout(() => setToast(null), 3500);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#1f2c22] pb-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#79907c]", children: [
          /* @__PURE__ */ jsx("span", { children: "Economia Agr\xEDcola de Precis\xE3o" }),
          /* @__PURE__ */ jsx("span", { children: "\xB7" }),
          /* @__PURE__ */ jsx("span", { children: "Modelagem de Sensibilidade" })
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "mt-1 text-2xl font-bold tracking-tight text-white", children: "Simulador Financeiro de Manejo & Retorno" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#8ca290]", children: "Calcule o retorno sobre investimento (ROI) de aplica\xE7\xF5es oportunas contra perdas de produtividade por pragas." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: resetDefaults,
            className: "flex items-center gap-1.5 rounded-lg border border-[#2b3a2f] bg-[#141c16] px-3 py-1.5 text-xs text-[#8da290] hover:text-white transition-colors",
            children: [
              /* @__PURE__ */ jsx(RotateCcw, { className: "h-3.5 w-3.5" }),
              /* @__PURE__ */ jsx("span", { children: "Redefinir Padr\xF5es" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: saveScenario,
            className: "flex items-center gap-1.5 rounded-lg border border-[#70a37e]/40 bg-[#172c1e] px-3.5 py-1.5 text-xs font-semibold text-[#b8e8c3] hover:bg-[#1f3b28] transition-colors",
            children: [
              /* @__PURE__ */ jsx(CheckCircle2, { className: "h-3.5 w-3.5 text-[#70a37e]" }),
              /* @__PURE__ */ jsx("span", { children: "Salvar Cen\xE1rio" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-5 rounded-xl border border-[#222e25] bg-[#111713] p-5 text-[#e0eae0] space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-[#1f2b21] pb-3", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-mono uppercase tracking-wider text-[#708472]", children: "PAR\xC2METROS DA OPERA\xC7\xC3O" }),
          /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-white", children: "Vari\xE1veis de Custo & Mercado" })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-xs mb-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[#8ca290]", children: "Custo de Defensivo por Hectare:" }),
            /* @__PURE__ */ jsxs("span", { className: "font-mono font-bold text-white tabular-nums", children: [
              "R$ ",
              pesticideCostPerHa,
              " ",
              /* @__PURE__ */ jsx("span", { className: "font-normal text-[#718574]", children: "/ ha" })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "range",
              min: "50",
              max: "400",
              step: "5",
              value: pesticideCostPerHa,
              onChange: (e) => setPesticideCostPerHa(Number(e.target.value)),
              className: "w-full accent-[#70a37e] cursor-pointer"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[10px] font-mono text-[#5f7463] mt-1", children: [
            /* @__PURE__ */ jsx("span", { children: "R$ 50" }),
            /* @__PURE__ */ jsx("span", { children: "R$ 200" }),
            /* @__PURE__ */ jsx("span", { children: "R$ 400" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-xs mb-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[#8ca290]", children: "\xC1rea em Aplica\xE7\xE3o:" }),
            /* @__PURE__ */ jsxs("span", { className: "font-mono font-bold text-white tabular-nums", children: [
              areaHa,
              " ",
              /* @__PURE__ */ jsx("span", { className: "font-normal text-[#718574]", children: "hectares" })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "range",
              min: "50",
              max: "1248",
              step: "10",
              value: areaHa,
              onChange: (e) => setAreaHa(Number(e.target.value)),
              className: "w-full accent-[#70a37e] cursor-pointer"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[10px] font-mono text-[#5f7463] mt-1", children: [
            /* @__PURE__ */ jsx("span", { children: "50 ha" }),
            /* @__PURE__ */ jsx("span", { children: "260 ha (Talh\xF5es 08-09)" }),
            /* @__PURE__ */ jsx("span", { children: "1.248 ha (Total)" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-xs mb-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[#8ca290]", children: "Cota\xE7\xE3o da Arroba de Algod\xE3o:" }),
            /* @__PURE__ */ jsxs("span", { className: "font-mono font-bold text-white tabular-nums", children: [
              "R$ ",
              cottonPricePerArroba,
              " ",
              /* @__PURE__ */ jsx("span", { className: "font-normal text-[#718574]", children: "/ @" })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "range",
              min: "100",
              max: "220",
              step: "2",
              value: cottonPricePerArroba,
              onChange: (e) => setCottonPricePerArroba(Number(e.target.value)),
              className: "w-full accent-[#70a37e] cursor-pointer"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[10px] font-mono text-[#5f7463] mt-1", children: [
            /* @__PURE__ */ jsx("span", { children: "R$ 100" }),
            /* @__PURE__ */ jsx("span", { children: "R$ 138 (M\xE9dia CEPEA)" }),
            /* @__PURE__ */ jsx("span", { children: "R$ 220" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-xs mb-1.5", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[#8ca290]", children: "Atraso Simulado de Aplica\xE7\xE3o:" }),
            /* @__PURE__ */ jsx("span", { className: `font-mono font-bold tabular-nums ${delayDays > 0 ? "text-[#ff9e85]" : "text-[#9de8b2]"}`, children: delayDays === 0 ? "0 dias (No Prazo Ideal)" : `+${delayDays} dias de atraso` })
          ] }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "range",
              min: "0",
              max: "7",
              step: "1",
              value: delayDays,
              onChange: (e) => setDelayDays(Number(e.target.value)),
              className: "w-full accent-[#c89b53] cursor-pointer"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-[10px] font-mono text-[#5f7463] mt-1", children: [
            /* @__PURE__ */ jsx("span", { children: "Hoje" }),
            /* @__PURE__ */ jsx("span", { children: "+3 dias" }),
            /* @__PURE__ */ jsx("span", { children: "+7 dias (Cr\xEDtico)" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7 flex flex-col justify-between rounded-xl border border-[#222e25] bg-[#111713] p-5 text-[#e0eae0]", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-[#1f2b21] pb-3 mb-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-mono uppercase tracking-wider text-[#708472]", children: "RESULTADO ECON\xD4MICO PROJETADO" }),
              /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-white", children: "Balan\xE7o de Perdas Evitadas vs Custo" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs text-[#718574]", children: "Benef\xEDcio L\xEDquido:" }),
              /* @__PURE__ */ jsxs("p", { className: "text-2xl font-bold font-mono text-[#9de8b2] tabular-nums", children: [
                "R$ ",
                netFinancialBenefit.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5", children: [
            /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-[#202b22] bg-[#141d16] p-3", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[11px] text-[#718574] block", children: "Custo Total de Aplica\xE7\xE3o" }),
              /* @__PURE__ */ jsxs("p", { className: "text-lg font-bold text-white font-mono mt-0.5 tabular-nums", children: [
                "R$ ",
                applicationCostTotal.toLocaleString("pt-BR")
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-[#202b22] bg-[#141d16] p-3", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[11px] text-[#718574] block", children: "Valor Preservado na Safra" }),
              /* @__PURE__ */ jsxs("p", { className: "text-lg font-bold text-[#86a88b] font-mono mt-0.5 tabular-nums", children: [
                "R$ ",
                Math.round(valuePreservedBrl).toLocaleString("pt-BR")
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-[#202b22] bg-[#141d16] p-3", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[11px] text-[#718574] block", children: "ROI da Decis\xE3o Preventiva" }),
              /* @__PURE__ */ jsxs("p", { className: "text-lg font-bold text-[#c89b53] font-mono mt-0.5 tabular-nums", children: [
                Math.round(returnOnInvestment),
                "%"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "h-52 w-full mt-2", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(BarChart, { data: comparisonData, children: [
            /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1c271f", vertical: false }),
            /* @__PURE__ */ jsx(XAxis, { dataKey: "scenario", stroke: "#637968", tick: { fontSize: 11 } }),
            /* @__PURE__ */ jsx(YAxis, { stroke: "#637968", tick: { fontSize: 11 }, unit: "k" }),
            /* @__PURE__ */ jsx(
              Tooltip,
              {
                contentStyle: {
                  backgroundColor: "#111713",
                  borderColor: "#293a2d",
                  borderRadius: "8px",
                  fontSize: "12px",
                  color: "#e4eae2"
                },
                formatter: (val) => [`R$ ${val} mil`, ""]
              }
            ),
            /* @__PURE__ */ jsx(Legend, { wrapperStyle: { fontSize: 11, paddingTop: 8 } }),
            /* @__PURE__ */ jsx(Bar, { dataKey: "custo", name: "Custo de Aplica\xE7\xE3o", fill: "#586c5c", radius: [4, 4, 0, 0] }),
            /* @__PURE__ */ jsx(Bar, { dataKey: "preservado", name: "Valor Preservado", fill: "#70a37e", radius: [4, 4, 0, 0] }),
            /* @__PURE__ */ jsx(Bar, { dataKey: "liquido", name: "Saldo L\xEDquido", fill: "#d1a342", radius: [4, 4, 0, 0] })
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-3 border-t border-[#1c271f] flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-[#7f9482] gap-2", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            "Calda poupada via taxa vari\xE1vel: ",
            /* @__PURE__ */ jsxs("strong", { className: "text-white", children: [
              spraySavedLiters.toLocaleString(),
              " L"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            "Economia de carbono equivalente: ",
            /* @__PURE__ */ jsx("strong", { className: "text-[#70a37e]", children: "1,4 t CO\u2082e" })
          ] })
        ] })
      ] })
    ] }),
    toast && /* @__PURE__ */ jsxs("div", { className: "fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border border-[#70a37e]/40 bg-[#14261b] px-4 py-2.5 text-xs text-[#d6f0dd] shadow-2xl backdrop-blur-md animate-fade-in", children: [
      /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4 text-[#70a37e]" }),
      /* @__PURE__ */ jsx("span", { children: toast })
    ] })
  ] });
};
export {
  FinancialSimulatorTab
};
