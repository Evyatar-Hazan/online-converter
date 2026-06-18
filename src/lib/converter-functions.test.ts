import { describe, expect, it } from 'vitest';
import { convert } from './converter-functions';

describe('converter functions', () => {
  it('converts JSON to CSV and back to JSON', () => {
    const csv = convert('jsonToCsv', '[{"name":"Avi","city":"Jerusalem"},{"name":"Maya","city":"Tel Aviv"}]');
    expect(csv.output).toContain('name,city');
    expect(csv.metadata?.rows).toBe(2);

    const json = convert('csvToJson', csv.output);
    expect(JSON.parse(json.output)).toEqual([
      { name: 'Avi', city: 'Jerusalem' },
      { name: 'Maya', city: 'Tel Aviv' }
    ]);
  });

  it('handles YAML and JSON conversion', () => {
    const yaml = convert('jsonToYaml', '{"app":"converter","enabled":true}');
    expect(yaml.output).toContain('app: converter');

    const json = convert('yamlToJson', yaml.output);
    expect(JSON.parse(json.output)).toEqual({ app: 'converter', enabled: true });
  });

  it('supports Unicode Base64 conversion', () => {
    const encoded = convert('base64Encode', 'Hello שלום');
    expect(encoded.output).toBe('SGVsbG8g16nXnNeV150=');

    const decoded = convert('base64Decode', encoded.output);
    expect(decoded.output).toBe('Hello שלום');
  });

  it('converts dates, colors and text helpers', () => {
    expect(convert('dateToTimestamp', '2026-06-18T12:00:00Z').output).toContain('Unix seconds');
    expect(convert('hexToRgb', '#4f46e5').output).toContain('rgb(79, 70, 229)');
    expect(convert('rgbToHex', 'rgb(79, 70, 229)').output).toBe('#4f46e5');
    expect(convert('slugGenerator', 'Best JSON Tools!').output).toBe('best-json-tools');
  });

  it('throws useful errors for invalid input', () => {
    expect(() => convert('jsonFormatter', '{bad')).toThrow();
    expect(() => convert('csvToJson', '"broken')).toThrow(/unmatched quote/i);
    expect(() => convert('hexToRgb', '#zzzzzz')).toThrow();
  });
});
