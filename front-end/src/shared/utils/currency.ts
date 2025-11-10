/**
 * Converte centavos para reais (formato de exibição)
 * Exemplo: 500000 -> "R$ 5.000,00"
 */
export function centsToReal(cents: number): string {
  const reais = cents / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(reais);
}

/**
 * Converte centavos para número decimal (para input)
 * Exemplo: 500000 -> 5000.00
 */
export function centsToDecimal(cents: number): number {
  return cents / 100;
}

/**
 * Converte número decimal para centavos
 * Exemplo: 5000.00 -> 500000
 */
export function decimalToCents(decimal: number): number {
  return Math.round(decimal * 100);
}

/**
 * Formata valor monetário em string para número
 * Remove símbolos de moeda, pontos e vírgulas
 * Exemplo: "R$ 5.000,00" -> 5000.00
 */
export function parseCurrencyToNumber(value: string): number {
  const cleaned = value.replace(/[R$\s.]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
}
