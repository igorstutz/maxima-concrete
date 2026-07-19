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

## 3. OAuth do painel (uma vez)

1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App
   - Homepage: `https://maximaconcrete.com`
   - Callback: `https://maximaconcrete.com/api/oauth/callback.php`
2. No servidor Hostinger, criar `public_html/.private/oauth-config.php`:

```php
<?php
return [
    'client_id'     => 'SEU_CLIENT_ID',
    'client_secret' => 'SEU_CLIENT_SECRET',
    'scope'         => 'repo', // 'public_repo' se o repositório for público
];
```

3. Criar também `public_html/.private/.htaccess` com `Require all denied`.

O rsync do deploy **exclui** apenas `/.private/` — os segredos do servidor nunca são
sobrescritos. Os PHPs de `/api/` (submit e oauth) não contêm segredos e são publicados
normalmente a partir do repositório.

## 4. Painel de edição

- URL: `https://maximaconcrete.com/admin/cms/`
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
- `check-coverage.mjs` — confere se todo tipo de seção tem componente.
- `generate-pages.mjs` — regenera as rotas dirigidas por JSON.
- Demais scripts (`dump-*`, `transform-*`, `download-*`) foram usados na migração
  do Supabase/Lovable e não precisam rodar de novo.
