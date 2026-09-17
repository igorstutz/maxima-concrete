# Maxima Concrete — Novo Website

Recriação do site maximaconcrete.com (antes feito no Lovable com Supabase) seguindo a
arquitetura do Maxima Pools: **Next.js 16 App Router + `output: "export"` (100% estático),
Tailwind v4, conteúdo em JSON no repositório, painel Sveltia CMS, deploy Hostinger**.

## Referências
- Site antigo (fonte do visual e da copy): `../maximaconcrete/` — Vite+React+shadcn.
  O visual deve ser reproduzido o mais fielmente possível (estética refinada/cara:
  heros escuros full-bleed, Poppins, gradientes azul-marinho).
- Arquitetura de referência: `C:\Users\igors\OneDrive\Documentos\Projetos Claude Code\Melanies\Maxima\Site Maxima Pools\Novo Website`

## Regras de layout (a correção nº 1 deste rebuild)
- O menu lateral flutuante ocupa 350px no desktop. **NENHUMA seção pode recalcular esse
  offset por conta própria** (nada de `-ml-[350px]`, `w-screen`, `calc(100%+350px)`).
- `<section>` externo = full-bleed (fundo/cor/imagem ocupa a viewport inteira).
- Conteúdo SEMPRE dentro de `<Container>` (`src/components/Container.tsx`), que reserva
  os 350px uma única vez e centraliza em `max-w-[1200px]` (variantes `wide` 1400px,
  `narrow` 768px). Todas as seções alinham nas mesmas colunas.
- Ritmo vertical padrão: `py-16 sm:py-24` (seções maiores `py-20 sm:py-28`).
- Exceção full-viewport: heros de tela cheia podem não usar Container para a imagem,
  mas o TEXTO do hero usa Container.

## Design system (`src/app/globals.css`, tokens `@theme`)
- Cores: `primary` #1e90ff, `primary-dark` #003b8b, `navy` #041c2d, `ocean` #0d5d93,
  `surface` #f5f7fa, `surface-soft` #f7f9fb, `surface-alt` #ededed.
- Botão primário: classe `gradient-navy` (90deg ocean→navy), `rounded-[10px]`, texto branco.
- Fonte: Poppins (via `next/font`), pesos 300–700. Títulos com `tracking-tight`, peso 500/600.
- Utilitários prontos: `.glass-effect`, `.text-shadow-hero`, `.gradient-blue`,
  `.animate-hero-zoom`, `.reveal*` (com `<ScrollReveal>`), `.scrollbar-hide`, `.touch-scroll-x`.

## Sistema de conteúdo
- `src/content/pages/<pageKey>.json` = `{ pageKey, sections: [{ key, label, type, content }] }`.
  Gerados a partir do CMS antigo (Supabase) — **a copy é a real do site em produção, não alterar textos**.
- Imagens: já baixadas em `public/images/` (caminhos `/images/...` dentro dos JSONs).
- Componentes de seção: `src/components/sections/<área>/` — um componente por `type`,
  recebendo `content` por props. Server components por padrão; `"use client"` apenas
  quando há interatividade real (carrossel, form, accordion).
- Usar `Image` de `@/components/Image` (nunca `next/image` direto — basePath) e
  `ScrollReveal` para animações de entrada.
- Conteúdo global fora de páginas (footer etc.): `_extraction/orphan-content.json` →
  mover para `src/content/settings/`.
- **Tipos dos campos no painel (cuidado — já apagou conteúdo):** o `config.yml` infere
  o widget de cada campo pela UNIÃO de todas as instâncias daquele tipo de seção. Se um
  campo de lista aparecer como `""` em alguma página, o campo inteiro vira `widget: string`
  em TODAS as páginas, e o próximo save pelo painel grava uma string por cima do array —
  o conteúdo da lista some. Foi assim que os "Key Benefits" de sidewalks, paverpatios e
  paverdriveways sumiram em 2026-08-18 (recuperados do histórico do Git). Por isso
  `inferSchema` trata `""` como neutro e `mergeSchemas` faz a lista sempre vencer.
  Ao mexer nessas funções, rode a auditoria: nenhum array nos JSONs pode corresponder a
  um campo com widget diferente de `list`.
