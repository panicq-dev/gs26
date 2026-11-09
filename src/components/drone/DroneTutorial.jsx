import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  Camera,
  Check,
  CircleHelp,
  ExternalLink,
  FileImage,
  Focus,
  Map,
  Navigation,
  Plane,
  ShieldCheck,
  X,
} from 'lucide-react';

const tutorialSteps = [
  {
    title: 'Antes de sair da sede',
    eyebrow: '01 · PLANEJAMENTO',
    icon: ClipboardList,
    description:
      'Escolha o talhão e combine o objetivo com quem conhece a lavoura: acompanhar uma área, identificar uma falha ou documentar a evolução da cultura.',
    checks: [
      'Defina a área e o horário da visita.',
      'Confira bateria, hélices, câmera, cartão e GPS.',
      'Verifique o vento, a chuva e as condições indicadas pelo fabricante.',
    ],
  },
  {
    title: 'Voe com segurança',
    eyebrow: '02 · SEGURANÇA',
    icon: ShieldCheck,
    description:
      'O plano e o controle de voo acontecem no aplicativo do fabricante, fora desta plataforma. Nunca use o mapa abaixo para enviar comandos ao equipamento.',
    checks: [
      'Confirme as regras vigentes da ANAC e do DECEA para o voo.',
      'Verifique se é necessário solicitar autorização no SARPAS.',
      'Inspecione o local; mantenha distância de pessoas e obstáculos.',
    ],
  },
  {
    title: 'Registre imagens úteis',
    eyebrow: '03 · COLETA',
    icon: Camera,
    description:
      'Faça o registro de acordo com o sensor, o terreno e o objetivo do levantamento. Imagens bonitas não substituem uma coleta apropriada para análise.',
    checks: [
      'Confirme foco, iluminação e cartão antes de decolar.',
      'Siga o plano de voo e as instruções do fabricante.',
      'Se as imagens forem para um mosaico, siga as recomendações do software de processamento.',
    ],
  },
  {
    title: 'Traga o resultado para a análise',
    eyebrow: '04 · DEPOIS DO VOO',
    icon: FileImage,
    description:
      'Organize os arquivos originais e processe o levantamento em uma ferramenta apropriada. A importação de fotos e ortomosaicos ainda não está disponível nesta demonstração.',
    checks: [
      'Faça cópia dos arquivos e anote talhão, data e sensor.',
      'Confira o resultado do processamento e o sistema de coordenadas.',
      'Não trate os dados de exemplo da Campoalto como imagens coletadas.',
    ],
  },
  {
    title: 'Leia o mapa com contexto',
    eyebrow: '05 · INTERPRETAÇÃO',
    icon: Focus,
    description:
      'Na demonstração, explore os talhões, compare as camadas e inspecione os indicadores de exemplo. Uma anomalia no mapa é um ponto para verificar, não um diagnóstico automático.',
    checks: [
      'Selecione um talhão e compare risco, topografia e NDVI.',
      'Confirme qualquer suspeita na lavoura com um profissional habilitado.',
      'Não use recomendações ilustrativas como receituário ou orientação de aplicação.',
    ],
  },
];

