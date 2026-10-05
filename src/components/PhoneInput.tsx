"use client";

import type { FormEvent, InputHTMLAttributes } from "react";
import { formatUsPhone, US_PHONE_PATTERN } from "@/lib/phone";

/**
 * Campo de telefone que formata enquanto a pessoa digita: "(614) 384-5917".
 * Continua não controlado (o valor sai do FormData e o form.reset() limpa),
 * só reescreve o próprio texto a cada tecla.
 */
export default function PhoneInput(props: InputHTMLAttributes<HTMLInputElement>) {
  const onInput = (e: FormEvent<HTMLInputElement>) => {
    const el = e.currentTarget;
    const formatted = formatUsPhone(el.value);
    if (formatted === el.value) return;

    // Mantém o cursor depois do mesmo dígito: sem isso, corrigir um número no
    // meio jogaria o cursor para o fim a cada tecla.
    const caret = el.selectionStart ?? el.value.length;
    const digitsBefore = el.value.slice(0, caret).replace(/\D/g, "").length;
    el.value = formatted;
    let pos = 0;
    for (let seen = 0; pos < formatted.length && seen < digitsBefore; pos++) {
      if (/\d/.test(formatted[pos])) seen++;
    }
    el.setSelectionRange(pos, pos);
  };

  return (
    <input
      type="tel"
      inputMode="tel"
      autoComplete="tel-national"
      // Sem maxLength de propósito: colar "+1 (614) 384-5917" seria cortado
      // antes da formatação e perderia dígitos. O limite de 10 já vem dela.
      pattern={US_PHONE_PATTERN}
      title="Please enter a 10-digit phone number, e.g. (614) 384-5917"
      {...props}
      onInput={onInput}
    />
  );
}