- **Copiar seção entre páginas:** o Sveltia só duplica dentro do mesmo arquivo, e o
  `config.yml` lista por página apenas os tipos que ela já usa — então o painel sozinho
  não leva uma seção para outra página. A coleção "Copiar seção" grava a escolha em
  `src/content/settings/copy-section.json`; o workflow `copy-section.yml` roda
  `_extraction/apply-copy-section.mjs`, que copia o bloco (key nova, conteúdo junto,
  no fim da página de destino), escreve o resultado no campo `status`, regenera o
  `config.yml` e dispara os deploys. Os deploys ignoram pushes que só mexem nesse
  arquivo de pedido (`paths-ignore`), e o commit do bot não dispara workflow sozinho —
  por isso o `gh workflow run` no fim do copy-section.yml.

## Project Map (os pinos dos mapas)
- Fonte única: a planilha **`_extraction/project-map.xlsx`**, enviada pelo cliente.
  Colunas: `A WORK FULL ADDRESS` (com número da casa), `B WORK ADDRESS` (rua sem
  número) e `C WORK DONE` (serviços). **Atualizar o mapa = substituir a planilha e
  rodar `npm run projects`** (`_extraction/build-projects.mjs`), que regenera
  `src/content/data/projects.json`. Nada disso passa pelo painel: são milhares de
  linhas, planilha é a ferramenta certa.
- **A coluna A nunca sai do script.** `projects.json` é importado pelos componentes
  do mapa, ou seja, chega inteiro ao navegador — guardar o número da casa ali
  entregaria o endereço de ~2.600 clientes a quem abrir as ferramentas do
  desenvolvedor. O pino mostra a coluna C em negrito e a coluna B embaixo; a coluna A
  serve só para geocodificar. Por isso a planilha se chama "addresses without house
  numbers", e por isso **o `.xlsx` é gitignored** (este repositório é público) e as
  chaves do cache de geocodificação são hashes, não o endereço em texto.
- Uma obra por endereço: a planilha traz uma linha por serviço, e o script une os
  serviços do mesmo imóvel num pino só ("Driveway, Patio, Steps").
- Coordenadas: primeiro o cache versionado `_extraction/geocode-cache.json`, depois a
  base já geocodificada do CMS antigo (`_extraction/projects.json`), e só o que sobra
  vai ao Nominatim — busca estruturada primeiro (`street`/`city`/`state`, bem mais
  precisa que texto livre em endereço americano), 1 req/s, User-Agent obrigatório, e
  resultado fora da caixa de Ohio é descartado. Com o cache versionado, uma planilha
  nova geocodifica só os endereços inéditos. O que não resolve (uns 4%, ruas de
  loteamento novo que ainda não estão nas bases) fica de fora do mapa, é listado em
  `_extraction/geocode-failures.txt` (gitignored: tem nome de rua) e vai para o cache
  como falha, para não gastar centenas de requisições de novo a cada regeração —
  `npm run projects -- --retry-failed` força uma nova tentativa nesses.
- Consumidores: `src/app/project-map/ProjectMapExplorer.tsx` (página do mapa) e
  `src/components/sections/home/FindWork.tsx` (seção "Find Our Work Near You", usada
  em várias páginas). O tipo e o HTML do popup são compartilhados em
  `src/lib/projects.ts` — mexer no popup é mexer lá, uma vez.
- `.xlsx` é lido por `_extraction/xlsx.mjs`, um leitor mínimo sem dependências
  (o Node já traz o inflate; um .xlsx é um ZIP de XMLs).

## Atribuição de leads (de onde vem cada contato)
- `src/lib/attribution.ts` classifica a visita (gclid/fbclid/msclkid > UTM > referrer),
  mantém sessão de 30 min e guarda **primeiro toque, último e último não-direto** mais a
  lista de visitas e páginas em `localStorage`. `AttributionTracker` (no layout) liga isso
  às trocas de rota. `/admin` fica fora, como já ficava no GTM.
- **Navegar não gera requisição.** A jornada viaja junto da conversão: campo oculto
  `attribution` no formulário e no corpo do beacon de `track-call.php`. É o padrão dos
  campos ocultos de HubSpot/Marketo, e é o que mantém o site rápido — sem ele seria uma
  requisição por página vista.
- `public/api/track.php` recebe **uma chamada por sessão**, não por página. Serve a dois
  fins: contar as visitas que NÃO viraram lead (sem esse denominador não existe taxa de
  conversão por canal) e renovar o cookie `_mxvid` num `Set-Cookie` — o Safari corta para
  7 dias o cookie escrito por JavaScript, mas não o que vem do servidor. Grava em
  `.private/sessions-AAAA-MM.log`, um arquivo por mês porque cresce com o tráfego.
