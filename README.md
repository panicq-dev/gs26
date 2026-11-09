# Campoalto · Gestão agrícola

Aplicação de React e Vite para acompanhamento de lavouras, riscos, pragas e
estoque agrícola. Usa Tailwind CSS, mapa de terreno 3D e CRUD de insumos com
Supabase ou, enquanto o banco não estiver configurado, armazenamento local no
navegador.

## Pré-requisitos

- Node.js 20.19+ ou 22.12+.
- npm, instalado com o Node.js.
- Uma conta Supabase gratuita **somente** se quiser usar banco remoto. A
aplicação também funciona sem conta no modo de demonstração.

## Executar localmente

Abra um terminal na pasta do projeto e instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Sem configuração do
Supabase, a interface indica **Demonstração local**; o estoque inicial e suas
alterações ficam salvos nesse navegador. O projeto é uma demonstração
acadêmica: dados de talhões, alertas, clima, fornecedores e simulações são
ilustrativos; não representam uma fazenda real nem telemetria de drone.

## Usar o guia de voo

Selecione **Guia do drone** no topo da aplicação ou **Como funciona o voo**
na tela de exploração da fazenda. O guia apresenta cinco etapas práticas,
uma animação ilustrativa própria, navegação por teclado e atalhos para as
orientações da [ANAC sobre drones](https://www.gov.br/anac/pt-br/assuntos/drones)
e do [SARPAS/DECEA](https://servicos.decea.mil.br/sarpas/).

**A animação não é um vídeo de voo real.** A plataforma não se conecta a um
drone, não envia comandos, não processa nem importa imagens ou ortomosaicos e
não substitui o aplicativo do fabricante, as autorizações aplicáveis ou a
avaliação de um profissional. O botão de rota na tela 3D apenas anima uma
aeronave virtual; as alterações de risco também são demonstrações temporárias.

## Testes e compilação de produção

```bash
npm test
npm run build
npm run preview
```

O comando `preview` exibe a compilação localmente depois de executar `npm run
build`. Hospedar a aplicação e fornecer o endereço de deploy são passos
separados; não há URL de produção configurada neste projeto.

## Ativar o Supabase

1. Crie um projeto no [Supabase](https://supabase.com/).
2. No painel do projeto, abra o **SQL Editor**, copie o conteúdo de
   [`supabase/schema.sql`](./supabase/schema.sql) e execute o script. Ele cria
   a tabela de estoque e suas políticas de acesso de demonstração.
3. Na configuração **Project URL** e **API Keys**, copie a URL e a chave
   pública `anon`/publishable. Nunca use a chave secreta ou `service_role` no
   navegador.
4. Copie `.env.example` para `.env.local` e substitua os valores:

   ```dotenv
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua_chave_publica
   ```

5. Reinicie `npm run dev`. Na primeira conexão, a aplicação envia para a tabela
   o estoque salvo localmente se houver; caso contrário, inicializa registros
   de exemplo quando a tabela está vazia.

`.env.local` está excluído do Git. As políticas públicas do SQL são
**exclusivamente para demonstração com dados fictícios** e permitem que
qualquer pessoa com a URL do projeto leia, cadastre, atualize e exclua
registros. Não publique dados reais com essas políticas. Antes de um deploy
público, adicione autenticação Supabase e restrinja o acesso às tabelas por
usuário.

Se a configuração estiver incompleta, a aplicação informa quais variáveis
faltam. Se a tabela ou as políticas não existirem, a interface exibe o erro;
as alterações não são apresentadas como salvas na API.

## Organização

```text
src/
  components/     Interface React reutilizável, preview esquemático e 3D
  data/           Dados iniciais e acesso ao Supabase/armazenamento local
  domain/         Regras de negócio e testes do estoque
  hooks/          Estado do domínio e conectividade com o navegador
  lib/            Inicialização do Supabase
  components/drone/ Guia de voo interativo com ilustração original
  App.jsx         Composição das telas
  main.jsx        Ponto de entrada da aplicação
supabase/
  schema.sql      Tabela e políticas do Supabase
```

O estoque permite consultar, cadastrar, atualizar e excluir insumos, além de
registrar entradas e saídas. As regras para calcular autonomia e nível de
estoque ficam separadas das chamadas de dados e dos componentes visuais.

## Entrega acadêmica

Consulte [`AI.md`](./AI.md) para o registro do uso de inteligência artificial.
O histórico Git, a criação de um repositório GitHub privado, os acessos de
escrita dos professores e a publicação do deploy precisam ser providenciados
e verificados com as contas dos responsáveis. Não crie nem apresente commits
retroativos como se fossem etapas de desenvolvimento.

Para gerar um ZIP sem dependências nem arquivos de configuração secretos,
compacte a pasta do projeto excluindo `node_modules`, `dist`, `.git` e
`.env.local`.
