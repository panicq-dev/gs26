# Uso de inteligência artificial

Este arquivo registra o uso de inteligência artificial na preparação desta
versão de Campoalto. O registro descreve as interações efetivamente realizadas
na sessão. O grupo deve revisar o documento antes de entregá-lo e corrigir ou
complementar qualquer informação sobre outras ferramentas ou integrantes.

## Ferramentas utilizadas

- **Copilot SDK no VS Code (assistente de IA):** leitura e migração do código
  TypeScript/TSX existente para JavaScript/JSX; identificação dos requisitos de
  Web Development; implementação da persistência de estoque, do modo
  demonstrativo, da documentação e dos testes.
- **Node.js e npm:** instalação das dependências, execução dos testes e
  compilação. São ferramentas de desenvolvimento, não serviços de IA.

## Interações realizadas

Exemplos representativos desta sessão:

1. **Prompt:** “transfira todo o código para javascript / reactJs e que me
   ensine como executar e execute”.
   **Resposta/aplicação:** a estrutura React/Vite existente foi preservada,
   os arquivos TypeScript/TSX da aplicação foram migrados para
   JavaScript/JSX e foram preparados os comandos de instalação e execução.
2. **Prompt:** foram informados os critérios das disciplinas Front-end Design
   e Web Development: React, Vite ou Next.js, Tailwind, ao menos oito
   componentes, `useState`, `useEffect`, dois hooks personalizados, separação
   de responsabilidades, API externa com CRUD, Git e documentação `AI.md`.
   **Resposta/aplicação:** a entrega foi adaptada com hooks personalizados,
   camada de dados, integração Supabase e funcionalidades de CRUD para
   estoque.
3. **Pergunta à pessoa usuária:** foi solicitado que escolhesse a API externa
   e informasse os detalhes não secretos necessários para sua integração.
   **Resposta:** “prefiro supabase, estou sem os dados da API”.
   **Resposta/aplicação:** a aplicação ganhou uma configuração opcional de
   Supabase, um esquema SQL e um modo local para que pudesse ser executada
   antes de o projeto Supabase e as credenciais existirem.
4. **Informação fornecida pela pessoa usuária:** foram compartilhados o texto
   completo da seção 5.4 e os requisitos de documentação de IA.
   **Resposta/aplicação:** este documento e o README descrevem os requisitos
   e os passos que ainda dependem do grupo.
5. **Prompt:** “não deixe pontas soltas, melhore tudo que conseguir, e tambem
   mude um pouco o designer, pois esta com muita cara de IA, preciso que deixe
   mais Humano e intuitivo de usar, e para o drone crie um tutorial até com
   video se possivel”.
   **Resposta/aplicação:** a navegação foi redesenhada com cores naturais,
   atalhos claros, mensagens explícitas sobre dados de demonstração e uma
   animação SVG original para acompanhar um guia acessível de cinco etapas.
   Não foi apresentado vídeo gravado como se fosse uma operação real de drone.

## Aplicação no projeto

- Migração de `src/main.tsx`, `src/App.tsx`, componentes `.tsx`, dados `.ts` e
  configuração `vite.config.ts` para JavaScript/JSX.
- `src/hooks/useAgroData.js` administra o carregamento assíncrono e as
  operações de criação, atualização e remoção do estoque.
- `src/hooks/useConnectionStatus.js` monitora a conexão do navegador e informa
  o modo de execução.
- `src/data/agroRepository.js` separa as leituras e escritas do Supabase e do
  armazenamento local.
- `src/domain/inventory.js` concentra as regras de validação, movimentação e
  classificação do estoque.
- `src/components/dashboard/SuppliesTab.jsx` apresenta a consulta, o
  cadastro, a edição, a exclusão e as movimentações de estoque.
- `supabase/schema.sql` documenta a estrutura e as políticas necessárias
  para reproduzir a integração em um projeto Supabase.
- `src/components/drone/DroneTutorial.jsx` apresenta um guia interativo de
  planejamento, segurança, coleta e análise, acompanhado de animação vetorial.
- `src/components/layout/Sidebar.jsx` e `src/components/layout/Topbar.jsx`
  receberam um redesenho em tons naturais, navegação mais clara e acesso ao
  tutorial.

## Validação das respostas

Os testes automatizados verificam os cálculos de estoque, as entradas e
saídas, as validações, e as quatro operações do repositório no modo local. O
build de Vite verifica a compilação de produção. A navegação e o ciclo de
criação, edição, movimentação e exclusão também foram exercitados no navegador
com Playwright.

Não foi possível testar a conexão com uma conta Supabase real, pois a pessoa
usuária ainda não criou o projeto nem forneceu a URL e a chave pública.
Portanto, o funcionamento remoto depende de executar o esquema SQL e
configurar `.env.local`.

## Análise crítica

A assistência acelerou a conversão, a organização do código e a criação de
testes e documentação. As sugestões ainda exigem revisão humana: o
armazenamento local existe somente neste navegador e não é sincronizado entre
dispositivos; o Supabase remoto ainda depende de configuração manual; e as
políticas SQL abertas destinam-se somente à demonstração e exigem autenticação
e isolamento por usuário antes de qualquer implantação pública.

Este registro descreve esta sessão de trabalho, não interações de integrantes
que não tenham participado dela. O grupo deve registrar por conta própria
quais outras ferramentas foram usadas, como cada integrante validou a
aplicação e eventuais alterações feitas antes da entrega. A ilustração do
tutorial foi criada no próprio projeto; não é uma filmagem real nem demonstra
pilotagem de aeronave.