- O identificador é o **mesmo** `maxima-visitor-id` que o Pixel já usava. Não criar outro:
  dois identificadores contariam visitantes diferentes na mesma pessoa.
- `public/api/attribution-parse.php` é o único lugar que lê o payload, usado pelos dois
  pontos de conversão. Tudo ali chega do navegador: campos copiados um a um, listas
  cortadas, `\r\n` removido (uma quebra de linha forjaria uma linha no log JSONL).
- `data.php` **agrega as sessões por dia × canal no servidor**. Mandar uma linha por
  sessão seria mandar o tráfego inteiro para o navegador; agregado, a resposta tem o
  tamanho do calendário por mais tráfego que o site receba.
- Painel: `/admin/attribution` (canal, primeiro × último toque, conversão por canal,
  campanhas, ligações) e a jornada por lead na lista (`src/app/admin/journey.tsx`).
- **Limite conhecido:** ligação discada à mão, fora do site, não tem origem — só o clique
  no número é rastreável. Atribuir o resto exigiria número de telefone dinâmico (CallRail,
  Twilio), que é serviço pago com pool de números.
- **O histórico não é retroativo:** a medição começa quando entra no ar. Lead antigo
  continua só com o "how did you hear about us" que a pessoa declarou.

## Performance (por que o site é rápido — manter)
- Zero fetch em runtime: JSON importado estaticamente, texto embutido no HTML no build.
- `"use client"` cirúrgico; sem bibliotecas de animação (IntersectionObserver via ScrollReveal).
- Imagens locais WebP; `priority` apenas no hero; **`sizes` corretos são obrigatórios**
  (é por eles que o navegador escolhe a variante certa — sem `sizes` ele baixa a maior).
- Variantes responsivas: o export estático não otimiza imagem em runtime, então
  `_extraction/generate-image-variants.mjs` gera versões em 480/828/1280/1600/1920px
  e `src/lib/image-loader.ts` monta o srcset. Roda sozinho no `npm run build`
  (script `prebuild`); as variantes são derivadas e não vão para o Git. Qualidade
  WebP 85, e **92 nas fotos de hero** (tela cheia, é onde a compressão aparece).
  Ao mudar qualidade ou larguras, rode uma vez com `--apply --force` localmente —
  sem `--force` as variantes já existentes são mantidas (no CI não é preciso, lá
  o checkout vem sem nenhuma).
- Fundo dos heros: sempre por `src/lib/hero-image.ts` (`heroPicture` /
  `heroMobileSource`), nunca montando o `<picture>` na mão. As imagens "-mobile"
  do CMS antigo têm 768 px e borram no celular; o mesmo script gera
  `src/lib/hero-mobile.json` apontando cada uma para uma fonte de resolução
  suficiente (a foto de desktop, ou um recorte dela na proporção vertical).
  Nunca usar `unoptimized` em hero — isso descarta o srcset.
- Widgets externos (Elfsight reviews/instagram) só carregam ao entrar na viewport.

## E-mail dos formulários
- Sai por `public/api/mailer.php` (Brevo, credenciais em `.private/mailer.php`),
  **não** por `mail()`. Motivo: a Hostinger descarta o envelope que o `-f` pede e
  escreve o hostname do servidor no lugar, então o SPF verificado é o de
  `main-hosting.eu` — passa, mas não ALINHA com maximaconcrete.com. Sem DKIM, o
  DMARC falha e o Gmail estampa "via srv1537.main-hosting.eu" e manda para spam.
  Ajustar cabeçalho não resolve; a assinatura tem de vir de quem tem a chave do
  domínio. Sem o arquivo de credenciais, cai no `mail()` de antes.
- Brevo e não Resend porque o DNS está na Wix, que não cria MX em subdomínio —
  e o Resend precisa de um em `send` para verificar o domínio. O Brevo se
  verifica só com TXT. O código dos dois está pronto: o provedor sai do prefixo
  da chave (`re_` = Resend), então quando o DNS sair da Wix basta trocar a chave.
- Todo lead é gravado em `.private/submissions.log` antes de qualquer envio, e o
  painel `/admin` lê desse arquivo — e-mail com problema nunca perde lead.

