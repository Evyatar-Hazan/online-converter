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

  it('extracts CSV columns and changes delimiters', () => {
    const extracted = convert('csvColumnExtractor', 'column=city\nname,city,email\nAvi,Jerusalem,avi@example.com\nMaya,Tel Aviv,maya@example.com');
    expect(extracted.output).toBe('Jerusalem\nTel Aviv');
    expect(extracted.metadata?.column).toBe('city');

    const changed = convert('csvDelimiterChanger', 'name,city,note\nAvi,Jerusalem,"one, two"', { fromDelimiter: ',', toDelimiter: ';' });
    expect(changed.output).toBe('name;city;note\nAvi;Jerusalem;one, two');
    expect(changed.metadata?.to).toBe(';');
  });

  it('sorts CSV rows and generates Markdown tables', () => {
    const sorted = convert('csvListSorter', 'column=city\nname,city\nMaya,Tel Aviv\nAvi,Jerusalem\nNoa,Haifa');
    expect(sorted.output).toBe('name,city\nNoa,Haifa\nAvi,Jerusalem\nMaya,Tel Aviv');
    expect(sorted.metadata?.sortColumn).toBe('city');

    const markdown = convert('csvToMarkdownTable', 'feature,status\nSEO,done\nAds,ready');
    expect(markdown.output).toBe('| feature | status |\n| --- | --- |\n| SEO | done |\n| Ads | ready |');

    const generated = convert('markdownTableGenerator', 'Task,Owner,Status\nSEO,Codex,Done\nAds,Google,Pending');
    expect(generated.output).toContain('| Task | Owner | Status |');
    expect(generated.metadata?.columns).toBe(3);

    const filtered = convert('csvRowFilter', 'column=city\ncontains=Tel\nname,city\nDana,Jerusalem\nMaya,Tel Aviv');
    expect(filtered.output).toBe('name,city\nMaya,Tel Aviv');
    expect(filtered.metadata?.rows).toBe(1);
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

  it('formats JSON Schema and generates basic TypeScript', () => {
    const schema = '{"title":"User","type":"object","required":["name"],"properties":{"name":{"type":"string"},"age":{"type":"integer"},"active":{"type":"boolean"}}}';
    const formatted = convert('jsonSchemaFormatter', schema);
    expect(formatted.output).toContain('"properties"');
    expect(formatted.metadata?.properties).toBe(3);

    const ts = convert('jsonSchemaToTypescript', schema);
    expect(ts.output).toContain('export interface User');
    expect(ts.output).toContain('name: string;');
    expect(ts.output).toContain('age?: number;');
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
    expect(convert('keywordDensityChecker', 'JSON converter tools help teams convert JSON data. JSON tools stay fast.').output).toContain('json: 3');
    expect(convert('canonicalTagChecker', '<html><head><title>Page</title><link rel="canonical" href="https://example.com/page" /></head></html>').output).toContain('Status: good');
    expect(convert('faqSchemaGenerator', 'What does this tool do?\nIt converts JSON to CSV.\n\nIs it local?\nYes, it runs in the browser.').output).toContain('"@type": "FAQPage"');
    expect(convert('metaTagsPreview', 'title=JSON to CSV Converter\ndescription=Convert JSON to CSV online with a browser-based tool that keeps your data local.\nurl=https://example.com/json-to-csv').output).toContain('Google snippet preview');
    expect(convert('htmlHeadingsOutlineExtractor', '<main><h1>Title</h1><h2>Section</h2><h3>Detail</h3></main>').output).toContain('H1: Title');
    expect(convert('textToNatoPhonetic', 'OC 2026').output).toBe('Oscar Charlie / Two Zero Two Six');
    expect(convert('textAlphabetizer', 'zebra\nApple\nbanana\n10 tools\n2 tools').output).toBe('2 tools\n10 tools\nApple\nbanana\nzebra');
    expect(convert('rot13Converter', 'Hello online converter').output).toBe('Uryyb bayvar pbairegre');
    expect(convert('caesarCipher', 'shift=3\nHello online converter').output).toBe('Khoor rqolqh frqyhuwhu');
    expect(convert('wordFrequencyCounter', 'converter tools converter seo text tools converter').output).toContain('converter: 3');
  });

  it('compares text blocks and lists', () => {
    const diff = convert('textDiffChecker', 'one\ntwo\nthree\n---\none\nthree\nfour');
    expect(diff.output).toContain('Added lines: 1');
    expect(diff.output).toContain('+ four');
    expect(diff.output).toContain('- two');

    const list = convert('listDifference', 'json\ncsv\ntext\n---\njson\nimage\ntext');
    expect(list.output).toContain('Only in first list:\ncsv');
    expect(list.output).toContain('Only in second list:\nimage');
    expect(list.metadata?.common).toBe(2);
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
    expect(convert('unitPriceCalculator', '24.90, 6').output).toContain('Unit price: 4.15');
    expect(convert('businessDaysCalculator', '2026-06-01\n2026-06-10').output).toContain('Business days: 8');
    expect(convert('ageCalculator', '1995-04-12\n2026-06-24').output).toContain('Age: 31 years, 2 months, 12 days');
    expect(convert('httpStatusLookup', '404').output).toContain('Name: Not Found');
    expect(convert('loanPaymentCalculator', '100000, 5.5, 10').output).toContain('Payments: 120');
    expect(convert('bmiCalculator', '72, 175').output).toContain('BMI: 23.5');
    expect(convert('tipCalculator', '240, 15, 4').output).toContain('Per person: 69');
    expect(convert('countdownCalculator', '2026-06-24\n2026-12-31').output).toContain('Days remaining: 190');
    expect(convert('salaryCalculator', '18000, 25').output).toContain('Estimated net: 13500');
    expect(convert('compoundInterestCalculator', '10000, 6, 10, 250').output).toContain('Months: 120');
    expect(convert('timeDurationCalculator', '09:30\n17:45').output).toContain('Total minutes: 495');
    const random = convert('randomNumberGenerator', '3, 1, 6').output.split('\n').map(Number);
    expect(random).toHaveLength(3);
    expect(random.every((value) => value >= 1 && value <= 6)).toBe(true);
    expect(convert('colorContrastChecker', '#111827\n#ffffff').output).toContain('WCAG AA normal text: Pass');
    expect(convert('cssGradientGenerator', '#4f46e5\n#14b8a6\n135deg').output).toContain('linear-gradient(135deg');
    expect(convert('hexOpacityConverter', '#4f46e5\n60').output).toContain('#4f46e599');
    expect(convert('colorPaletteGenerator', '#4f46e5').output).toContain('Base: #4f46e5');
    expect(convert('mimeTypeLookup', 'json').output).toContain('MIME type: application/json');
    expect(convert('utmBuilder', 'https://example.com/product\nsource=newsletter\nmedium=email\ncampaign=summer').output).toBe('https://example.com/product?utm_source=newsletter&utm_medium=email&utm_campaign=summer');
    expect(convert('jsonPathExtractor', 'path=$.user.address.city\n{"user":{"name":"Dana","address":{"city":"Jerusalem"}}}').output).toBe('Jerusalem');
    expect(convert('jsonArrayFlattener', '[{"name":"Dana","address":{"city":"Jerusalem"}}]').output).toContain('"address.city": "Jerusalem"');
    expect(convert('rgbOpacityConverter', '79, 70, 229, 60').output).toBe('rgba(79, 70, 229, 0.6)');
    expect(convert('paceCalculator', '10, 0, 52, 30').output).toContain('Pace: 5:15 min/km');
    expect(convert('fuelCostCalculator', '120, 6.8, 7.45').output).toContain('Estimated cost: 60.79');
  });

  it('calculates reading, sentences and UUID validity', () => {
    const reading = convert('readingTimeCalculator', 'שלום עולם. This converter estimates short reading time.');
    expect(reading.output).toContain('Estimated reading time: 1 minute');
    expect(reading.metadata?.words).toBe(8);

    const sentences = convert('sentenceCounter', 'This is one sentence. This is another one! האם זה עובד?');
    expect(sentences.output).toContain('Sentences: 3');

    const uuids = convert('uuidValidator', '550e8400-e29b-41d4-a716-446655440000\nnot-a-uuid');
    expect(uuids.output).toContain('valid v4');
    expect(uuids.output).toContain('not-a-uuid: invalid');
    expect(uuids.metadata?.invalid).toBe(1);
  });

  it('parses user agent strings', () => {
    const parsed = JSON.parse(convert('userAgentParser', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36').output);
    expect(parsed).toMatchObject({
      browser: 'Chrome',
      os: 'macOS',
      device: 'desktop',
      isBot: false
    });
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

  it('supports the eighth demand-focused converter batch', () => {
    const planner = convert('timezoneMeetingPlanner', 'date=2026-07-01\ntime=14:30\nfrom=Asia/Jerusalem\nto=Europe/London,America/New_York');
    expect(planner.output).toContain('Base timezone (Asia/Jerusalem):');
    expect(planner.output).toContain('Europe/London:');
    expect(planner.metadata?.targets).toBe(2);

    const cron = convert('cronExpressionExplainer', '*/15 9-17 * * 1-5');
    expect(cron.output).toContain('Minute: every 15 minute');
    expect(cron.output).toContain('Weekday: weekday range: 1 to 5');

    const dateDiff = convert('dateDifferenceCalculator', '2026-06-01\n2026-06-10');
    expect(dateDiff.output).toContain('Days difference: 9');

    const caseDetector = convert('textCaseDetector', 'customerAccountNumber');
    expect(caseDetector.output).toContain('Detected case: camelCase');

    const headerParser = convert('httpHeaderParser', 'GET /api HTTP/1.1\nHost: example.com\nX-Test: one\nX-Test: two');
    expect(JSON.parse(headerParser.output)).toMatchObject({
      firstLine: 'GET /api HTTP/1.1',
      headers: {
        host: 'example.com',
        'x-test': ['one', 'two']
      }
    });

    const keyCounter = convert('jsonKeyCounter', '{"user":{"name":"Dana","address":{"city":"Jerusalem"}}}');
    expect(keyCounter.output).toContain('Total keys: 4');
    expect(keyCounter.output).toContain('Unique keys: 4');

    const duplicateRows = convert('csvDuplicateRowFinder', 'name,city\nDana,Jerusalem\nDana,Jerusalem\nMaya,Tel Aviv');
    expect(duplicateRows.output).toContain('Dana | Jerusalem => 2');

    const duplicateColumn = convert('csvDuplicateRowFinder', 'column=email\nname,email\nDana,dana@example.com\nAvi,avi@example.com\nNoa,dana@example.com');
    expect(duplicateColumn.output).toContain('dana@example.com: 2');

    const alphaHex = convert('rgbToHexWithAlpha', '79, 70, 229, 60');
    expect(alphaHex.output).toBe('#4f46e599');

    const macros = convert('calorieMacroCalculator', 'calories=2200\nproteinPercent=30\nfatPercent=25\ncarbsPercent=45');
    expect(macros.output).toContain('Protein: 165 g');
    expect(macros.output).toContain('Fat: 61.1 g');

    const mortgage = convert('mortgageAffordabilityCalculator', 'monthlyIncome=18000\nmonthlyDebts=2500\nrate=5.5\nyears=25\nmaxDti=36');
    expect(mortgage.output).toContain('Max monthly payment: 3980');
    expect(mortgage.output).toContain('Assumed payments: 300');
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
    expect(() => convert('textDiffChecker', 'one\ntwo')).toThrow(/two text blocks/i);
    expect(() => convert('listDifference', 'one\ntwo')).toThrow(/two text blocks/i);
    expect(() => convert('csvColumnExtractor', 'column=missing\nname\nAvi')).toThrow(/CSV column not found/i);
    expect(() => convert('csvListSorter', 'column=missing\nname\nAvi')).toThrow(/CSV sort column not found/i);
    expect(() => convert('csvToMarkdownTable', 'name')).toThrow(/Markdown table/i);
    expect(() => convert('markdownTableGenerator', 'name')).toThrow(/Markdown table generator/i);
    expect(() => convert('jsonSchemaFormatter', '[]')).toThrow(/JSON Schema/i);
    expect(() => convert('jsonSchemaToTypescript', '[]')).toThrow(/JSON Schema/i);
    expect(() => convert('percentageChange', '0, 25')).toThrow(/original value cannot be 0/i);
    expect(() => convert('ratioSimplifier', '16, 0')).toThrow(/Invalid ratio/i);
    expect(() => convert('aspectRatioCalculator', '16, 0')).toThrow(/Invalid aspect ratio/i);
    expect(() => convert('ruleOfThreeCalculator', '0, 10, 5')).toThrow(/first value cannot be 0/i);
    expect(() => convert('unitPriceCalculator', '10, 0')).toThrow(/quantity must be greater than 0/i);
    expect(() => convert('loanPaymentCalculator', '100, 5, 0')).toThrow(/loan payment/i);
    expect(() => convert('bmiCalculator', '72, 0')).toThrow(/BMI/i);
    expect(() => convert('tipCalculator', '100, 15, 0')).toThrow(/tip calculation/i);
    expect(() => convert('salaryCalculator', '100, 120')).toThrow(/salary calculation/i);
    expect(() => convert('compoundInterestCalculator', '100, -1, 5')).toThrow(/compound interest/i);
    expect(() => convert('businessDaysCalculator', '2026-06-01')).toThrow(/two dates/i);
    expect(() => convert('ageCalculator', '2026-06-24\n1995-04-12')).toThrow(/birth date/i);
    expect(() => convert('countdownCalculator', '2026-12-31\n2026-06-24')).toThrow(/countdown/i);
    expect(() => convert('httpStatusLookup', '99')).toThrow(/HTTP status code/i);
    expect(() => convert('timeDurationCalculator', '25:00\n10:00')).toThrow(/Invalid time/i);
    expect(() => convert('sitemapUrlCounter', '<urlset>')).toThrow(/Invalid sitemap XML/i);
    expect(() => convert('colorContrastChecker', '#fff')).toThrow(/two colors/i);
    expect(() => convert('cssGradientGenerator', '#fff')).toThrow(/two colors/i);
    expect(() => convert('hexOpacityConverter', '#4f46e5\n120')).toThrow(/Invalid opacity/i);
    expect(() => convert('userAgentParser', '')).toThrow(/user-agent/i);
    expect(() => convert('mimeTypeLookup', 'unknownext')).toThrow(/Unknown MIME/i);
    expect(() => convert('textAlphabetizer', '')).toThrow(/alphabetizer/i);
    expect(() => convert('caesarCipher', 'hello')).toThrow(/Caesar cipher/i);
    expect(() => convert('wordFrequencyCounter', '')).toThrow(/Word frequency/i);
    expect(() => convert('utmBuilder', 'example.com')).toThrow(/Invalid URL/i);
    expect(() => convert('jsonPathExtractor', 'path=$.missing\n{"ok":true}')).toThrow(/JSON path not found/i);
    expect(() => convert('csvRowFilter', 'name,city\nDana,Jerusalem')).toThrow(/CSV row filter/i);
    expect(() => convert('uuidValidator', '')).toThrow(/UUID validator/i);
    expect(() => convert('jwtExpirationChecker', 'abc.def')).toThrow(/Invalid JWT/i);
    expect(() => convert('jwtDecoder', 'abc.def')).toThrow(/Invalid JWT/i);
    expect(() => convert('timezoneMeetingPlanner', 'time=14:30\nfrom=Asia/Jerusalem\nto=Europe/London')).toThrow(/expects date=YYYY-MM-DD/i);
    expect(() => convert('cronExpressionExplainer', '* * *')).toThrow(/expects 5 parts/i);
    expect(() => convert('textCaseDetector', '')).toThrow(/expects text/i);
    expect(() => convert('httpHeaderParser', 'GET / HTTP/1.1\nHost example.com')).toThrow(/Invalid header line/i);
    expect(() => convert('calorieMacroCalculator', 'calories=2000\nproteinPercent=30\nfatPercent=30\ncarbsPercent=30')).toThrow(/add up to 100/i);
    expect(() => convert('mortgageAffordabilityCalculator', 'monthlyIncome=1000\nmonthlyDebts=900\nrate=5\nyears=30\nmaxDti=36')).toThrow(/exceed the selected debt-to-income threshold/i);
  });
});
