import { describe, it, expect } from 'vitest';
import {
  centsToReal,
  centsToDecimal,
  decimalToCents,
  parseCurrencyToNumber,
} from './currency';

describe('Currency Utils', () => {
  describe('centsToReal', () => {
    it('should convert cents to BRL currency format', () => {
      expect(centsToReal(500000)).toBe('R$ 5.000,00');
      expect(centsToReal(10000000)).toBe('R$ 100.000,00');
      expect(centsToReal(0)).toBe('R$ 0,00');
      expect(centsToReal(99)).toBe('R$ 0,99');
    });

    it('should handle negative values', () => {
      expect(centsToReal(-500000)).toBe('-R$ 5.000,00');
    });

    it('should handle large numbers', () => {
      expect(centsToReal(123456789)).toBe('R$ 1.234.567,89');
    });
  });

  describe('centsToDecimal', () => {
    it('should convert cents to decimal', () => {
      expect(centsToDecimal(500000)).toBe(5000);
      expect(centsToDecimal(10000000)).toBe(100000);
      expect(centsToDecimal(0)).toBe(0);
      expect(centsToDecimal(99)).toBe(0.99);
    });

    it('should handle negative values', () => {
      expect(centsToDecimal(-500000)).toBe(-5000);
    });
  });

  describe('decimalToCents', () => {
    it('should convert decimal to cents', () => {
      expect(decimalToCents(5000)).toBe(500000);
      expect(decimalToCents(100000)).toBe(10000000);
      expect(decimalToCents(0)).toBe(0);
      expect(decimalToCents(0.99)).toBe(99);
    });

    it('should round properly', () => {
      expect(decimalToCents(5000.555)).toBe(500056); // Arredonda para cima
      expect(decimalToCents(5000.554)).toBe(500055); // Arredonda para baixo
    });

    it('should handle negative values', () => {
      expect(decimalToCents(-5000)).toBe(-500000);
    });
  });

  describe('parseCurrencyToNumber', () => {
    it('should parse BRL currency string to number', () => {
      expect(parseCurrencyToNumber('R$ 5.000,00')).toBe(5000);
      expect(parseCurrencyToNumber('R$ 100.000,00')).toBe(100000);
      expect(parseCurrencyToNumber('R$ 0,00')).toBe(0);
    });

    it('should handle strings without currency symbol', () => {
      expect(parseCurrencyToNumber('5.000,00')).toBe(5000);
      expect(parseCurrencyToNumber('1.234.567,89')).toBe(1234567.89);
    });

    it('should handle invalid strings', () => {
      expect(parseCurrencyToNumber('')).toBe(0);
      expect(parseCurrencyToNumber('abc')).toBe(0);
    });

    it('should handle strings with spaces', () => {
      expect(parseCurrencyToNumber('R$ 5 000,00')).toBe(5000);
    });
  });
});