const DroneAnimation = ({ stepIndex }) => (
  <div
    className="relative overflow-hidden rounded-[18px] border border-[#e2e4d7] bg-[#edf0e3]"
    role="img"
    aria-label={`Animação ilustrativa do fluxo de monitoramento com drone, etapa ${stepIndex + 1} de 5`}
  >
    <div className="absolute inset-0 drone-tutorial-grid" aria-hidden="true" />
    <svg
      viewBox="0 0 640 280"
      className="relative block w-full"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect x="22" y="24" width="596" height="232" rx="14" fill="#e6eadb" />
      <path d="M22 193 Q168 125 320 176 T618 156 V242 Q466 274 307 228 T22 251Z" fill="#d2dcc5" />
      <path d="M22 215 Q160 157 314 200 T618 178 M22 235 Q162 177 314 220 T618 198" fill="none" stroke="#b2c4a0" strokeWidth="2" />
      <g fill="#89a378" stroke="#66835f" strokeWidth="2">
        <path d="M88 51h137v43H88z" rx="4" />
        <path d="M241 51h135v43H241z" rx="4" />
        <path d="M392 51h169v43H392z" rx="4" />
        <path d="M88 105h137v43H88z" />
        <path d="M241 105h135v43H241z" />
        <path d="M392 105h169v43H392z" />
      </g>
      <path d="M157 47V153M310 47V153M474 47V153M82 100H570" fill="none" stroke="#e5ecd9" strokeWidth="3" />
      <g fill="#778768">
        <circle cx="578" cy="197" r="13" />
        <circle cx="599" cy="188" r="16" />
        <circle cx="585" cy="220" r="14" />
        <path d="M582 200h6v31h-6z" />
      </g>
      <g className="drone-tutorial-path">
        <path d="M94 41H550V154H100V37" fill="none" stroke="#647e54" strokeWidth="2" strokeDasharray="6 6" />
        <circle cx="102" cy="42" r="5" fill="#d39a55" />
      </g>
      <g className="drone-tutorial-flight">
        <path d="M0 10h32M3 5v10M29 5v10" stroke="#385342" strokeWidth="3" strokeLinecap="round" />
        <path d="m13 8 3-5 3 5-3 3z" fill="#6a8a5e" />
        <path d="m16 11 7 3-7 3-3-3z" fill="#6a8a5e" />
        <circle cx="16" cy="11" r="2" fill="#f3f1e7" />
        <path d="m16 16 6 36" stroke="#8c9a74" strokeWidth="1" strokeDasharray="3 4" />
      </g>
      <text x="92" y="176" fill="#68755e" fontSize="10" fontFamily="sans-serif">TALHÕES · VOO ILUSTRATIVO</text>
      <rect x="438" y="203" width="153" height="24" rx="12" fill="#f8f8f2" />
      <circle cx="453" cy="215" r="4" fill="#bc9558" />
      <text x="464" y="219" fill="#67715f" fontSize="10" fontFamily="sans-serif">SIMULAÇÃO · SEM CONTROLE REAL</text>
    </svg>
    <div className="relative flex items-center justify-between border-t border-[#dce0d2] bg-[#f7f7f0] px-4 py-3">
      <div className="flex items-center gap-2 text-[11px] font-medium text-[#63705b]">
        <Plane className="h-3.5 w-3.5" />
        <span>{tutorialSteps[stepIndex].eyebrow}</span>
      </div>
      <span className="text-[10px] text-[#898b7d]">Animação explicativa · não é vídeo de voo real</span>
    </div>
  </div>
);

