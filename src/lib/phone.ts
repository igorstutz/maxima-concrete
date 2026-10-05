/**
 * Telefone no padrão americano, "(614) 384-5917". Mesma regra de
 * public/api/phone.php, que repete a formatação no servidor — mudou uma,
 * mude a outra.
 */

/** Só os 10 dígitos do número, sem o 1 do país (o autopreenchimento manda "+1 ..."). */
export function usPhoneDigits(value: string): string {
  let d = (value || "").replace(/\D/g, "");
  // Código de área americano nunca começa com 1: um 1 na frente é o do país.
  if (d.startsWith("1")) d = d.slice(1);
  return d.slice(0, 10);
}

/** Formata enquanto a pessoa digita: "(614", "(614) 384", "(614) 384-5917". */
export function formatUsPhone(value: string): string {
  const d = usPhoneDigits(value);
  if (d.length === 0) return "";
  if (d.length <= 3) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

/** O que o navegador exige antes de enviar: o número completo, já formatado. */
export const US_PHONE_PATTERN = "\\(\\d{3}\\) \\d{3}-\\d{4}";
