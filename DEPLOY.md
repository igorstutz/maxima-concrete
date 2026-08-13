# Maxima Concrete — Deploy e Configuração

Mesmo modelo do maximapools.com: site estático (Next.js `output: "export"`),
conteúdo em JSON no repositório, painel Sveltia CMS, hospedagem Hostinger.

## 1. Repositório GitHub (uma vez)

```bash
cd maximaconcrete2
git init -b main
git add -A
git commit -m "Site novo Maxima Concrete"
gh repo create igorstutz/maxima-concrete --private --source . --push
```

> Se usar outro nome de repo, ajuste `backend.repo` em `public/admin/cms/config.yml`
> (gerado por `_extraction/generate-cms-config.mjs` — edite o script e regenere).

## 2. Secrets do GitHub Actions (deploy Hostinger)

Em Settings → Secrets and variables → Actions, criar (mesmos nomes e valores do maxima-pools):
`HOSTINGER_SSH_PRIVATE_KEY`, `HOSTINGER_SSH_HOST`, `HOSTINGER_SSH_USER`, `HOSTINGER_SSH_PORT`.

Push na `main` → `.github/workflows/deploy-hostinger.yml` builda e publica (~3 min).
`deploy-pages.yml` publica um preview no GitHub Pages em paralelo.

### Quando o preview do GitHub Pages falha

Sintoma: o job `build` passa, o `deploy` cria o deployment e o GitHub o cancela
poucos segundos depois (`Deployment cancelled`) ou fica em `deployment_queued`
até estourar o timeout. `gh api repos/<owner>/<repo>/pages` devolve
`"status": null`. É um travamento do lado do GitHub, preso ao SHA do commit —
o deploy para a Hostinger (produção) não é afetado e continua publicando.

O que costuma resolver, em ordem:

1. Re-run do workflow (Actions → Deploy preview to GitHub Pages → Re-run).
   Não dispare um run novo enquanto outro está ativo: o Pages aceita um
   deployment por vez e um cancela o outro.
2. Cancelar o deployment preso:
   `gh api -X POST repos/<owner>/<repo>/pages/deployments/<SHA>/cancel`
3. Um commit novo — o deployment usa o SHA como ID, então um SHA diferente
   costuma liberar a fila.

## 2b. Domínio na Hostinger + DNS (uma vez)

O maximaconcrete.com hoje aponta para a Wix. Para o site novo entrar no ar:

1. hPanel → Websites → Add Website → adicionar `maximaconcrete.com` ao plano
   (cria `domains/maximaconcrete.com/public_html/`, alvo do deploy).
2. Rodar o deploy (push na main ou re-run do workflow) para popular a pasta.
3. Onde o DNS do domínio é gerenciado (Wix/registrador): apontar `A` de `@` e
   `www` para o IP do servidor Hostinger (visível no hPanel), ou migrar os
   nameservers para a Hostinger.
4. hPanel → SSL → instalar Let's Encrypt para `maximaconcrete.com` e `www`.
5. SPF do e-mail: garantir `include:_spf.mail.hostinger.com` no registro SPF.

## 2c. Homologação com painel: VPS + Cloudflare Tunnel

`https://maximaconcrete.igorstutz.online` — ambiente onde o CMS pode ser usado
enquanto o domínio real ainda aponta para a Wix. O GitHub Pages continua
existindo como preview, mas **o painel não funciona lá** (Pages não executa PHP,
e o login OAuth depende de `api/oauth/*.php`).

Como está montado na VPS (`187.77.251.75`):

- `/opt/maximaconcrete/` — `Dockerfile` (php:8.3-apache com rewrite/headers/
  expires/deflate/remoteip e `AllowOverride All`) + `docker-compose.yml`.
  Container `maximaconcrete-web` escutando em `127.0.0.1:8090` (nada exposto
  na internet diretamente).
- `/opt/maximaconcrete/site/` — docroot, alvo do rsync. Dono: `maximadeploy`.
- `/opt/maximaconcrete/site/.private/` — volume separado (uid 33/www-data) com
  `oauth-config.php`, `submissions.log` e `mail-outbox.log`. O rsync exclui
  `/.private/`. Aqui a pasta fica **dentro** do docroot, então o Apache do
  container nega `/.private` explicitamente (`Require all denied`) — sem isso
  os leads ficariam públicos.
- Túnel `maxima` (`cloudflared-maxima.service`) → `maximaconcrete.igorstutz.online`.
  HTTPS é do Cloudflare; não há porta 80/443 aberta na VPS.