export function DroneTutorial({ onClose, onOpenMap }) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = tutorialSteps[stepIndex];
  const StepIcon = step.icon;
  const dialogRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key === 'Tab') {
        const focusableElements = dialogRef.current?.querySelectorAll(
          'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements?.length) {
          event.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [onClose]);

  const moveToStep = (nextIndex) => {
    setStepIndex(Math.max(0, Math.min(tutorialSteps.length - 1, nextIndex)));
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-[#172017]/50 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drone-tutorial-title"
        className="flex max-h-[94dvh] w-full max-w-[780px] flex-col overflow-hidden rounded-t-[22px] border border-[#e5e6db] bg-[#fbfaf6] shadow-[0_20px_70px_rgba(27,39,26,.22)] sm:max-h-[88dvh] sm:rounded-[22px]"
      >
        <header className="flex items-start justify-between border-b border-[#e9e9df] px-5 py-4 sm:px-7 sm:py-5">
          <div className="flex items-start gap-3.5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[#e9ede1] text-[#587150]">
              <Navigation aria-hidden="true" className="h-[19px] w-[19px]" />
            </span>
            <div>
              <p className="text-[10px] font-semibold tracking-[1.5px] text-[#8b8b7b]">
                GUIA PRÁTICO · {stepIndex + 1} DE {tutorialSteps.length}
              </p>
              <h2 id="drone-tutorial-title" className="mt-1 text-lg font-semibold tracking-[-.3px] text-[#29372b] sm:text-xl">
                Um voo bem planejado
              </h2>
            </div>
          </div>
          <button
            type="button"
            autoFocus
            onClick={onClose}
            aria-label="Fechar tutorial"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#7c8175] hover:bg-[#eeefe7] hover:text-[#364635] focus-visible:outline-2 focus-visible:outline-[#638251]"
          >
            <X className="h-[17px] w-[17px]" />
          </button>
        </header>

        <div className="grid gap-5 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6 md:grid-cols-[1.05fr_.95fr] md:gap-6">
          <div>
            <DroneAnimation stepIndex={stepIndex} />
            <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-[#e6e5d9] bg-[#f4f3ec] px-3.5 py-3">
              <CircleHelp aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[#89825f]" />
              <p className="text-[11px] leading-relaxed text-[#727364]">
                A animação e os mapas são ilustrações deste projeto acadêmico. A Campoalto ainda não conecta, pilota, agenda voos nem importa imagens de drone.
              </p>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-[10px] font-semibold tracking-[1.2px] text-[#898b7d]">
              <span>{step.eyebrow}</span>
            </div>
            <div className="mt-2 flex items-center gap-2.5">
              <StepIcon aria-hidden="true" className="h-[19px] w-[19px] shrink-0 text-[#6f855c]" />
              <h3 className="text-[17px] font-semibold tracking-[-.3px] text-[#2d392c]">{step.title}</h3>
            </div>
            <p className="mt-2.5 text-[12px] leading-[1.75] text-[#696e61]">{step.description}</p>

            <ul className="mt-4 space-y-3">
              {step.checks.map((check) => (
                <li key={check} className="flex gap-2.5 text-[11px] leading-relaxed text-[#555e50]">
                  <span className="mt-0.5 flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full bg-[#e7ecdf] text-[#638153]">
                    <Check className="h-3 w-3" strokeWidth={2.5} />
                  </span>
                  {check}
                </li>
              ))}
            </ul>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <a
                href="https://www.gov.br/anac/pt-br/assuntos/drones"
                target="_blank"
                rel="noreferrer"
                className="flex min-h-[38px] items-center justify-center gap-1.5 rounded-[10px] border border-[#e3e3d7] bg-white px-2 text-center text-[10px] font-medium text-[#646b5b] hover:bg-[#f0f1e9]"
              >
                ANAC · drones <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
              <a
                href="https://servicos.decea.mil.br/sarpas/"
                target="_blank"
                rel="noreferrer"
                className="flex min-h-[38px] items-center justify-center gap-1.5 rounded-[10px] border border-[#e3e3d7] bg-white px-2 text-center text-[10px] font-medium text-[#646b5b] hover:bg-[#f0f1e9]"
              >
                DECEA · SARPAS <ExternalLink className="h-3 w-3 shrink-0" />
              </a>
            </div>
          </div>

          <nav aria-label="Etapas do tutorial" className="flex items-center justify-center gap-2 md:col-span-2">
            {tutorialSteps.map((item, index) => (
              <button
                key={item.eyebrow}
                type="button"
                aria-label={`Etapa ${index + 1}: ${item.title}`}
                aria-current={stepIndex === index ? 'step' : undefined}
                onClick={() => moveToStep(index)}
                className={`h-[4px] flex-1 max-w-[52px] rounded-full transition-colors ${
                  index <= stepIndex ? 'bg-[#70865e]' : 'bg-[#e1e2d7] hover:bg-[#bdc7ae]'
                }`}
              />
            ))}
          </nav>
        </div>

        <footer className="flex items-center justify-between gap-2 border-t border-[#e9e9df] bg-[#f8f7f2] px-5 py-3.5 sm:px-7">
          {stepIndex === 0 ? (
            <button type="button" onClick={onClose} className="min-h-10 px-2 text-xs font-medium text-[#717567] hover:text-[#334232]">
              Fechar
            </button>
          ) : (
            <button
              type="button"
              onClick={() => moveToStep(stepIndex - 1)}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-[10px] px-3 text-xs font-medium text-[#62695b] hover:bg-[#eeefe7]"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Anterior
            </button>
          )}

          {stepIndex < tutorialSteps.length - 1 ? (
            <button
              type="button"
              onClick={() => moveToStep(stepIndex + 1)}
              className="inline-flex min-h-10 items-center gap-2 rounded-[10px] bg-[#526c49] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#435c3b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#526c49]"
            >
              Continuar <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenMap();
              }}
              className="inline-flex min-h-10 items-center gap-2 rounded-[10px] bg-[#526c49] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#435c3b]"
            >
              <Map className="h-3.5 w-3.5" /> Explorar mapa demonstrativo
            </button>
          )}
        </footer>
      </section>
    </div>
  );
}
