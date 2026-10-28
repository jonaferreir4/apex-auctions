import { describe, it, expect } from 'vitest';
import { formatBRL, formatDateBR, formatTimeRemaining, truncateHash } from './formatters';

describe('formatBRL', () => {
  it('formats positive numbers as BRL currency', () => {
    const formatted = formatBRL(1500);
    expect(formatted).toContain('1.500,00');
  });

  it('formats zero correctly', () => {
    const formatted = formatBRL(0);
    expect(formatted).toContain('0,00');
  });

  it('handles null, undefined, or NaN gracefully', () => {
    expect(formatBRL(null)).toBe('R$ 0,00');
    expect(formatBRL(undefined)).toBe('R$ 0,00');
    expect(formatBRL(NaN)).toBe('R$ 0,00');
  });
});

describe('formatDateBR', () => {
  it('formats ISO dates correctly into Brazilian format', () => {
    const date = new Date('2026-10-25T14:30:00.000Z');
    const formatted = formatDateBR(date);
    expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });

  it('returns a dash for empty dates', () => {
    expect(formatDateBR(null)).toBe('-');
    expect(formatDateBR(undefined)).toBe('-');
  });
});

describe('formatTimeRemaining', () => {
  it('identifies expired lots when end time is in the past', () => {
    const past = new Date(Date.now() - 10000);
    const result = formatTimeRemaining(past);
    expect(result.isExpired).toBe(true);
    expect(result.formatted).toBe('00:00:00');
    expect(result.totalSeconds).toBe(0);
  });

  it('formats active remaining time correctly', () => {
    const future = new Date(Date.now() + 3661 * 1000);
    const result = formatTimeRemaining(future);
    expect(result.isExpired).toBe(false);
    expect(result.totalSeconds).toBeGreaterThan(0);
    expect(result.formatted).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });
});

describe('truncateHash', () => {
  it('truncates 64-char SHA-256 hash to 6 prefix and 6 suffix with ellipsis', () => {
    const hash = 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0';
    const truncated = truncateHash(hash, 6);
    expect(truncated).toBe('a1b2c3...bcdef0');
  });

  it('returns short hashes without modification', () => {
    expect(truncateHash('abc')).toBe('abc');
    expect(truncateHash('')).toBe('');
  });
});
