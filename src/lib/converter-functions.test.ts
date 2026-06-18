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
    expect(json.preview?.type).toBe('table');
    expect(json.preview?.rows).toHaveLength(2);
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

  it('converts text and binary byte groups', () => {
    const binary = convert('textToBinary', 'Hi');
    expect(binary.output).toBe('01001000 01101001');

    const text = convert('binaryToText', binary.output);
    expect(text.output).toBe('Hi');
  });

  it('converts decimal and hexadecimal whole numbers', () => {
    expect(convert('decimalToHex', '255').output).toBe('0xFF');
    expect(convert('hexToDecimal', '0xFF').output).toBe('255');
  });

  it('converts dates, colors and text helpers', () => {
    expect(convert('dateToTimestamp', '2026-06-18T12:00:00Z').output).toContain('Unix seconds');
    expect(convert('hexToRgb', '#4f46e5').output).toContain('rgb(79, 70, 229)');
    const hex = convert('rgbToHex', 'rgb(79, 70, 229)');
    expect(hex.output).toBe('#4f46e5');
    expect(hex.preview?.type).toBe('color');
    expect(convert('rgbToHsl', 'rgb(79, 70, 229)').output).toContain('hsl(');
    expect(convert('hslToRgb', 'hsl(243, 76%, 59%)').output).toContain('rgb(');
    expect(convert('slugGenerator', 'Best JSON Tools!').output).toBe('best-json-tools');
    expect(convert('trimWhitespace', '  one  \n two ').output).toBe('one\ntwo');
    expect(convert('removeEmptyLines', 'one\n\n two ').output).toBe('one\n two ');
  });

  it('applies converter options', () => {
    const formatted = convert('jsonFormatter', '{"name":"Dana"}', { indent: '4' });
    expect(formatted.output).toContain('\n    "name"');
    expect(formatted.preview?.values?.keys).toBe(1);
    expect(convert('sortLines', 'banana\nApple\ncherry', { direction: 'desc', caseSensitive: false }).output).toBe('cherry\nbanana\nApple');
    expect(convert('removeDuplicateLines', 'Apple\napple\n banana \nbanana', { caseSensitive: false, trimLines: true }).output).toBe('Apple\nbanana');
    expect(convert('trimWhitespace', '  one    two  ', { collapseSpaces: true }).output).toBe('one two');
    expect(convert('dateToTimestamp', '2026-06-18T12:00:00Z', { outputUnit: 'seconds' }).output).not.toContain('Milliseconds');
  });

  it('throws useful errors for invalid input', () => {
    expect(() => convert('jsonFormatter', '{bad')).toThrow(/Invalid JSON/i);
    expect(() => convert('csvToJson', '"broken')).toThrow(/Invalid CSV/i);
    expect(() => convert('hexToRgb', '#zzzzzz')).toThrow(/Invalid HEX color/i);
    expect(() => convert('binaryToText', '101')).toThrow(/8-bit/i);
    expect(() => convert('base64Decode', 'abc#')).toThrow(/Invalid Base64/i);
    expect(() => convert('urlDecode', '%E0%A4%A')).toThrow(/Invalid URL encoding/i);
    expect(() => convert('timestampToDate', 'not-a-date')).toThrow(/Invalid timestamp/i);
    expect(() => convert('dateToTimestamp', 'not-a-date')).toThrow(/Invalid date/i);
    expect(() => convert('rgbToHex', 'rgb(999, 0, 0)')).toThrow(/Invalid RGB/i);
    expect(() => convert('hslToRgb', 'hsl(10, 200%, 50%)')).toThrow(/Invalid HSL/i);
    expect(() => convert('jwtDecoder', 'abc.def')).toThrow(/Invalid JWT/i);
  });
});