## Depois do formulário: /thank-you/ e a confirmação ao lead
- O formulário de contato (`src/components/sections/home/Contact.tsx`, usado em
  praticamente todas as páginas) **redireciona** para `/thank-you/` no sucesso, por
  `router.push` e não `window.location`: a página não é descarregada, então os beacons
  que `pushLeadEvent` acabou de enfileirar ainda saem. Um recarregamento ali cancelaria
  a medição da conversão. O aviso verde que fica no lugar do formulário dura só o
  instante da troca de página.
- `/thank-you/` é **noindex, follow**: fora de contexto ela promete uma ligação que
  ninguém pediu e competiria com `/contact-us/` pelas buscas que deveriam cair no
  formulário. Por isso também não entra em `PAGE_ROUTES` nem em `STATIC_ROUTES`
  (`src/lib/routes.ts`) — as duas alimentam o sitemap.
- Conteúdo em `src/content/pages/thankyou_page.json` (painel: Pages › Thank You),
  desenho em `src/app/thank-you/page.tsx`. O visual "líquido" sai de três utilitários
  em `globals.css`: `.liquid-blob` (manchas que se deformam devagar, só decoração e
  paradas em `prefers-reduced-motion`), `.glass-panel` (o cartão de vidro escuro) e
  `.liquid-sheen` (o fio de luz na borda de cima).
- O e-mail `public/api/lead-autoreply.php` é o PAR dessa página: mesmo conteúdo, para
  quem fechou a aba antes de ler chegar ao mesmo lugar. **Mudou um, mude o outro** —
  em especial a lista de números, que existe nos dois arquivos.
- Ele existe porque a ligação de volta não é atendida quando o número é desconhecido.
  Sai pelo mesmo `mailer.php` do resto do site (DKIM do domínio), o que importa mais
  aqui do que nos avisos internos: o destino é a caixa que o cliente digitou (Gmail,
  Yahoo, Outlook.com), justamente quem descarta em silêncio o que não está autenticado.
  `enviar_email` aceita `from_name` só para esta mensagem sair como "Maxima Concrete"
  em vez de "Maxima Concrete Website" — o ENDEREÇO não muda, é ele que carrega a
  assinatura.
- Roda depois de `fastcgi_finish_request()`, nunca lança e nunca imprime: o lead já
  foi gravado e o navegador já tem a resposta. Registra em `.private/lead-autoreply.log`,
  que também serve de trava contra reenvio (6 h para o mesmo endereço).
- Teste sem depender de formulário: `bash scripts/test-autoreply.sh [destinatário[:Nome] ...]`
  (par `scripts/` + `server/`, o mesmo formato do maxima-pools). Só faz sentido na
  Hostinger — é o único ambiente com credencial de envio; na VPS o `mail()` é falso e a
  mensagem pararia no `mail-outbox.log`. Ele sobe o módulo quando o do servidor está
  diferente do daqui, para ajustar o layout sem um deploy por tentativa.
- **Acesso ao servidor não entra no repositório** (que é público): `.private/hostinger.env`,
  gitignorado, guarda usuário/host/porta/chave — os mesmos valores dos secrets
  `HOSTINGER_SSH_*`. A mesma conta da Hostinger hospeda os dois sites da Maxima.

## Ambientes (detalhes e operação em `DEPLOY.md`)
- **Homologação, com painel:** https://maximaconcrete.igorstutz.online — VPS +
  Cloudflare Tunnel servindo Apache+PHP num container, mesmo ambiente da
  Hostinger. É onde o CMS é usado hoje, e o único lugar onde o login funciona.
- **Produção:** maximaconcrete.com na Hostinger — já recebe cada deploy, mas o
  DNS ainda aponta para a Wix.
- **Preview:** GitHub Pages — estático puro, **sem PHP**: o painel abre e o
  login OAuth nunca completa. Deploy automático desligado em 2026-08-18 (a
  homologação cobre o papel); roda só sob demanda pelo `workflow_dispatch`.
- Push na `main` (inclusive commit feito pelo painel) publica nos dois primeiros
  em ~1-3 min. Este repositório é **público**: nada de endereço de servidor,
  usuário, chave ou credencial em arquivo versionado — só nos secrets.

## Comandos
- `npm run dev` · `npm run build` (export estático em `out/`)
- `npm run projects` — regenera os pinos do mapa a partir de `_extraction/project-map.xlsx`
  (`--dry-run` só relata; `--offline` não chama o Nominatim)
- Dados brutos da extração: `_extraction/` (scripts reexecutáveis; dumps gitignored)

## Idioma
Código/comentários e conteúdo do site em inglês (site americano); comunicação com o usuário em português.