- `X-Robots-Tag: noindex, nofollow` em todo o host (conf do Apache) — homologação
  não pode ser indexada e competir com o site real.
- Deploy: `.github/workflows/deploy-vps.yml`, secrets `VPS_SSH_PRIVATE_KEY`,
  `VPS_SSH_HOST`, `VPS_SSH_USER` (usuário sem sudo, só escreve no docroot).
- `_extraction/set-cms-host.mjs` reescreve `base_url`/`site_url` do config.yml
  no build da homologação — o arquivo do repositório segue apontando para
  produção.

Operação: `docker compose {ps,restart,logs}` em `/opt/maximaconcrete`,
`systemctl {status,restart} cloudflared-maxima`.

> `mail()` não funciona na VPS (não há MTA). Em vez de o formulário falhar, o
> `sendmail_path` aponta para `fake-sendmail`, que grava o e-mail que seria
> enviado em `/.private/mail-outbox.log` — o site responde sucesso e dá para
> conferir destinatário, assunto e corpo. Cada envio também entra em
> `/.private/submissions.log`. O envio real só é testável na Hostinger.

## 3. OAuth do painel (uma vez por host)

Um OAuth App do GitHub aceita **uma** callback URL, então produção e homologação
precisam de um App cada. `public/api/oauth/redirect-uri.php` escolhe o
`redirect_uri` pelo host da requisição (com whitelist).

1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
   - Produção — Homepage: `https://maximaconcrete.com`,
     Callback: `https://maximaconcrete.com/api/oauth/callback.php`
   - Homologação — Homepage: `https://maximaconcrete.igorstutz.online`,
     Callback: `https://maximaconcrete.igorstutz.online/api/oauth/callback.php`
2. No servidor (Hostinger `public_html/.private/` ou VPS
   `/opt/maximaconcrete/site/.private/`), criar `oauth-config.php`:

```php
<?php
return [
    'client_id'     => 'SEU_CLIENT_ID',
    'client_secret' => 'SEU_CLIENT_SECRET',
    'scope'         => 'repo', // 'public_repo' se o repositório for público
];
```

3. Na Hostinger, criar também `public_html/.private/.htaccess` com
   `Require all denied` — **obrigatório**: a pasta fica dentro do docroot e sem
   isso `submissions.log` (leads) fica acessível pela web. Na VPS o bloqueio já
   está na configuração do Apache do container.

O rsync do deploy **exclui** apenas `/.private/` — os segredos do servidor nunca são
sobrescritos. Os PHPs de `/api/` (submit e oauth) não contêm segredos e são publicados
normalmente a partir do repositório.

## 4. Painel de edição

- URL: `https://maximaconcrete.com/admin/cms/`
  (homologação: `https://maximaconcrete.igorstutz.online/admin/cms/`)
- Login com a conta GitHub que tem acesso ao repositório.
- Salvar = commit na `main` = rebuild + publicação automática (~3 min).
- Media library = `public/images` (upload pelo painel vira commit).

## 5. Formulário de contato

`public/api/submit.php` envia para `info@maximaconcrete.com` via `mail()` da
Hostinger e grava cada envio em `/.private/submissions.log`.
Requisito de DNS: incluir `include:_spf.mail.hostinger.com` no SPF do domínio.

## 6. Comandos locais

```bash
npm run dev    # desenvolvimento (http://localhost:3000)
npm run build  # export estático em out/
```

## 7. Scripts de manutenção (`_extraction/`)

- `generate-cms-config.mjs` — regenera o config.yml do painel a partir dos JSONs
  (rodar sempre que a estrutura de `src/content` mudar).
- `generate-image-variants.mjs` — gera as versões 480/828/1280px das fotos e o
  manifesto `src/lib/image-variants.json`. **Roda sozinho no `npm run build`**
  (script `prebuild`), inclusive no GitHub Actions. As variantes são derivadas e
  estão no `.gitignore`; só o manifesto é versionado. Sem `--apply` ele apenas
  simula (`npm run images`). Ao subir fotos novas pelo painel, o próximo build
  gera as variantes delas automaticamente.
- `images-to-webp.mjs` — converte JPG/PNG novos para WebP e atualiza as
  referências. Não toca em `public/images/og/**` (previews de compartilhamento
  precisam ser JPG) nem nos ícones da raiz de `public/`.
- `check-coverage.mjs` — confere se todo tipo de seção tem componente.
- `generate-pages.mjs` — regenera as rotas dirigidas por JSON.
- Demais scripts (`dump-*`, `transform-*`, `download-*`) foram usados na migração
  do Supabase/Lovable e não precisam rodar de novo.
