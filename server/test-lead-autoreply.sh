#!/bin/bash
# Roda NA HOSTINGER — chega por stdin, mandado pelo scripts/test-autoreply.sh.
# Não é para ser executado à mão aqui do repositório.
#
#     bash test-lead-autoreply.sh <pasta-do-site> [destinatário[:Nome] ...]
#
# Ao contrário do maxima-pools, aqui não há nada para instalar: o
# lead-autoreply.php chega pelo deploy junto com o resto do site, e as
# credenciais de envio (Brevo) já são as mesmas que o formulário usa. Então
# este script só confere o terreno e manda a mensagem de teste.

set -u

SITE="${1:-domains/maximaconcrete.com/public_html}"
shift || true

cd ~/"$SITE" 2>/dev/null || { echo "!! não encontrei ~/$SITE"; exit 1; }

if [ "$#" -gt 0 ]; then
    RECIPIENTS=("$@")
else
    RECIPIENTS=("advertising@melaniesconsulting.com:Igor")
fi

# "paul@maximaconcrete.com" -> "Paul", para o teste chegar como chegaria a um
# cliente, e não endereçado a quem pediu o teste. O nome pode vir junto do
# endereço ("fulano@exemplo.com:Igor") quando o apelido da caixa não serve.
name_for() {
    local local_part="${1%@*}"
    local first="${local_part%%[._+-]*}"
    local head
    head=$(printf '%s' "${first:0:1}" | tr '[:lower:]' '[:upper:]')
    printf '%s%s' "$head" "${first:1}"
}

echo "== 1. Módulo no servidor =="
if [ -f api/lead-autoreply.php ]; then
    echo "   api/lead-autoreply.php presente ($(date -r api/lead-autoreply.php '+%d/%m %H:%M'))"
else
    echo "   FALTANDO — espere o deploy do GitHub Actions terminar e rode de novo"
    exit 1
fi
if php -l api/lead-autoreply.php > /dev/null 2>&1; then
    echo "   sintaxe OK (PHP $(php -r 'echo PHP_VERSION;'))"
else
    echo "   ERRO DE SINTAXE no servidor:"
    php -l api/lead-autoreply.php
    exit 1
fi

echo "== 2. Credenciais de envio =="
# Só a existência do arquivo, nunca o conteúdo: a chave não aparece em log
# nenhum, e aqui a saída vai parar na conversa.
if [ -f .private/mailer.php ] || [ -f .private/resend.php ]; then
    echo "   .private/mailer.php presente — sai autenticado (DKIM do domínio)"
    # O nome de remetente por mensagem é recente: sem ele a confirmação sai como
    # "Maxima Concrete Website", que é o nome dos avisos internos.
    if grep -q "from_name" api/mailer.php 2>/dev/null; then
        echo "   mailer.php aceita o nome de remetente por mensagem"
    else
        echo "   AVISO: mailer.php antigo — vai sair como 'Maxima Concrete Website'"
    fi
else
    echo "   AVISO: sem .private/mailer.php. A mensagem ainda vai, pelo mail() da"
    echo "   Hostinger, mas sem assinatura do domínio — quase certamente em spam."
fi

echo "== 3. Ligado ao formulário? =="
if grep -q "lead-autoreply.php" api/submit.php 2>/dev/null; then
    echo "   sim: todo lead enviado pelo site recebe a confirmação"
else
    echo "   AINDA NÃO: o submit.php do servidor é anterior a esta mudança."
    echo "   O teste abaixo funciona mesmo assim; o envio automático começa no"
    echo "   próximo deploy."
fi

echo
echo "== 4. Envio de teste =="
cd api || exit 1
for ENTRY in "${RECIPIENTS[@]}"; do
    TO="${ENTRY%%:*}"
    NAME="${ENTRY#*:}"
    [ "$NAME" = "$ENTRY" ] && NAME="$(name_for "$TO")"
    php lead-autoreply.php test "$TO" "$NAME"
done

echo
echo "== log =="
tail -n "${#RECIPIENTS[@]}" ../.private/lead-autoreply.log 2>/dev/null
