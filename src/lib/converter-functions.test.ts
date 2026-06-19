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
    expect(convert('hexToHsl', '#4f46e5').output).toContain('hsl(243, 75%, 59%)');
    expect(convert('hslToHex', 'hsl(0, 100%, 50%)').output).toBe('#ff0000');
    const hex = convert('rgbToHex', 'rgb(79, 70, 229)');
    expect(hex.output).toBe('#4f46e5');
    expect(hex.preview?.type).toBe('color');
    expect(convert('rgbToHsl', 'rgb(79, 70, 229)').output).toContain('hsl(');
    expect(convert('hslToRgb', 'hsl(243, 76%, 59%)').output).toContain('rgb(');
    expect(convert('rgbToCmyk', 'rgb(79, 70, 229)').output).toContain('cmyk(66%, 69%, 0%, 10%)');
    expect(convert('cmykToRgb', '66, 69, 0, 10').output).toContain('rgb(78, 71, 230)');
    expect(convert('slugGenerator', 'Best JSON Tools!').output).toBe('best-json-tools');
    expect(convert('trimWhitespace', '  one  \n two ').output).toBe('one\ntwo');
    expect(convert('removeEmptyLines', 'one\n\n two ').output).toBe('one\n two ');
  });

  it('converts query strings and JSON URL parameters', () => {
    const json = convert('queryStringToJson', 'https://example.com/search?q=online+converter&tag=json&tag=csv');
    expect(JSON.parse(json.output)).toEqual({ q: 'online converter', tag: ['json', 'csv'] });
    expect(json.preview?.type).toBe('json');

    const query = convert('jsonToQueryString', '{"q":"online converter","tag":["json","csv"]}');
    expect(query.output).toBe('q=online+converter&tag=json&tag=csv');
    expect(query.metadata?.parameters).toBe(3);
  });

  it('converts JSON, JSONL and developer string helpers', () => {
    const jsonl = convert('jsonToJsonLines', '[{"event":"signup"},{"event":"purchase"}]');
    expect(jsonl.output).toBe('{"event":"signup"}\n{"event":"purchase"}');
    expect(jsonl.metadata?.rows).toBe(2);

    const json = convert('jsonLinesToJson', jsonl.output);
    expect(JSON.parse(json.output)).toEqual([{ event: 'signup' }, { event: 'purchase' }]);
    expect(json.preview?.values?.items).toBe(2);

    expect(convert('regexEscape', 'price is $19.99 (sale)').output).toBe('price is \\$19\\.99 \\(sale\\)');
    const escaped = convert('textToUnicodeEscape', 'שלום 👋');
    expect(escaped.output).toContain('\\u05e9');
    expect(convert('unicodeEscapeToText', escaped.output).output).toBe('שלום 👋');

    const uuids = convert('uuidGenerator', '2').output.split('\n');
    expect(uuids).toHaveLength(2);
    expect(uuids[0]).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it('converts text into SEO and editor helper formats', () => {
    expect(convert('textToCamelCase', 'user profile image').output).toBe('userProfileImage');
    expect(convert('textToSnakeCase', 'Customer Account Number').output).toBe('customer_account_number');
    expect(convert('textToKebabCase', 'Best Online Converter Tools').output).toBe('best-online-converter-tools');
    expect(convert('removePunctuation', 'שלום, עולם! SEO tools & converters.').output).toBe('שלום עולם SEO tools converters');
    expect(convert('addLineNumbers', 'Write draft\nReview copy').output).toBe('1. Write draft\n2. Review copy');
    expect(convert('removeLineNumbers', '01. Write draft\n02. Review copy').output).toBe('Write draft\nReview copy');
  });

  it('applies converter options', () => {
    const formatted = convert('jsonFormatter', '{"name":"Dana"}', { indent: '4' });
    expect(formatted.output).toContain('\n    "name"');
    expect(formatted.preview?.values?.keys).toBe(1);
    expect(convert('jsonToCsv', '[{"name":"Avi","city":"Jerusalem"}]', { delimiter: ';' }).output).toContain('name;city');
    expect(JSON.parse(convert('csvToJson', 'name; city\nAvi; Jerusalem', { delimiter: ';', trimValues: true }).output)).toEqual([{ name: 'Avi', city: 'Jerusalem' }]);
    expect(convert('base64Encode', '???>', { urlSafe: true, omitPadding: true }).output).not.toMatch(/[+/=]/);
    expect(convert('base64Decode', 'Pz8_Pg', { urlSafe: true }).output).toBe('???>');
    expect(convert('urlEncode', 'hello world', { spaceAsPlus: true }).output).toBe('hello+world');
    expect(convert('urlDecode', 'hello+world', { plusAsSpace: true }).output).toBe('hello world');
    expect(convert('rgbToHex', 'rgb(79, 70, 229)', { hexCase: 'upper', includeHash: false }).output).toBe('4F46E5');
    expect(convert('hslToHex', 'hsl(0, 100%, 50%)', { hexCase: 'upper', includeHash: false }).output).toBe('FF0000');
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
    expect(() => convert('cmykToRgb', '10, 200, 0, 0')).toThrow(/Invalid CMYK/i);
    expect(() => convert('jsonToQueryString', '["not","object"]')).toThrow(/query string output/i);
    expect(() => convert('jsonLinesToJson', '{"ok":true}\n{bad')).toThrow(/line 2/i);
    expect(() => convert('unicodeEscapeToText', '\\u12')).toThrow(/Invalid Unicode escape/i);
    expect(() => convert('uuidGenerator', '0')).toThrow(/Invalid UUID count/i);
    expect(() => convert('jwtDecoder', 'abc.def')).toThrow(/Invalid JWT/i);
  });
});
