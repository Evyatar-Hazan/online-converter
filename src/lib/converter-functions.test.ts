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

  it('converts CSV and TSV formats', () => {
    const tsv = convert('csvToTsv', 'name,city\nAvi,Jerusalem\nMaya,Tel Aviv');
    expect(tsv.output).toBe('name\tcity\nAvi\tJerusalem\nMaya\tTel Aviv');
    expect(tsv.metadata?.rows).toBe(3);

    const csv = convert('tsvToCsv', 'name\tcity\nAvi\tJerusalem\nMaya\tTel Aviv');
    expect(csv.output).toBe('name,city\nAvi,Jerusalem\nMaya,Tel Aviv');
    expect(csv.metadata?.columns).toBe(2);
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

  it('converts text and Morse code', () => {
    expect(convert('textToMorse', 'SOS 2026').output).toBe('... --- ... / ..--- ----- ..--- -....');
    expect(convert('morseToText', '.... . .-.. .-.. --- / ..--- ----- ..--- -....').output).toBe('hello 2026');
  });

  it('converts decimal and hexadecimal whole numbers', () => {
    expect(convert('decimalToHex', '255').output).toBe('0xFF');
    expect(convert('hexToDecimal', '0xFF').output).toBe('255');
    const bases = convert('numberBaseConverter', '0b11111111');
    expect(bases.output).toContain('Decimal: 255');
    expect(bases.output).toContain('Hex: 0xFF');
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

    const parsed = convert('urlParser', 'https://example.com/search?q=online+converter&tag=json&tag=csv#results');
    expect(JSON.parse(parsed.output)).toMatchObject({
      protocol: 'https',
      hostname: 'example.com',
      pathname: '/search',
      query: { q: 'online converter', tag: ['json', 'csv'] },
      hash: 'results'
    });
    expect(parsed.preview?.type).toBe('json');
  });

  it('checks robots.txt and sitemap XML', () => {
    const robots = convert('robotsTxtTester', 'User-agent: *\nDisallow: /private\nSitemap: https://example.com/sitemap.xml');
    expect(robots.output).toContain('User-agent directives: 1');
    expect(robots.metadata?.sitemaps).toBe(1);

    const sitemap = convert('sitemapUrlCounter', '<urlset><url><loc>https://example.com/</loc></url><url><loc>https://example.com/tools/</loc></url></urlset>');
    expect(sitemap.output).toContain('URLs: 2');
    expect(sitemap.metadata?.uniqueUrls).toBe(2);
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
    expect(convert('removeCharacters', 'aeiou\nBeautiful converter text').output).toBe('Btfl cnvrtr txt');
    expect(convert('prefixSuffixLines', 'prefix=<li>\nsuffix=</li>\nJSON\nCSV').output).toBe('<li>JSON</li>\n<li>CSV</li>');
    const replaced = convert('findReplaceText', 'find=old\nreplace=new\nold converter, old tool');
    expect(replaced.output).toBe('new converter, new tool');
    expect(replaced.metadata?.replacements).toBe(2);
    expect(convert('addLineNumbers', 'Write draft\nReview copy').output).toBe('1. Write draft\n2. Review copy');
    expect(convert('removeLineNumbers', '01. Write draft\n02. Review copy').output).toBe('Write draft\nReview copy');
    expect(convert('metaTitleLengthChecker', 'JSON to CSV Converter - Free Online Tool').output).toContain('Status: good');
    expect(convert('metaDescriptionLengthChecker', 'Convert JSON to CSV online for free. Fast browser-only conversion with copy, download, examples and bilingual Hebrew and English UI.').output).toContain('Status: good');
  });

  it('calculates percentages, discounts, averages and ratios', () => {
    expect(convert('percentageOf', '20, 150').output).toContain('20% of 150 = 30');
    expect(convert('percentageChange', '100, 125').output).toContain('Change: 25%');
    expect(convert('discountCalculator', '200, 25').output).toContain('Final price: 150');
    expect(convert('vatCalculator', '100, 17').output).toContain('Total: 117');
    expect(convert('averageCalculator', '82, 91, 77, 88, 95').output).toContain('Average: 86.6');
    expect(convert('ratioSimplifier', '1920:1080').output).toContain('Simplified ratio: 16:9');
    expect(convert('aspectRatioCalculator', '1920, 1080').output).toContain('Aspect ratio: 16:9');
    expect(convert('ruleOfThreeCalculator', '2, 10, 5').output).toContain('X = 25');
    const random = convert('randomNumberGenerator', '3, 1, 6').output.split('\n').map(Number);
    expect(random).toHaveLength(3);
    expect(random.every((value) => value >= 1 && value <= 6)).toBe(true);
    expect(convert('colorContrastChecker', '#111827\n#ffffff').output).toContain('WCAG AA normal text: Pass');
  });

  it('checks JWT expiration without verifying signatures', () => {
    const checked = convert('jwtExpirationChecker', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiRGFuYSIsImV4cCI6MTg5MzQ1NjAwMH0.signature');
    expect(checked.output).toContain('Unix exp: 1893456000');
    expect(checked.warnings?.[0]).toMatch(/does not verify/i);
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
    expect(() => convert('numberBaseConverter', '12.5')).toThrow(/Invalid number/i);
    expect(() => convert('morseToText', '')).toThrow(/Invalid Morse/i);
    expect(() => convert('urlParser', 'example.com/no-protocol')).toThrow(/Invalid URL/i);
    expect(() => convert('removeCharacters', 'abc')).toThrow(/Character remover/i);
    expect(() => convert('prefixSuffixLines', 'prefix=-')).toThrow(/Prefix\/suffix/i);
    expect(() => convert('findReplaceText', 'find=\nreplace=x\ntext')).toThrow(/Find and replace/i);
    expect(() => convert('percentageChange', '0, 25')).toThrow(/original value cannot be 0/i);
    expect(() => convert('ratioSimplifier', '16, 0')).toThrow(/Invalid ratio/i);
    expect(() => convert('aspectRatioCalculator', '16, 0')).toThrow(/Invalid aspect ratio/i);
    expect(() => convert('ruleOfThreeCalculator', '0, 10, 5')).toThrow(/first value cannot be 0/i);
    expect(() => convert('sitemapUrlCounter', '<urlset>')).toThrow(/Invalid sitemap XML/i);
    expect(() => convert('colorContrastChecker', '#fff')).toThrow(/two colors/i);
    expect(() => convert('jwtExpirationChecker', 'abc.def')).toThrow(/Invalid JWT/i);
    expect(() => convert('jwtDecoder', 'abc.def')).toThrow(/Invalid JWT/i);
  });
});
