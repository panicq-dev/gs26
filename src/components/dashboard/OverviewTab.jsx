import { jsx, jsxs } from "react/jsx-runtime";
import {
  Map,
  ShieldCheck,
  Droplets,
  Sprout,
  CloudRain,
  Wind,
  Thermometer,
  ArrowRight,
  Check,
  Wheat,
  Clock,
  ExternalLink
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { FarmFieldPreview } from "./FarmFieldPreview.jsx";
import {
  CUMULATIVE_SAVINGS_HISTORY,
  HOURLY_WEATHER_48H
} from "../../data/mockAgroData";
const OverviewTab = ({
  talhoes,
  pests,
  selectedTalhao,
  onSelectTalhao,
  onNavigate
}) => {
  const today = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(new Date());
  const totalArea = talhoes.reduce((sum, talhao) => sum + talhao.areaHa, 0);
  const highRiskCount = talhoes.filter((talhao) => talhao.riskLevel === "high").length;
  const averageNdvi = talhoes.length > 0
    ? (talhoes.reduce((sum, talhao) => sum + talhao.ndvi, 0) / talhoes.length).toFixed(2)
    : "—";

  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#1f2c22] pb-5", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#79907c]", children: [
          /* @__PURE__ */ jsx("span", { children: today }),
          /* @__PURE__ */ jsx("span", { children: "\xB7" }),
          /* @__PURE__ */ jsx("span", { children: "Dados ilustrativos" })
        ] }),
        /* @__PURE__ */ jsxs("h1", { className: "mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-white", children: [
          "Visão da fazenda ",
          /* @__PURE__ */ jsx("span", { className: "font-light text-[#59705e]", children: "\u2014" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs sm:text-sm text-[#8ba28f]", children: "Prioridades agron\xF4micas e monitoramento 3D para a Fazenda Santa Helena." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-[#27382c] bg-[#121a14] px-3 py-1.5 text-xs text-[#cad9cc]", children: [
          /* @__PURE__ */ jsx("span", { className: "text-[#6d8270]", children: "Safra: " }),
          /* @__PURE__ */ jsx("strong", { className: "text-white font-semibold", children: "2026/2027" })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => onNavigate("Mapa de risco"),
            className: "flex items-center gap-1.5 rounded-lg border border-[#70a37e]/40 bg-[#172c1e] px-3.5 py-1.5 text-xs font-semibold text-[#b8e8c3] hover:bg-[#1e3b28] transition-colors",
            children: [
              /* @__PURE__ */ jsx(Map, { className: "h-3.5 w-3.5 text-[#70a37e]" }),
              /* @__PURE__ */ jsx("span", { children: "Abrir Mapa 3D Completo" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5", children: [
      /* @__PURE__ */ jsxs("article", { className: "rounded-xl border border-[#222e25] bg-gradient-to-br from-[#131b15] to-[#0f1511] p-4 text-[#e0eae0]", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs text-[#7f9482]", children: [
          /* @__PURE__ */ jsx("span", { children: "Área cadastrada · exemplo" }),
          /* @__PURE__ */ jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-lg border border-[#2b3a2f] bg-[#172119] text-[#86a88b]", children: /* @__PURE__ */ jsx(Map, { className: "h-3.5 w-3.5" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 text-2xl font-bold tracking-tight text-white font-mono tabular-nums", children: [
          new Intl.NumberFormat("pt-BR").format(totalArea),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-sans font-normal text-[#869b89]", children: "ha" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-1.5 text-[11px] text-[#718574]", children: [
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-[#86a88b]", children: talhoes.length }),
          /* @__PURE__ */ jsx("span", { children: "\xB7" }),
          /* @__PURE__ */ jsx("span", { children: "Algod\xE3o & rota\xE7\xE3o soja" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("article", { className: "rounded-xl border border-[#222e25] bg-gradient-to-br from-[#131b15] to-[#0f1511] p-4 text-[#e0eae0]", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs text-[#7f9482]", children: [
          /* @__PURE__ */ jsx("span", { children: "Talhões · risco alto" }),
          /* @__PURE__ */ jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-lg border border-[#2b3a2f] bg-[#172119] text-[#70a37e]", children: /* @__PURE__ */ jsx(ShieldCheck, { className: "h-3.5 w-3.5" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 text-2xl font-bold tracking-tight text-white font-mono tabular-nums", children: [
          highRiskCount,
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-sm font-sans font-normal text-[#869b89]", children: "de " }),
          talhoes.length
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-1.5 text-[11px] text-[#70a37e]", children: [
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-[#86a88b]", children: "Dados ilustrativos" }),
          /* @__PURE__ */ jsx("span", { className: "text-[#718574]", children: "· confira na lavoura" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("article", { className: "rounded-xl border border-[#222e25] bg-gradient-to-br from-[#131b15] to-[#0f1511] p-4 text-[#e0eae0]", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs text-[#7f9482]", children: [
          /* @__PURE__ */ jsx("span", { children: "Pragas cadastradas" }),
          /* @__PURE__ */ jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-lg border border-[#2b3a2f] bg-[#172119] text-[#6b95a8]", children: /* @__PURE__ */ jsx(Droplets, { className: "h-3.5 w-3.5" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 text-2xl font-bold tracking-tight text-white font-mono tabular-nums", children: [
          pests.length,
          " ",
          /* @__PURE__ */ jsx("span", { className: "text-sm font-sans font-normal text-[#869b89]", children: "registros" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-1.5 text-[11px] text-[#6b95a8]", children: [
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-[#6b95a8]", children: "Exemplo para revisão" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("article", { className: "rounded-xl border border-[#222e25] bg-gradient-to-br from-[#131b15] to-[#0f1511] p-4 text-[#e0eae0]", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-xs text-[#7f9482]", children: [
          /* @__PURE__ */ jsx("span", { children: "NDVI médio · exemplo" }),
          /* @__PURE__ */ jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-lg border border-[#2b3a2f] bg-[#172119] text-[#c89b53]", children: /* @__PURE__ */ jsx(Sprout, { className: "h-3.5 w-3.5" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 text-2xl font-bold tracking-tight text-white font-mono tabular-nums", children: [
          averageNdvi
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-1.5 text-[11px] text-[#c89b53]", children: [
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: "Dados demonstrativos" }),
          /* @__PURE__ */ jsx("span", { className: "text-[#718574]", children: "· não é leitura de sensor" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "grid grid-cols-1 lg:grid-cols-12 gap-5", children: [
      /* @__PURE__ */ jsxs("article", { className: "lg:col-span-7 flex flex-col rounded-xl border border-[#222e25] bg-[#111713] p-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-mono uppercase tracking-wider text-[#708472]", children: "FAZENDA · VISÃO ESQUEMÁTICA" }),
            /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-white", children: "Escolha um talhão" })
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => onNavigate("Mapa de risco"),
              className: "flex items-center gap-1 text-xs text-[#86a88b] hover:text-white transition-colors",
              children: [
                /* @__PURE__ */ jsx("span", { children: "Abrir mapa" }),
                /* @__PURE__ */ jsx(ExternalLink, { className: "h-3 w-3" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex-1 min-h-[340px]", children: /* @__PURE__ */ jsx(
          FarmFieldPreview,
          {
            talhoes,
            selectedTalhaoId: selectedTalhao?.id,
            onSelectTalhao
          }
        ) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center justify-between text-[11px] text-[#718574] pt-2 border-t border-[#1c261e]", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            "Talh\xE3o focado: ",
            /* @__PURE__ */ jsx("strong", { className: "text-white", children: selectedTalhao?.code || "Talh\xE3o 08" }),
            " (",
            selectedTalhao?.areaHa || 142,
            " ha)"
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "text-[#8da290]", children: [
            "Área de ",
            /* @__PURE__ */ jsx("strong", { children: "exemplo" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("article", { className: "lg:col-span-5 flex flex-col rounded-xl border border-[#222e25] bg-[#111713] p-4 text-[#e0eae0]", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-mono uppercase tracking-wider text-[#708472]", children: "MODELO PREDITIVO \xB7 PR\xD3XIMOS 7 DIAS" }),
            /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-white", children: "Risco Fitossanit\xE1rio Ativo" })
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => onNavigate("Pragas e doen\xE7as"),
              className: "text-xs text-[#86a88b] hover:text-white transition-colors flex items-center gap-1",
              children: [
                /* @__PURE__ */ jsx("span", { children: "Ver todas" }),
                /* @__PURE__ */ jsx(ArrowRight, { className: "h-3 w-3" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between rounded-lg border border-[#202c22] bg-[#141d16] px-3 py-2 text-xs text-[#869b88] mb-3", children: [
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(Droplets, { className: "h-3.5 w-3.5 text-[#6b95a8]" }),
            "Umidade m\xE9dia: ",
            /* @__PURE__ */ jsx("strong", { className: "text-white", children: "78%" })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(Thermometer, { className: "h-3.5 w-3.5 text-[#c89b53]" }),
            "Temperatura: ",
            /* @__PURE__ */ jsx("strong", { className: "text-white", children: "27 \xB0C" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-2.5 flex-1", children: pests.slice(0, 3).map((pest) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "rounded-lg border border-[#202b22] bg-[#131b15] p-2.5 hover:border-[#304132] transition-colors",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      className: "h-2 w-2 rounded-full",
                      style: { backgroundColor: pest.color }
                    }
                  ),
                  /* @__PURE__ */ jsx("strong", { className: "text-xs font-semibold text-white", children: pest.name })
                ] }),
                /* @__PURE__ */ jsxs(
                  "span",
                  {
                    className: `rounded px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase ${pest.riskLevel === "high" ? "bg-[#eb7351]/20 text-[#ff8f70] border border-[#eb7351]/40" : pest.riskLevel === "medium" ? "bg-[#d1a342]/20 text-[#ebd173] border border-[#d1a342]/40" : "bg-[#639777]/20 text-[#8ec7a0] border border-[#639777]/30"}`,
                    children: [
                      pest.probabilityPct,
                      "%"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("p", { className: "mt-1 text-[11px] text-[#7c907e] italic", children: [
                pest.scientificName,
                " \xB7 ",
                pest.primaryLocation
              ] }),
              /* @__PURE__ */ jsx("div", { className: "mt-2 h-1.5 w-full rounded-full bg-[#1e2a21] overflow-hidden", children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: "h-full rounded-full transition-all duration-500",
                  style: {
                    width: `${pest.probabilityPct}%`,
                    backgroundColor: pest.color
                  }
                }
              ) })
            ]
          },
          pest.id
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 rounded-lg border border-[#3b3220] bg-[#1a1711] p-3 text-xs text-[#cfbc93]", children: [
          /* @__PURE__ */ jsx("strong", { className: "block font-semibold text-[#f0d499] mb-1", children: "A\xE7\xE3o Recomendada \xB7 Pr\xF3ximas 36h:" }),
          /* @__PURE__ */ jsx("p", { className: "text-[11px] text-[#b8a782]", children: "Inspecionar bot\xF5es florais no setor norte (Talh\xF5es 08 e 09) antes da frente de chuva prevista para o final da tarde." })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => onNavigate("Pragas e doen\xE7as"),
            className: "mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#2e4032] bg-[#17221a] py-2 text-xs font-medium text-[#c0d4c2] hover:bg-[#1e2e23] hover:text-white transition-colors",
            children: [
              /* @__PURE__ */ jsx("span", { children: "Abrir Plano de Manejo Fitossanit\xE1rio" }),
              /* @__PURE__ */ jsx(ArrowRight, { className: "h-3.5 w-3.5" })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "rounded-xl border border-[#222e25] bg-[#111713] p-4 text-[#e0eae0]", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-mono uppercase tracking-wider text-[#708472]", children: "JANELA CLIM\xC1TICA DE PULVERIZA\xC7\xC3O \xB7 PR\xD3XIMAS 48 HORAS" }),
          /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-white", children: "Previs\xE3o e Condi\xE7\xE3o de Aplica\xE7\xE3o" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 rounded-lg border border-[#c89b53]/40 bg-[#251e12] px-3 py-1.5 text-xs text-[#ecc482]", children: [
          /* @__PURE__ */ jsx(Clock, { className: "h-3.5 w-3.5" }),
          /* @__PURE__ */ jsxs("span", { children: [
            "Janela de aplica\xE7\xE3o encerra hoje \xE0s ",
            /* @__PURE__ */ jsx("strong", { children: "16:00" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 overflow-x-auto pb-2", children: HOURLY_WEATHER_48H.map((wh, idx) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: `flex flex-col items-center justify-center min-w-[90px] rounded-lg border p-2.5 text-xs transition-colors ${wh.sprayStatus === "ideal" ? "border-[#293d2e] bg-[#142017]" : wh.sprayStatus === "alerta" ? "border-[#3d3420] bg-[#1f1a11]" : "border-[#3a2522] bg-[#1f1312]"}`,
          children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-mono text-[#829685]", children: wh.hour }),
            /* @__PURE__ */ jsxs("div", { className: "my-1.5 text-sm font-bold text-white font-mono tabular-nums", children: [
              wh.temp,
              "\xB0"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-[10px] text-[#869b89]", children: [
              /* @__PURE__ */ jsx(Wind, { className: "h-3 w-3 text-[#6b95a8]" }),
              /* @__PURE__ */ jsxs("span", { children: [
                wh.windSpeed,
                " km/h"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center gap-1 text-[10px]", children: [
              /* @__PURE__ */ jsx(CloudRain, { className: "h-3 w-3 text-[#6b95a8]" }),
              /* @__PURE__ */ jsxs("span", { className: "text-[#829685]", children: [
                wh.rainProb,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "span",
              {
                className: `mt-2 rounded px-1.5 py-0.5 text-[9px] font-mono uppercase font-semibold ${wh.sprayStatus === "ideal" ? "text-[#8ec7a0] bg-[#639777]/20" : wh.sprayStatus === "alerta" ? "text-[#ebd173] bg-[#d1a342]/20" : "text-[#ff8f70] bg-[#eb7351]/20"}`,
                children: wh.sprayStatus
              }
            )
          ]
        },
        wh.hour
      )) })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "grid grid-cols-1 lg:grid-cols-12 gap-5", children: [
      /* @__PURE__ */ jsxs("article", { className: "lg:col-span-7 rounded-xl border border-[#222e25] bg-[#111713] p-4 text-[#e0eae0]", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-mono uppercase tracking-wider text-[#708472]", children: "ECONOMIA ACUMULADA \xB7 SAFRA 26/27" }),
            /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold text-white", children: "Evolu\xE7\xE3o de Perdas Evitadas" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsx("span", { className: "text-xs text-[#718574]", children: "Total acumulado:" }),
            /* @__PURE__ */ jsx("p", { className: "text-lg font-bold font-mono text-[#9de8b2] tabular-nums", children: "R$ 184.620,40" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "h-48 w-full mt-3", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(AreaChart, { data: CUMULATIVE_SAVINGS_HISTORY, children: [
          /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "totalSavingsGrad", x1: "0", y1: "0", x2: "0", y2: "1", children: [
            /* @__PURE__ */ jsx("stop", { offset: "5%", stopColor: "#70a37e", stopOpacity: 0.4 }),
            /* @__PURE__ */ jsx("stop", { offset: "95%", stopColor: "#70a37e", stopOpacity: 0 })
          ] }) }),
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#1f2c22", vertical: false }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "day", stroke: "#5f7463", tick: { fontSize: 11 } }),
          /* @__PURE__ */ jsx(YAxis, { stroke: "#5f7463", tick: { fontSize: 11 }, unit: " mil" }),
          /* @__PURE__ */ jsx(
            Tooltip,
            {
              contentStyle: {
                backgroundColor: "#121914",
                borderColor: "#2b3b2f",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#e4eae2"
              },
              formatter: (val) => [`R$ ${val} mil`, "Economia"]
            }
          ),
          /* @__PURE__ */ jsx(
            Area,
            {
              type: "monotone",
              dataKey: "total",
              stroke: "#70a37e",
              strokeWidth: 2.5,
              fillOpacity: 1,
              fill: "url(#totalSavingsGrad)"
            }
          )
        ] }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center justify-between text-xs text-[#7f9482] pt-2 border-t border-[#1c271f]", children: [
          /* @__PURE__ */ jsxs("span", { children: [
            "Defensivos poupados: ",
            /* @__PURE__ */ jsx("strong", { className: "text-white", children: "R$ 62,4 mil" })
          ] }),
          /* @__PURE__ */ jsxs("span", { children: [
            "Produtividade preservada: ",
            /* @__PURE__ */ jsx("strong", { className: "text-white", children: "R$ 122,2 mil" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("article", { className: "lg:col-span-5 flex flex-col justify-between rounded-xl border border-[#2b3c2e] bg-gradient-to-br from-[#142118] to-[#0f1712] p-4 text-[#e0eae0]", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-mono uppercase tracking-wider text-[#86a88b]", children: "IMPACTO DA DECIS\xC3O DE ONTEM" }),
            /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 rounded bg-[#70a37e]/20 px-2 py-0.5 text-[10px] font-medium text-[#9de8b2] border border-[#70a37e]/30", children: [
              /* @__PURE__ */ jsx(Check, { className: "h-3 w-3" }),
              " Aplicada"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("h3", { className: "text-base font-semibold text-white mt-2", children: [
            "Sua decis\xE3o evitou aplicar ",
            /* @__PURE__ */ jsx("em", { className: "not-italic text-[#70a37e]", children: "3.420 litros" }),
            " de calda."
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-[#8da290] leading-relaxed", children: "Adiar a aplica\xE7\xE3o preventiva no Talh\xE3o 03 evitou uma pulveriza\xE7\xE3o desnecess\xE1ria. O monitoramento multiespectral confirmou que o limiar de dano econ\xF4mico n\xE3o foi ultrapassado." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 pt-3 border-t border-[#203124] grid grid-cols-2 gap-3 text-xs", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-[11px] text-[#718574]", children: "Economia direta" }),
            /* @__PURE__ */ jsx("p", { className: "text-base font-bold text-white font-mono tabular-nums", children: "R$ 8.960" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-[11px] text-[#718574]", children: "Pegada de carbono" }),
            /* @__PURE__ */ jsx("p", { className: "text-base font-bold text-[#86a88b] font-mono tabular-nums", children: "\u22121,2 t CO\u2082e" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#222e25] bg-[#111713] p-3.5 text-xs text-[#cad9cb]", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#3b321e] bg-[#221c10] text-[#c89b53]", children: /* @__PURE__ */ jsx(Wheat, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("strong", { className: "block text-white font-semibold", children: "Pr\xF3xima reposi\xE7\xE3o de Ureia Protegida em 18 dias" }),
          /* @__PURE__ */ jsx("span", { className: "text-[11px] text-[#7f9482]", children: "Estoque atual de 2,4 toneladas cobre a aduba\xE7\xE3o de cobertura dos talh\xF5es 05, 08 e 09." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          onClick: () => onNavigate("Insumos & estoque"),
          className: "flex items-center gap-1.5 rounded-lg border border-[#2d3e30] bg-[#162218] px-3.5 py-1.5 text-xs font-semibold text-[#86a88b] hover:bg-[#1c2c20] hover:text-white transition-colors shrink-0",
          children: [
            /* @__PURE__ */ jsx("span", { children: "Conferir Estoque" }),
            /* @__PURE__ */ jsx(ArrowRight, { className: "h-3.5 w-3.5" })
          ]
        }
      )
    ] })
  ] });
};
export {
  OverviewTab
};
