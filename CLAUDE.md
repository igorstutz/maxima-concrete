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
- **Copiar seção entre páginas:** o Sveltia só duplica dentro do mesmo arquivo, e o
  `config.yml` lista por página apenas os tipos que ela já usa — então o painel sozinho
  não leva uma seção para outra página. A coleção "Copiar seção" grava a escolha em
  `src/content/settings/copy-section.json`; o workflow `copy-section.yml` roda
  `_extraction/apply-copy-section.mjs`, que copia o bloco (key nova, conteúdo junto,
  no fim da página de destino), escreve o resultado no campo `status`, regenera o
  `config.yml` e dispara os deploys. Os deploys ignoram pushes que só mexem nesse
  arquivo de pedido (`paths-ignore`), e o commit do bot não dispara workflow sozinho —
  por isso o `gh workflow run` no fim do copy-section.yml.

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
- Dados brutos da extração: `_extraction/` (scripts reexecutáveis; dumps gitignored)

## Idioma
Código/comentários e conteúdo do site em inglês (site americano); comunicação com o usuário em português.
