import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import {
  Star,
  Clock,
  ShieldCheck,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  Search
} from "lucide-react";
const SuppliersTab = ({ suppliers }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [quoteModalSupplier, setQuoteModalSupplier] = useState(null);
  const [quoteProduct, setQuoteProduct] = useState("Clorantraniliprole 200 SC");
  const [quoteQty, setQuoteQty] = useState("100 Litros");
  const [toast, setToast] = useState(null);
  const filteredSuppliers = suppliers.filter(
    (s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.city.toLowerCase().includes(searchTerm.toLowerCase()) || s.categories.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  const handleSendQuote = (e) => {
    e.preventDefault();
    if (!quoteModalSupplier) return;
    setToast(
      `Simulação de cotação para ${quoteQty} de ${quoteProduct} concluída. Nenhum fornecedor foi contatado.`
    );
    setQuoteModalSupplier(null);
    setTimeout(() => setToast(null), 3500);
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#1f2c22] pb-4", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#79907c]", children: [
          /* @__PURE__ */ jsx("span", { children: "Rede Homologada de Suprimentos" }),
          /* @__PURE__ */ jsx("span", { children: "\xB7" }),
          /* @__PURE__ */ jsx("span", { children: "Regi\xE3o de Ribeir\xE3o Preto" })
        ] }),
        /* @__PURE__ */ jsx("h1", { className: "mt-1 text-2xl font-bold tracking-tight text-white", children: "Fornecedores & Cota\xE7\xE3o de Insumos" }),
        /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-[#8ca290]", children: "Distribuidores qualificados de defensivos, sementes e biol\xF3gicos com tempo m\xE9dio de entrega e \xEDndice de confiabilidade." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center rounded-lg border border-[#233127] bg-[#121a14] px-3 py-1.5 text-xs text-white", children: [
        /* @__PURE__ */ jsx(Search, { className: "h-3.5 w-3.5 text-[#6c8270] mr-2" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            placeholder: "Buscar distribuidor ou categoria...",
            className: "bg-transparent placeholder-[#617765] focus:outline-none w-48 sm:w-60"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: filteredSuppliers.map((supplier) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "rounded-xl border border-[#222e25] bg-[#111713] p-4 text-[#e0eae0] flex flex-col justify-between hover:border-[#324535] transition-colors",
        children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold text-white", children: supplier.name }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-[#7f9482]", children: [
                  supplier.city,
                  ", ",
                  supplier.state
                ] })
              ] }),
              supplier.certified && /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1 rounded bg-[#70a37e]/20 px-2 py-0.5 text-[10px] font-medium text-[#9de8b2] border border-[#70a37e]/30", children: [
                /* @__PURE__ */ jsx(ShieldCheck, { className: "h-3 w-3" }),
                " Homologado"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-3.5 grid grid-cols-2 gap-2 text-xs", children: [
              /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-[#202b22] bg-[#141d16] p-2.5", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] text-[#718574]", children: "Prazo de Entrega" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 mt-0.5", children: [
                  /* @__PURE__ */ jsx(Clock, { className: "h-3.5 w-3.5 text-[#c89b53]" }),
                  /* @__PURE__ */ jsxs("strong", { className: "text-sm text-white font-mono", children: [
                    supplier.leadTimeDays,
                    " ",
                    supplier.leadTimeDays === 1 ? "dia" : "dias"
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-[#202b22] bg-[#141d16] p-2.5", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] text-[#718574]", children: "Confiabilidade" }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 mt-0.5", children: [
                  /* @__PURE__ */ jsx(Star, { className: "h-3.5 w-3.5 text-[#d1a342] fill-[#d1a342]" }),
                  /* @__PURE__ */ jsxs("strong", { className: "text-sm text-white font-mono", children: [
                    supplier.reliabilityPct,
                    "%"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "mt-3 flex flex-wrap gap-1.5", children: supplier.categories.map((cat) => /* @__PURE__ */ jsx(
              "span",
              {
                className: "rounded bg-[#17221a] px-2 py-0.5 text-[10px] text-[#8ea290] border border-[#253629]",
                children: cat
              },
              cat
            )) }),
            /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-1 text-[11px] text-[#7a8f7d] pt-2 border-t border-[#1c271f]", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx(Phone, { className: "h-3 w-3 text-[#6c8270]" }),
                /* @__PURE__ */ jsx("span", { children: supplier.phone })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsx(Mail, { className: "h-3 w-3 text-[#6c8270]" }),
                /* @__PURE__ */ jsx("span", { className: "truncate", children: supplier.email })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => setQuoteModalSupplier(supplier),
              className: "mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#2e4233] bg-[#16241b] py-2 text-xs font-semibold text-[#86a88b] hover:bg-[#1d3023] hover:text-white transition-colors",
              children: [
                /* @__PURE__ */ jsx(Send, { className: "h-3.5 w-3.5" }),
                /* @__PURE__ */ jsx("span", { children: "Simular cotação" })
              ]
            }
          )
        ]
      },
      supplier.id
    )) }),
    quoteModalSupplier && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md rounded-2xl border border-[#2d3f31] bg-[#121a14] p-6 shadow-2xl text-[#e0eae0]", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-[#212f24] pb-3 mb-4", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("span", { className: "text-[10px] font-mono uppercase tracking-wider text-[#70a37e]", children: "SIMULAÇÃO · NENHUM PEDIDO SERÁ ENVIADO" }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-white", children: quoteModalSupplier.name })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => setQuoteModalSupplier(null),
            className: "text-[#6d8270] hover:text-white",
            children: "\u2715"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: handleSendQuote, className: "space-y-4 text-xs", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[#8ca290] block mb-1", children: "Insumo Desejado:" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              required: true,
              value: quoteProduct,
              onChange: (e) => setQuoteProduct(e.target.value),
              className: "w-full rounded-lg border border-[#293a2d] bg-[#162118] px-3 py-2 text-white focus:outline-none"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "text-[#8ca290] block mb-1", children: "Volume / Quantidade:" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              required: true,
              value: quoteQty,
              onChange: (e) => setQuoteQty(e.target.value),
              className: "w-full rounded-lg border border-[#293a2d] bg-[#162118] px-3 py-2 text-white focus:outline-none font-mono"
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-[#202b22] bg-[#141d16] p-3 text-[11px] text-[#869b88]", children: /* @__PURE__ */ jsxs("span", { children: [
          "Prazo m\xE9dio contratual de entrega: ",
          /* @__PURE__ */ jsxs("strong", { className: "text-white", children: [
            quoteModalSupplier.leadTimeDays,
            " dia(s) \xFAteis"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "pt-3 border-t border-[#202d23] flex items-center justify-end gap-3", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => setQuoteModalSupplier(null),
              className: "rounded-lg border border-[#2b3a2e] px-4 py-2 text-xs font-medium text-[#8da290] hover:bg-[#18231a] hover:text-white transition-colors",
              children: "Cancelar"
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "submit",
              className: "flex items-center gap-1.5 rounded-lg border border-[#70a37e]/40 bg-[#1a3523] px-4 py-2 text-xs font-semibold text-[#b8e8c3] hover:bg-[#21432c] transition-colors",
              children: [
                /* @__PURE__ */ jsx(Send, { className: "h-4 w-4 text-[#70a37e]" }),
                /* @__PURE__ */ jsx("span", { children: "Confirmar demonstração" })
              ]
            }
          )
        ] })
      ] })
    ] }) }),
    toast && /* @__PURE__ */ jsxs("div", { className: "fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg border border-[#70a37e]/40 bg-[#14261b] px-4 py-2.5 text-xs text-[#d6f0dd] shadow-2xl backdrop-blur-md animate-fade-in", children: [
      /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4 text-[#70a37e]" }),
      /* @__PURE__ */ jsx("span", { children: toast })
    ] })
  ] });
};
export {
  SuppliersTab
};
