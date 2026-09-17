#!/bin/bash
# Manda o e-mail de confirmação de TESTE pela Hostinger, sem sair daqui.
#
#     bash scripts/test-autoreply.sh [destinatário[:Nome] ...]
#
# Exemplos:
#     bash scripts/test-autoreply.sh
#     bash scripts/test-autoreply.sh advertising@melaniesconsulting.com:Igor
#     bash scripts/test-autoreply.sh advertising@melaniesconsulting.com \
#          paul@maximaconcrete.com juliana@melaniesconsulting.com
#
# Sem destinatário, vai para advertising@melaniesconsulting.com.
# O nome depois dos dois-pontos é o "Hi <nome>," da mensagem; sem ele, sai do
# começo do endereço.
#
# Só na Hostinger: é o único ambiente com credencial de envio (Brevo). Na VPS
# de homologação o mail() é falso e a mensagem só apareceria no
# mail-outbox.log, sem sair para lugar nenhum.
#
# Existe para a coisa toda caber numa linha curta: a chamada de ssh que ele
# embrulha é longa o bastante para chegar quebrada quando colada num terminal,
# e meio comando não faz nada de útil.
#
# ATENÇÃO — este repositório é PÚBLICO: endereço, usuário e chave do servidor
# NÃO ficam aqui. Saem de .private/hostinger.env (gitignorado) ou, se preferir
# guardar fora do repositório, de ~/.maxima/hostinger.env. As variáveis de
# ambiente MAXIMA_SSH_USER / MAXIMA_SSH_HOST / MAXIMA_SSH_PORT /
# MAXIMA_SSH_KEY / MAXIMA_SITE_DIR também valem. O arquivo é assim:
#
#     MAXIMA_SSH_USER=uXXXXXXXXX
#     MAXIMA_SSH_HOST=203.0.113.10
#     MAXIMA_SSH_PORT=65002
#     MAXIMA_SSH_KEY=$HOME/.ssh/maxima_deploy_key
#     MAXIMA_SITE_DIR=domains/maximaconcrete.com/public_html
#
# (os mesmos valores dos secrets HOSTINGER_SSH_* do GitHub Actions)

set -u

AQUI="$(cd "$(dirname "$0")/.." && pwd)"
REMOTO="$AQUI/server/test-lead-autoreply.sh"
# O que o teste exercita: o módulo e os dois arquivos de que ele depende. Subir
# só o módulo dava um teste que mentia — foi assim que a primeira mensagem saiu
# como "Maxima Concrete Website": o mailer.php do servidor ainda era anterior ao
# nome de remetente por mensagem.
ARQUIVOS=(lead-autoreply.php mailer.php email-template.php)
# Primeiro o do repositório (gitignorado), depois o de fora dele.
CFG="${MAXIMA_HOSTINGER_ENV:-}"
if [ -z "$CFG" ]; then
    for CANDIDATO in "$AQUI/.private/hostinger.env" "$HOME/.maxima/hostinger.env"; do
        [ -f "$CANDIDATO" ] && { CFG="$CANDIDATO"; break; }
    done
    CFG="${CFG:-$AQUI/.private/hostinger.env}"
fi

SUBIR=1
if [ "${1:-}" = "--no-upload" ]; then
    SUBIR=0
    shift
fi

# shellcheck source=/dev/null
[ -f "$CFG" ] && . "$CFG"

USUARIO="${MAXIMA_SSH_USER:-}"
SERVIDOR="${MAXIMA_SSH_HOST:-}"
PORTA="${MAXIMA_SSH_PORT:-65002}"
CHAVE="${MAXIMA_SSH_KEY:-$HOME/.ssh/maxima_deploy_key}"
PASTA="${MAXIMA_SITE_DIR:-domains/maximaconcrete.com/public_html}"

if [ -z "$USUARIO" ] || [ -z "$SERVIDOR" ]; then
    echo "Faltam os dados de conexão." >&2
    echo "Crie $CFG com MAXIMA_SSH_USER, MAXIMA_SSH_HOST, MAXIMA_SSH_PORT e" >&2
    echo "MAXIMA_SSH_KEY (veja o cabeçalho deste script)." >&2
    exit 1
fi
if [ ! -f "$CHAVE" ]; then
    echo "Chave SSH não encontrada em $CHAVE" >&2
    exit 1
fi
if [ ! -f "$REMOTO" ]; then
    echo "server/test-lead-autoreply.sh não encontrado — rode de dentro do repositório" >&2
    exit 1
fi

ALVO="$USUARIO@$SERVIDOR"
SSH_OPTS=(-i "$CHAVE" -p "$PORTA" -o StrictHostKeyChecking=accept-new -o ConnectTimeout=20)

if [ "$#" -gt 0 ]; then
    echo "Servidor: $ALVO · teste para: $*"
else
    echo "Servidor: $ALVO · teste para o destinatário padrão"
fi

# Sobe os arquivos que estiverem diferentes dos daqui. Serve para ajustar o
# layout do e-mail e ver o resultado na caixa de entrada sem esperar o deploy a
# cada tentativa — o próximo deploy publica de novo a versão do repositório,
# então isto nunca vira uma diferença permanente. A mudança no mailer.php é
# compatível com quem já o usa: o nome do remetente só muda quando a mensagem
# pede um, e o formulário não pede.
if [ "$SUBIR" = "1" ]; then
    # Um acesso só para os três md5 — seria uma conexão por arquivo, se não.
    REMOTOS=$(ssh "${SSH_OPTS[@]}" "$ALVO" \
        "cd ~/$PASTA/api 2>/dev/null && md5sum ${ARQUIVOS[*]} 2>/dev/null")
    for ARQUIVO in "${ARQUIVOS[@]}"; do
        LOCAL="$AQUI/public/api/$ARQUIVO"
        [ -f "$LOCAL" ] || continue
        LOCAL_MD5=$(md5sum "$LOCAL" | cut -d' ' -f1)
        REMOTO_MD5=$(printf '%s\n' "$REMOTOS" | awk -v f="$ARQUIVO" '$2 == f {print $1}')
        if [ "$LOCAL_MD5" != "$REMOTO_MD5" ]; then
            echo "   subindo api/$ARQUIVO (o do servidor está diferente)"
            scp -q -i "$CHAVE" -P "$PORTA" -o StrictHostKeyChecking=accept-new \
                "$LOCAL" "$ALVO:$PASTA/api/$ARQUIVO" || exit 1
        fi
    done
fi
echo

# O script remoto vai por stdin: nada precisa ser copiado para o servidor
# antes, e não sobra arquivo para limpar depois.
#
# O `tr` tira o \r antes de mandar. O .gitattributes já prende os .sh a LF, mas
# este é o tipo de coisa que volta sozinha (um zip, um editor, um clone antigo)
# e o erro que ela dá do outro lado — "$'\r': command not found" — não parece
# com a causa. Dois centavos aqui evitam a caçada.
tr -d '\r' < "$REMOTO" | ssh "${SSH_OPTS[@]}" "$ALVO" bash -s "$PASTA" "$@"
