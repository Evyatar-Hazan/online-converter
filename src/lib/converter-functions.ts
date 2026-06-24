import { parse, stringify } from 'yaml';
import type { ConvertPreview, ConverterOptions, ConvertResult } from '../types';

type JsonObject = Record<string, unknown>;
type ConverterFunction = (input: string, options: ConverterOptions) => ConvertResult;

function result(output: string, metadata?: Record<string, string | number>, warnings?: string[], preview?: ConvertPreview): ConvertResult {
  return { output, metadata, warnings, preview };
}

function parseJson(input: string): unknown {
  try {
    return JSON.parse(input);
  } catch (caught) {
    const message = caught instanceof Error ? caught.message : 'Invalid JSON.';
    throw new Error(`Invalid JSON: ${message}. Check for missing quotes, trailing commas or unclosed brackets.`);
  }
}

function selectOption(options: ConverterOptions, key: string, fallback: string): string {
  const value = options[key];
  return typeof value === 'string' ? value : fallback;
}

function booleanOption(options: ConverterOptions, key: string, fallback: boolean): boolean {
  const value = options[key];
  return typeof value === 'boolean' ? value : fallback;
}

function numberOption(options: ConverterOptions, key: string, fallback: number): number {
  const value = Number(options[key]);
  return Number.isFinite(value) ? value : fallback;
}

function formatNumber(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return '0';
  return value.toFixed(digits).replace(/\.?0+$/g, '');
}

function parseNumericValues(input: string, minimum: number, label: string): number[] {
  const values = input.match(/-?\d+(?:\.\d+)?/g)?.map((value) => Number(value)) ?? [];
  if (values.length < minimum || values.some((value) => !Number.isFinite(value))) {
    throw new Error(`Invalid ${label}: enter at least ${minimum} numeric value${minimum === 1 ? '' : 's'}.`);
  }
  return values;
}

function calculatorOutput(lines: string[], metadata?: Record<string, string | number>): ConvertResult {
  return result(lines.join('\n'), metadata);
}

function integerGcd(left: number, right: number): number {
  let a = Math.abs(Math.round(left));
  let b = Math.abs(Math.round(right));
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

function countStats(input: string): Record<string, number> {
  const lines = input ? input.split(/\r\n|\r|\n/).length : 0;
  const words = input.trim() ? input.trim().split(/\s+/).filter(Boolean).length : 0;
  return {
    characters: input.length,
    lines,
    words
  };
}

function jsonPreview(value: unknown): ConvertPreview {
  if (Array.isArray(value)) {
    return {
      type: 'json',
      title: 'JSON array',
      values: {
        items: value.length,
        firstItemType: value.length ? Array.isArray(value[0]) ? 'array' : typeof value[0] : 'empty'
      }
    };
  }

  if (value && typeof value === 'object') {
    const keys = Object.keys(value as JsonObject);
    return {
      type: 'json',
      title: 'JSON object',
      values: {
        keys: keys.length,
        topLevelKeys: keys.slice(0, 6).join(', ') || 'none'
      }
    };
  }

  return {
    type: 'json',
    title: 'JSON value',
    values: { valueType: value === null ? 'null' : typeof value }
  };
}

function colorPreview(format: string, cssColor: string, values: Record<string, string | number>): ConvertPreview {
  return {
    type: 'color',
    title: format,
    values: {
      css: cssColor,
      ...values
    }
  };
}

function escapeXml(value: unknown): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function jsonToXmlValue(value: unknown, level: number): string {
  const indent = '  '.repeat(level);
  const nextLevel = level + 1;

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (item === null || typeof item !== 'object') {
          return `${indent}<item>${escapeXml(item ?? '')}</item>`;
        }
        return `${indent}<item>\n${jsonToXmlValue(item, nextLevel)}\n${indent}</item>`;
      })
      .join('\n');
  }

  if (value && typeof value === 'object') {
    return Object.entries(value as JsonObject)
      .map(([key, child]) => {
        if (child === null || typeof child !== 'object') {
          return `${indent}<${key}>${escapeXml(child ?? '')}</${key}>`;
        }
        const inner = jsonToXmlValue(child, nextLevel);
        return `${indent}<${key}>\n${inner}\n${indent}</${key}>`;
      })
      .join('\n');
  }

  return `${indent}${escapeXml(value ?? '')}`;
}

function csvRows(input: string, delimiter = ','): string[][] {
  const normalized = input.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  if (!normalized) return [];

  const rows: string[][] = [];
  let current = '';
  let currentRow: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < normalized.length; i += 1) {
    const char = normalized[i];
    const next = normalized[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      currentRow.push(current);
      current = '';
    } else if (char === '\n' && !inQuotes) {
      currentRow.push(current);
      rows.push(currentRow);
      currentRow = [];
      current = '';
    } else {
      current += char;
    }
  }

  if (inQuotes) {
    throw new Error('Invalid CSV: one quoted value is not closed. Close the quote or escape inner quotes by doubling them.');
  }

  currentRow.push(current);
  rows.push(currentRow);
  return rows;
}

function csvCell(value: string): string {
  return /[",\n\r]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

function delimitedCell(value: string, delimiter: string): string {
  return value.includes('"') || value.includes('\n') || value.includes('\r') || value.includes(delimiter)
    ? `"${value.replace(/"/g, '""')}"`
    : value;
}

function tsvCell(value: string): string {
  return value.replace(/\t/g, ' ').replace(/\r?\n|\r/g, ' ');
}

function parseTsvRows(input: string): string[][] {
  const normalized = input.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  if (!normalized) return [];
  return normalized.split('\n').map((line) => line.split('\t'));
}

function encodeBase64(input: string): string {
  return btoa(String.fromCharCode(...new TextEncoder().encode(input)));
}

function toUrlSafeBase64(input: string, omitPadding: boolean): string {
  const output = input.replace(/\+/g, '-').replace(/\//g, '_');
  return omitPadding ? output.replace(/=+$/g, '') : output;
}

function normalizeBase64(input: string, urlSafe: boolean): string {
  const normalized = input.trim().replace(/\s+/g, '');
  const standard = urlSafe ? normalized.replace(/-/g, '+').replace(/_/g, '/') : normalized;
  return standard.padEnd(Math.ceil(standard.length / 4) * 4, '=');
}

function decodeBase64(input: string, urlSafe = false): string {
  const normalized = normalizeBase64(input, urlSafe);
  if (!normalized) {
    throw new Error('Invalid Base64: paste an encoded value before decoding.');
  }
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(normalized) || normalized.length % 4 === 1) {
    throw new Error('Invalid Base64: use only Base64 characters and correct padding.');
  }

  try {
    const binary = atob(normalized);
    return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
  } catch {
    throw new Error('Invalid Base64: the value could not be decoded. Check padding and copied characters.');
  }
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function unescapeHtml(input: string): string {
  return input
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

function titleCase(input: string): string {
  return input.toLowerCase().replace(/\b[\p{L}\p{N}]/gu, (match) => match.toUpperCase());
}

function sentenceCase(input: string): string {
  const lower = input.toLowerCase();
  return lower.replace(/(^\s*\p{L}|[.!?]\s+\p{L})/gu, (match) => match.toUpperCase());
}

function textWords(input: string): string[] {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .match(/[\p{L}\p{N}]+/gu) ?? [];
}

function pascalPart(word: string): string {
  const lower = word.toLocaleLowerCase();
  return lower.charAt(0).toLocaleUpperCase() + lower.slice(1);
}

function camelCase(input: string): string {
  const words = textWords(input);
  return words.map((word, index) => {
    const lower = word.toLocaleLowerCase();
    return index === 0 ? lower : pascalPart(word);
  }).join('');
}

function snakeCase(input: string): string {
  return textWords(input).map((word) => word.toLocaleLowerCase()).join('_');
}

function kebabCase(input: string): string {
  return textWords(input).map((word) => word.toLocaleLowerCase()).join('-');
}

function parseRgb(input: string): [number, number, number] {
  const matches = input.match(/\d+(\.\d+)?/g);
  if (!matches || matches.length < 3) {
    throw new Error('Invalid RGB: enter three values like rgb(79, 70, 229) or 79, 70, 229.');
  }
  const values = matches.slice(0, 3).map((value) => Number(value));
  if (values.some((value) => Number.isNaN(value) || value < 0 || value > 255)) {
    throw new Error('Invalid RGB: each value must be a number between 0 and 255.');
  }
  return values.map((value) => Math.round(value)) as [number, number, number];
}

function parseHex(input: string): [number, number, number] {
  const hex = input.trim().replace(/^#/, '');
  const normalized = hex.length === 3 ? hex.split('').map((char) => char + char).join('') : hex;
  if (!/^[0-9a-f]{6}$/i.test(normalized)) {
    throw new Error('Invalid HEX color: use #RGB or #RRGGBB, for example #4f46e5.');
  }
  return [
    parseInt(normalized.slice(0, 2), 16),
    parseInt(normalized.slice(2, 4), 16),
    parseInt(normalized.slice(4, 6), 16)
  ];
}

function parseColorLine(input: string): [number, number, number] {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error('Invalid color: enter a HEX or RGB color.');
  }
  return trimmed.startsWith('#') || /^[0-9a-f]{3}([0-9a-f]{3})?$/i.test(trimmed)
    ? parseHex(trimmed)
    : parseRgb(trimmed);
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const channels = [r, g, b].map((value) => {
    const channel = value / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return (0.2126 * channels[0]) + (0.7152 * channels[1]) + (0.0722 * channels[2]);
}

function contrastRatio(left: [number, number, number], right: [number, number, number]): number {
  const a = relativeLuminance(left);
  const b = relativeLuminance(right);
  const light = Math.max(a, b);
  const dark = Math.min(a, b);
  return (light + 0.05) / (dark + 0.05);
}

function parseIntegerInput(input: string, base: 10 | 16): bigint {
  const normalized = input.trim().replace(/^0x/i, '');
  const pattern = base === 16 ? /^[0-9a-f]+$/i : /^[+-]?\d+$/;
  if (!pattern.test(normalized)) {
    throw new Error(base === 16 ? 'Invalid HEX number: use hexadecimal digits 0-9 and A-F.' : 'Invalid decimal number: use a whole number without commas or spaces.');
  }
  return base === 16 ? BigInt(`0x${normalized}`) : BigInt(normalized);
}

function rgbToHslValues([r, g, b]: [number, number, number]): [number, number, number] {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;

  if (max === min) {
    return [0, 0, Math.round(lightness * 100)];
  }

  const delta = max - min;
  const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let hue = 0;

  if (max === red) {
    hue = (green - blue) / delta + (green < blue ? 6 : 0);
  } else if (max === green) {
    hue = (blue - red) / delta + 2;
  } else {
    hue = (red - green) / delta + 4;
  }

  return [Math.round(hue * 60), Math.round(saturation * 100), Math.round(lightness * 100)];
}

function parseHsl(input: string): [number, number, number] {
  const matches = input.match(/-?\d+(\.\d+)?/g);
  if (!matches || matches.length < 3) {
    throw new Error('Invalid HSL: enter hue, saturation and lightness like hsl(243, 76%, 59%).');
  }

  const [h, s, l] = matches.slice(0, 3).map((value) => Number(value));
  if ([h, s, l].some((value) => Number.isNaN(value)) || s < 0 || s > 100 || l < 0 || l > 100) {
    throw new Error('Invalid HSL: saturation and lightness must be between 0 and 100.');
  }

  return [((h % 360) + 360) % 360, s, l];
}

function hslToRgbValues([h, s, l]: [number, number, number]): [number, number, number] {
  const saturation = s / 100;
  const lightness = l / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = chroma * (1 - Math.abs(((h / 60) % 2) - 1));
  const match = lightness - chroma / 2;
  let red = 0;
  let green = 0;
  let blue = 0;

  if (h < 60) {
    [red, green, blue] = [chroma, x, 0];
  } else if (h < 120) {
    [red, green, blue] = [x, chroma, 0];
  } else if (h < 180) {
    [red, green, blue] = [0, chroma, x];
  } else if (h < 240) {
    [red, green, blue] = [0, x, chroma];
  } else if (h < 300) {
    [red, green, blue] = [x, 0, chroma];
  } else {
    [red, green, blue] = [chroma, 0, x];
  }

  return [red, green, blue].map((value) => Math.round((value + match) * 255)) as [number, number, number];
}

function queryInput(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) {
    throw new Error('Invalid query string: paste a URL or query string first.');
  }

  try {
    return new URL(trimmed).search;
  } catch {
    return trimmed.startsWith('?') ? trimmed.slice(1) : trimmed;
  }
}

function queryStringToObject(input: string): JsonObject {
  const params = new URLSearchParams(queryInput(input));
  const output: JsonObject = {};

  params.forEach((value, key) => {
    const existing = output[key];
    if (Array.isArray(existing)) {
      existing.push(value);
    } else if (existing !== undefined) {
      output[key] = [existing, value];
    } else {
      output[key] = value;
    }
  });

  return output;
}

function objectToQueryString(value: unknown): string {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Invalid JSON: query string output expects a JSON object with key/value pairs.');
  }

  const params = new URLSearchParams();
  Object.entries(value as JsonObject).forEach(([key, item]) => {
    if (item === undefined || item === null) return;
    const values = Array.isArray(item) ? item : [item];
    values.forEach((entry) => {
      const text = typeof entry === 'object' && entry !== null ? JSON.stringify(entry) : String(entry);
      params.append(key, text);
    });
  });

  return params.toString();
}

function jsonToLines(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [value];
}

function parseJsonLines(input: string): unknown[] {
  const lines = input.split(/\r\n|\r|\n/).map((line) => line.trim()).filter(Boolean);
  if (!lines.length) {
    throw new Error('Invalid JSON Lines: paste at least one JSON object or value per line.');
  }

  return lines.map((line, index) => {
    try {
      return JSON.parse(line);
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : 'Invalid JSON.';
      throw new Error(`Invalid JSON Lines: line ${index + 1} is not valid JSON. ${message}`);
    }
  });
}

function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function encodeUnicodeEscapes(input: string): string {
  return Array.from(input).map((char) => {
    const codePoint = char.codePointAt(0) ?? 0;
    return codePoint <= 0xffff
      ? `\\u${codePoint.toString(16).padStart(4, '0')}`
      : `\\u{${codePoint.toString(16)}}`;
  }).join('');
}

function decodeUnicodeEscapes(input: string): string {
  const invalidEscape = input.match(/\\u(?!\{[0-9a-fA-F]+\}|[0-9a-fA-F]{4})/);
  if (invalidEscape) {
    throw new Error('Invalid Unicode escape: use \\uXXXX or \\u{X...} notation.');
  }

  return input.replace(/\\u\{([0-9a-fA-F]+)\}|\\u([0-9a-fA-F]{4})/g, (_match, braced: string | undefined, plain: string | undefined) => {
    const codePoint = parseInt(braced ?? plain ?? '0', 16);
    try {
      return String.fromCodePoint(codePoint);
    } catch {
      throw new Error('Invalid Unicode escape: code point is outside the valid Unicode range.');
    }
  });
}

function uuidFallback(): string {
  return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (char) => {
    const value = Number(char) ^ (Math.random() * 16 >> Number(char) / 4);
    return value.toString(16);
  });
}

function randomUuid(): string {
  return globalThis.crypto?.randomUUID?.() ?? uuidFallback();
}

function rgbToCmykValues([r, g, b]: [number, number, number]): [number, number, number, number] {
  if (r === 0 && g === 0 && b === 0) return [0, 0, 0, 100];
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const k = 1 - Math.max(red, green, blue);
  const c = (1 - red - k) / (1 - k);
  const m = (1 - green - k) / (1 - k);
  const y = (1 - blue - k) / (1 - k);

  return [c, m, y, k].map((item) => Math.round(item * 100)) as [number, number, number, number];
}

function parseCmyk(input: string): [number, number, number, number] {
  const matches = input.match(/\d+(\.\d+)?/g);
  if (!matches || matches.length < 4) {
    throw new Error('Invalid CMYK: enter four values like cmyk(65%, 69%, 0%, 11%) or 65, 69, 0, 11.');
  }

  const values = matches.slice(0, 4).map((value) => Number(value));
  if (values.some((value) => Number.isNaN(value) || value < 0 || value > 100)) {
    throw new Error('Invalid CMYK: each value must be a number between 0 and 100.');
  }

  return values as [number, number, number, number];
}

function cmykToRgbValues([c, m, y, k]: [number, number, number, number]): [number, number, number] {
  const cyan = c / 100;
  const magenta = m / 100;
  const yellow = y / 100;
  const black = k / 100;

  return [
    Math.round(255 * (1 - cyan) * (1 - black)),
    Math.round(255 * (1 - magenta) * (1 - black)),
    Math.round(255 * (1 - yellow) * (1 - black))
  ];
}

function decodeJwtPart(part: string): unknown {
  try {
    return JSON.parse(decodeBase64(part, true));
  } catch {
    throw new Error('Invalid JWT: header or payload is not valid Base64URL JSON.');
  }
}

const morseMap: Record<string, string> = {
  a: '.-', b: '-...', c: '-.-.', d: '-..', e: '.', f: '..-.', g: '--.', h: '....', i: '..',
  j: '.---', k: '-.-', l: '.-..', m: '--', n: '-.', o: '---', p: '.--.', q: '--.-', r: '.-.',
  s: '...', t: '-', u: '..-', v: '...-', w: '.--', x: '-..-', y: '-.--', z: '--..',
  '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
  '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.',
  '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
  '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.'
};

const reverseMorseMap = Object.fromEntries(Object.entries(morseMap).map(([letter, code]) => [code, letter]));

const natoMap: Record<string, string> = {
  a: 'Alpha', b: 'Bravo', c: 'Charlie', d: 'Delta', e: 'Echo', f: 'Foxtrot', g: 'Golf', h: 'Hotel',
  i: 'India', j: 'Juliett', k: 'Kilo', l: 'Lima', m: 'Mike', n: 'November', o: 'Oscar', p: 'Papa',
  q: 'Quebec', r: 'Romeo', s: 'Sierra', t: 'Tango', u: 'Uniform', v: 'Victor', w: 'Whiskey',
  x: 'X-ray', y: 'Yankee', z: 'Zulu',
  '0': 'Zero', '1': 'One', '2': 'Two', '3': 'Three', '4': 'Four', '5': 'Five', '6': 'Six',
  '7': 'Seven', '8': 'Eight', '9': 'Nine'
};

const httpStatusText: Record<number, string> = {
  100: 'Continue', 101: 'Switching Protocols', 102: 'Processing', 200: 'OK', 201: 'Created',
  202: 'Accepted', 204: 'No Content', 301: 'Moved Permanently', 302: 'Found', 304: 'Not Modified',
  307: 'Temporary Redirect', 308: 'Permanent Redirect', 400: 'Bad Request', 401: 'Unauthorized',
  403: 'Forbidden', 404: 'Not Found', 405: 'Method Not Allowed', 409: 'Conflict',
  410: 'Gone', 418: "I'm a teapot", 422: 'Unprocessable Content', 429: 'Too Many Requests',
  500: 'Internal Server Error', 501: 'Not Implemented', 502: 'Bad Gateway', 503: 'Service Unavailable',
  504: 'Gateway Timeout'
};

const mimeTypes: Record<string, string> = {
  html: 'text/html',
  htm: 'text/html',
  css: 'text/css',
  js: 'text/javascript',
  mjs: 'text/javascript',
  json: 'application/json',
  xml: 'application/xml',
  csv: 'text/csv',
  txt: 'text/plain',
  md: 'text/markdown',
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
  pdf: 'application/pdf',
  zip: 'application/zip',
  mp3: 'audio/mpeg',
  mp4: 'video/mp4',
  wasm: 'application/wasm'
};

function parseBigIntAuto(input: string): bigint {
  const trimmed = input.trim().replace(/_/g, '');
  const sign = trimmed.startsWith('-') ? -1n : 1n;
  const unsigned = trimmed.replace(/^[+-]/, '');
  if (/^0b[01]+$/i.test(unsigned)) return sign * BigInt(unsigned);
  if (/^0o[0-7]+$/i.test(unsigned)) return sign * BigInt(unsigned);
  if (/^0x[0-9a-f]+$/i.test(unsigned)) return sign * BigInt(unsigned);
  if (/^[+-]?[0-9]+$/i.test(trimmed)) return BigInt(trimmed);
  if (/^[0-9a-f]+$/i.test(unsigned) && /[a-f]/i.test(unsigned)) return sign * BigInt(`0x${unsigned}`);
  throw new Error('Invalid number: enter a whole decimal, binary, octal or hexadecimal number.');
}

function splitTwoBlocks(input: string, label: string): [string[], string[]] {
  const lines = input.split(/\r\n|\r|\n/);
  const separatorIndex = lines.findIndex((line) => line.trim() === '---');
  if (separatorIndex < 0) {
    throw new Error(`${label} expects two text blocks separated by a line containing ---.`);
  }
  return [lines.slice(0, separatorIndex), lines.slice(separatorIndex + 1)];
}

function colorToCss(input: string): string {
  const [r, g, b] = parseColorLine(input);
  return `rgb(${r}, ${g}, ${b})`;
}

function detectBrowser(userAgent: string): string {
  const checks: Array<[RegExp, string]> = [
    [/Edg\/([\d.]+)/, 'Microsoft Edge'],
    [/OPR\/([\d.]+)/, 'Opera'],
    [/Chrome\/([\d.]+)/, 'Chrome'],
    [/Firefox\/([\d.]+)/, 'Firefox'],
    [/Version\/([\d.]+).*Safari\//, 'Safari'],
    [/Safari\/([\d.]+)/, 'Safari']
  ];
  const match = checks.find(([pattern]) => pattern.test(userAgent));
  return match ? match[1] : 'Unknown';
}

function detectOs(userAgent: string): string {
  if (/Windows NT/i.test(userAgent)) return 'Windows';
  if (/Android/i.test(userAgent)) return 'Android';
  if (/(iPhone|iPad|iPod)/i.test(userAgent)) return 'iOS';
  if (/Mac OS X/i.test(userAgent)) return 'macOS';
  if (/Linux/i.test(userAgent)) return 'Linux';
  return 'Unknown';
}

function detectDevice(userAgent: string): string {
  if (/bot|crawler|spider|crawling/i.test(userAgent)) return 'bot';
  if (/iPad|Tablet/i.test(userAgent)) return 'tablet';
  if (/Mobile|iPhone|Android/i.test(userAgent)) return 'mobile';
  return 'desktop';
}

function parseIsoDate(input: string, label: string): Date {
  const value = new Date(`${input.trim()}T00:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.trim()) || Number.isNaN(value.getTime())) {
    throw new Error(`Invalid ${label}: use YYYY-MM-DD.`);
  }
  return value;
}

function dateLines(input: string, label: string): [Date, Date] {
  const lines = input.split(/\r\n|\r|\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) {
    throw new Error(`${label} expects two dates, one per line, using YYYY-MM-DD.`);
  }
  return [parseIsoDate(lines[0], 'start date'), parseIsoDate(lines[1], 'end date')];
}

function schemaTypeToTs(value: unknown): string {
  if (!value || typeof value !== 'object') return 'unknown';
  const schema = value as JsonObject;
  const type = schema.type;
  if (Array.isArray(type)) {
    return type.map((item) => schemaTypeToTs({ ...schema, type: item })).join(' | ');
  }
  if (type === 'string') return 'string';
  if (type === 'integer' || type === 'number') return 'number';
  if (type === 'boolean') return 'boolean';
  if (type === 'null') return 'null';
  if (type === 'array') return `${schemaTypeToTs(schema.items)}[]`;
  if (type === 'object' || schema.properties) {
    const properties = schema.properties && typeof schema.properties === 'object' ? schema.properties as JsonObject : {};
    const required = new Set(Array.isArray(schema.required) ? schema.required.map(String) : []);
    const lines = Object.entries(properties).map(([key, property]) => `  ${key}${required.has(key) ? '' : '?'}: ${schemaTypeToTs(property)};`);
    return lines.length ? `{\n${lines.join('\n')}\n}` : 'Record<string, unknown>';
  }
  if (Array.isArray(schema.enum)) {
    return schema.enum.map((item) => JSON.stringify(item)).join(' | ');
  }
  return 'unknown';
}

function rgbHex([r, g, b]: [number, number, number]): string {
  return `#${[r, g, b].map((item) => item.toString(16).padStart(2, '0')).join('')}`;
}

function mixRgb(left: [number, number, number], right: [number, number, number], amount: number): [number, number, number] {
  return left.map((value, index) => Math.round(value + (right[index] - value) * amount)) as [number, number, number];
}

function rot13(input: string): string {
  return input.replace(/[a-z]/gi, (char) => {
    const base = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - base + 13) % 26) + base);
  });
}

export const converterFunctions: Record<string, ConverterFunction> = {
  jsonToCsv(input, options) {
    const delimiter = selectOption(options, 'delimiter', ',');
    const data = parseJson(input);
    const items = Array.isArray(data) ? data : [data];
    const headers = new Set<string>();

    items.forEach((item) => {
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        Object.keys(item).forEach((key) => headers.add(key));
      }
    });

    const headerArray = [...headers];
    const rows = [
      headerArray.join(delimiter),
      ...items.map((item) =>
        headerArray
          .map((header) => {
            if (!item || typeof item !== 'object' || Array.isArray(item)) return '';
            const value = (item as JsonObject)[header];
            if (value === undefined || value === null) return '';
            const text = typeof value === 'object' ? JSON.stringify(value) : String(value);
            return text.includes('"') || text.includes('\n') || text.includes(delimiter) ? `"${text.replace(/"/g, '""')}"` : text;
          })
          .join(delimiter)
      )
    ];

    return result(rows.join('\n'), { rows: Math.max(items.length, 0), columns: headerArray.length, delimiter: delimiter === '\t' ? 'tab' : delimiter });
  },

  csvToJson(input, options) {
    const delimiter = selectOption(options, 'delimiter', ',');
    const trimValues = booleanOption(options, 'trimValues', true);
    const rows = csvRows(input, delimiter);
    if (!rows.length) return result('[]', { rows: 0, columns: 0 });

    const headers = rows[0].map((header) => header.trim());
    if (headers.some((header) => !header)) {
      throw new Error('CSV headers cannot be empty.');
    }

    const records = rows.slice(1).filter((row) => row.some((cell) => cell.trim() !== '')).map((row) => {
      const record: Record<string, string> = {};
      headers.forEach((header, index) => {
        const value = row[index] ?? '';
        record[header] = trimValues ? value.trim() : value;
      });
      return record;
    });

    return result(JSON.stringify(records, null, 2), { rows: records.length, columns: headers.length, delimiter: delimiter === '\t' ? 'tab' : delimiter }, undefined, {
      type: 'table',
      title: 'CSV preview',
      values: { rows: records.length, columns: headers.length },
      rows: records.slice(0, 5)
    });
  },

  csvToTsv(input, options) {
    const delimiter = selectOption(options, 'delimiter', ',');
    const rows = csvRows(input, delimiter);
    const output = rows.map((row) => row.map(tsvCell).join('\t')).join('\n');
    return result(output, { rows: rows.length, columns: rows[0]?.length ?? 0 });
  },

  tsvToCsv(input) {
    const rows = parseTsvRows(input);
    const output = rows.map((row) => row.map(csvCell).join(',')).join('\n');
    return result(output, { rows: rows.length, columns: rows[0]?.length ?? 0 });
  },

  csvColumnExtractor(input, options) {
    const [columnLine = '', ...csvLines] = input.split(/\r\n|\r|\n/);
    const target = columnLine.replace(/^column=/i, '').trim();
    if (!target || !csvLines.length) {
      throw new Error('CSV column extractor expects column=name or column=2 on the first line, then CSV data.');
    }
    const delimiter = selectOption(options, 'delimiter', ',');
    const rows = csvRows(csvLines.join('\n'), delimiter);
    if (!rows.length) {
      throw new Error('CSV column extractor expects CSV headers and at least one data row.');
    }
    const headers = rows[0].map((header) => header.trim());
    const numericIndex = /^\d+$/.test(target) ? Number(target) - 1 : -1;
    const index = numericIndex >= 0 ? numericIndex : headers.findIndex((header) => header.toLocaleLowerCase() === target.toLocaleLowerCase());
    if (index < 0 || index >= headers.length) {
      throw new Error(`CSV column not found: ${target}. Use a header name or a 1-based column number.`);
    }
    const values = rows.slice(1).map((row) => row[index] ?? '');
    return result(values.join('\n'), { rows: values.length, column: headers[index] || String(index + 1) });
  },

  csvDelimiterChanger(input, options) {
    const fromDelimiter = selectOption(options, 'fromDelimiter', ',');
    const toDelimiter = selectOption(options, 'toDelimiter', ';');
    const rows = csvRows(input, fromDelimiter);
    const output = rows.map((row) => row.map((cell) => delimitedCell(cell, toDelimiter)).join(toDelimiter)).join('\n');
    return result(output, {
      rows: rows.length,
      columns: rows[0]?.length ?? 0,
      from: fromDelimiter === '\t' ? 'tab' : fromDelimiter,
      to: toDelimiter === '\t' ? 'tab' : toDelimiter
    });
  },

  csvListSorter(input) {
    const [columnLine = '', ...csvLines] = input.split(/\r\n|\r|\n/);
    const target = columnLine.replace(/^column=/i, '').trim();
    if (!target || !csvLines.length) {
      throw new Error('CSV list sorter expects column=name or column=2 on the first line, then CSV data.');
    }
    const rows = csvRows(csvLines.join('\n'), ',');
    if (rows.length < 2) {
      throw new Error('CSV list sorter expects a header row and at least one data row.');
    }
    const headers = rows[0].map((header) => header.trim());
    const numericIndex = /^\d+$/.test(target) ? Number(target) - 1 : -1;
    const index = numericIndex >= 0 ? numericIndex : headers.findIndex((header) => header.toLocaleLowerCase() === target.toLocaleLowerCase());
    if (index < 0 || index >= headers.length) {
      throw new Error(`CSV sort column not found: ${target}. Use a header name or a 1-based column number.`);
    }
    const sorted = rows.slice(1).sort((left, right) => (left[index] ?? '').localeCompare(right[index] ?? '', undefined, { numeric: true }));
    const output = [headers, ...sorted].map((row) => row.map(csvCell).join(',')).join('\n');
    return result(output, { rows: sorted.length, columns: headers.length, sortColumn: headers[index] || String(index + 1) });
  },

  csvToMarkdownTable(input) {
    const rows = csvRows(input, ',');
    if (rows.length < 2) {
      throw new Error('CSV to Markdown table expects a header row and at least one data row.');
    }
    const headers = rows[0].map((cell) => cell.trim());
    const separator = headers.map(() => '---');
    const escapeCell = (cell: string) => cell.replace(/\|/g, '\\|').replace(/\r?\n|\r/g, ' ').trim();
    const output = [headers, separator, ...rows.slice(1)]
      .map((row) => `| ${row.map(escapeCell).join(' | ')} |`)
      .join('\n');
    return result(output, { rows: rows.length - 1, columns: headers.length });
  },

  jsonToXml(input) {
    const data = parseJson(input);
    const body = jsonToXmlValue(data, 1);
    return result(`<root>\n${body}\n</root>`, countStats(body));
  },

  xmlToJson(input) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(input, 'application/xml');
    if (xml.getElementsByTagName('parsererror').length) {
      throw new Error('Invalid XML: check that tags are closed correctly and the document has one root element.');
    }

    const walk = (node: Element): unknown => {
      const object: Record<string, unknown> = {};
      Array.from(node.attributes).forEach((attribute) => {
        object[`@${attribute.name}`] = attribute.value;
      });

      const elementChildren = Array.from(node.children);
      if (!elementChildren.length) {
        return Object.keys(object).length ? { ...object, '#text': node.textContent?.trim() ?? '' } : node.textContent?.trim() ?? '';
      }

      elementChildren.forEach((child) => {
        const value = walk(child);
        if (object[child.nodeName]) {
          object[child.nodeName] = Array.isArray(object[child.nodeName])
            ? [...(object[child.nodeName] as unknown[]), value]
            : [object[child.nodeName], value];
        } else {
          object[child.nodeName] = value;
        }
      });

      return object;
    };

    const output = JSON.stringify({ [xml.documentElement.nodeName]: walk(xml.documentElement) }, null, 2);
    return result(output, countStats(output));
  },

  jsonToYaml(input) {
    const output = stringify(parseJson(input));
    return result(output, countStats(output));
  },

  yamlToJson(input) {
    const output = JSON.stringify(parse(input), null, 2);
    return result(output, countStats(output));
  },

  jsonFormatter(input, options) {
    const indent = Math.min(8, Math.max(2, numberOption(options, 'indent', 2)));
    const data = parseJson(input);
    const output = JSON.stringify(data, null, indent);
    return result(output, { ...countStats(output), indent }, undefined, jsonPreview(data));
  },

  jsonSchemaFormatter(input, options) {
    const indent = Math.min(8, Math.max(2, numberOption(options, 'indent', 2)));
    const schema = parseJson(input);
    if (!schema || typeof schema !== 'object' || Array.isArray(schema)) {
      throw new Error('Invalid JSON Schema: paste a JSON schema object.');
    }
    const output = JSON.stringify(schema, null, indent);
    const object = schema as JsonObject;
    const properties = object.properties && typeof object.properties === 'object' ? Object.keys(object.properties as JsonObject).length : 0;
    const required = Array.isArray(object.required) ? object.required.length : 0;
    return result(output, { properties, required, indent }, undefined, jsonPreview(schema));
  },

  jsonSchemaToTypescript(input) {
    const schema = parseJson(input);
    if (!schema || typeof schema !== 'object' || Array.isArray(schema)) {
      throw new Error('Invalid JSON Schema: paste a JSON schema object.');
    }
    const title = typeof (schema as JsonObject).title === 'string' ? String((schema as JsonObject).title).replace(/[^\p{L}\p{N}_]/gu, '') : 'GeneratedType';
    const body = schemaTypeToTs(schema);
    const output = body.startsWith('{')
      ? `export interface ${title || 'GeneratedType'} ${body}`
      : `export type ${title || 'GeneratedType'} = ${body};`;
    return result(output, { characters: output.length });
  },

  jsonMinifier(input) {
    const output = JSON.stringify(parseJson(input));
    return result(output, { characters: output.length });
  },

  base64Encode(input, options) {
    const urlSafe = booleanOption(options, 'urlSafe', false);
    const omitPadding = booleanOption(options, 'omitPadding', false);
    const output = urlSafe ? toUrlSafeBase64(encodeBase64(input), omitPadding) : encodeBase64(input);
    return result(output, { characters: output.length, urlSafe: String(urlSafe), padding: omitPadding ? 'omitted' : 'included' });
  },

  base64Decode(input, options) {
    const urlSafe = booleanOption(options, 'urlSafe', false);
    const output = decodeBase64(input, urlSafe);
    return result(output, countStats(output));
  },

  textToBinary(input) {
    const bytes = [...new TextEncoder().encode(input)];
    const output = bytes.map((byte) => byte.toString(2).padStart(8, '0')).join(' ');
    return result(output, { bytes: bytes.length, groups: bytes.length });
  },

  binaryToText(input) {
    const groups = input.trim().split(/\s+/).filter(Boolean);
    if (!groups.length || groups.some((group) => !/^[01]{8}$/.test(group))) {
      throw new Error('Binary input must use 8-bit groups separated by spaces or line breaks.');
    }
    const bytes = Uint8Array.from(groups.map((group) => parseInt(group, 2)));
    const output = new TextDecoder().decode(bytes);
    return result(output, countStats(output));
  },

  urlEncode(input, options) {
    const spaceAsPlus = booleanOption(options, 'spaceAsPlus', false);
    const output = spaceAsPlus ? encodeURIComponent(input).replace(/%20/g, '+') : encodeURIComponent(input);
    return result(output, { characters: input.length, spaceAsPlus: String(spaceAsPlus) });
  },

  urlDecode(input, options) {
    let output = '';
    const source = booleanOption(options, 'plusAsSpace', true) ? input.replace(/\+/g, ' ') : input;
    try {
      output = decodeURIComponent(source);
    } catch {
      throw new Error('Invalid URL encoding: percent escapes must use two hexadecimal characters, like %20.');
    }
    return result(output, countStats(output));
  },

  urlParser(input) {
    let parsed: URL;
    try {
      parsed = new URL(input.trim());
    } catch {
      throw new Error('Invalid URL: paste a full URL including protocol, for example https://example.com/path?x=1.');
    }

    const query: Record<string, string | string[]> = {};
    parsed.searchParams.forEach((value, key) => {
      if (query[key] === undefined) {
        query[key] = value;
      } else if (Array.isArray(query[key])) {
        (query[key] as string[]).push(value);
      } else {
        query[key] = [query[key] as string, value];
      }
    });

    const output = {
      protocol: parsed.protocol.replace(':', ''),
      username: parsed.username,
      passwordPresent: Boolean(parsed.password),
      host: parsed.host,
      hostname: parsed.hostname,
      port: parsed.port,
      pathname: parsed.pathname,
      query,
      hash: parsed.hash.replace(/^#/, ''),
      origin: parsed.origin
    };

    return result(JSON.stringify(output, null, 2), { parameters: parsed.searchParams.size }, undefined, jsonPreview(output));
  },

  queryStringToJson(input) {
    const output = queryStringToObject(input);
    const json = JSON.stringify(output, null, 2);
    return result(json, { parameters: Object.keys(output).length }, undefined, jsonPreview(output));
  },

  jsonToQueryString(input) {
    const data = parseJson(input);
    const output = objectToQueryString(data);
    return result(output, { parameters: new URLSearchParams(output).size });
  },

  jsonToJsonLines(input) {
    const data = parseJson(input);
    const rows = jsonToLines(data);
    const output = rows.map((row) => JSON.stringify(row)).join('\n');
    return result(output, { rows: rows.length, characters: output.length });
  },

  jsonLinesToJson(input) {
    const rows = parseJsonLines(input);
    const output = JSON.stringify(rows, null, 2);
    return result(output, { rows: rows.length, characters: output.length }, undefined, jsonPreview(rows));
  },

  htmlEscape(input) {
    const output = escapeHtml(input);
    return result(output, { characters: output.length });
  },

  htmlUnescape(input) {
    const output = unescapeHtml(input);
    return result(output, countStats(output));
  },

  regexEscape(input) {
    const output = escapeRegex(input);
    return result(output, { escapedCharacters: output.length - input.length, characters: output.length });
  },

  textToUnicodeEscape(input) {
    const output = encodeUnicodeEscapes(input);
    return result(output, { characters: input.length, codePoints: Array.from(input).length });
  },

  unicodeEscapeToText(input) {
    const output = decodeUnicodeEscapes(input);
    return result(output, countStats(output));
  },

  textToMorse(input) {
    const unsupported = new Set<string>();
    const words = input.toLowerCase().split(/\s+/).filter(Boolean);
    const output = words.map((word) =>
      Array.from(word).map((char) => {
        const code = morseMap[char];
        if (!code) {
          unsupported.add(char);
          return '';
        }
        return code;
      }).filter(Boolean).join(' ')
    ).join(' / ');
    return result(output, { characters: input.length, words: words.length }, unsupported.size ? [`Skipped unsupported characters: ${[...unsupported].join(' ')}`] : undefined);
  },

  morseToText(input) {
    const trimmed = input.trim();
    if (!trimmed) throw new Error('Invalid Morse code: paste dots and dashes separated by spaces.');
    const unknown = new Set<string>();
    const output = trimmed.split(/\s*\/\s*/).map((word) =>
      word.trim().split(/\s+/).filter(Boolean).map((code) => {
        const letter = reverseMorseMap[code];
        if (!letter) {
          unknown.add(code);
          return '?';
        }
        return letter;
      }).join('')
    ).join(' ');
    return result(output, countStats(output), unknown.size ? [`Unknown Morse symbols were replaced with ?: ${[...unknown].join(' ')}`] : undefined);
  },

  textToNatoPhonetic(input) {
    const unsupported = new Set<string>();
    const output = Array.from(input.toLocaleLowerCase()).map((char) => {
      if (char === ' ' || char === '\n' || char === '\t') return '/';
      const word = natoMap[char];
      if (!word) {
        unsupported.add(char);
        return '';
      }
      return word;
    }).filter(Boolean).join(' ');
    return result(output, { characters: input.length }, unsupported.size ? [`Skipped unsupported characters: ${[...unsupported].join(' ')}`] : undefined);
  },

  rot13Converter(input) {
    const output = rot13(input);
    return result(output, countStats(output));
  },

  textCase(input) {
    const output = [
      `UPPERCASE: ${input.toUpperCase()}`,
      `lowercase: ${input.toLowerCase()}`,
      `Title Case: ${titleCase(input)}`,
      `Sentence case: ${sentenceCase(input)}`,
      `slug-case: ${slugify(input)}`
    ].join('\n');
    return result(output, countStats(input));
  },

  textToCamelCase(input) {
    const output = camelCase(input);
    return result(output, { words: textWords(input).length, characters: output.length });
  },

  textToSnakeCase(input) {
    const output = snakeCase(input);
    return result(output, { words: textWords(input).length, characters: output.length });
  },

  textToKebabCase(input) {
    const output = kebabCase(input);
    return result(output, { words: textWords(input).length, characters: output.length });
  },

  slugGenerator(input) {
    const output = slugify(input);
    return result(output, { characters: output.length });
  },

  removePunctuation(input) {
    const output = input
      .replace(/[\p{P}\p{S}]+/gu, ' ')
      .replace(/[ \t]+/g, ' ')
      .split(/\r\n|\r|\n/)
      .map((line) => line.trim())
      .join('\n')
      .trim();
    return result(output, countStats(output));
  },

  removeCharacters(input) {
    const [characters = '', ...textLines] = input.split(/\r\n|\r|\n/);
    if (!characters || !textLines.length) {
      throw new Error('Character remover expects the first line to list characters to remove, then the text on the next lines.');
    }
    const removeSet = new Set(Array.from(characters));
    let removed = 0;
    const output = Array.from(textLines.join('\n')).filter((char) => {
      if (removeSet.has(char)) {
        removed += 1;
        return false;
      }
      return true;
    }).join('');
    return result(output, { ...countStats(output), removed });
  },

  prefixSuffixLines(input) {
    const [prefixLine = '', suffixLine = '', ...contentLines] = input.split(/\r\n|\r|\n/);
    const prefix = prefixLine.replace(/^prefix=/i, '');
    const suffix = suffixLine.replace(/^suffix=/i, '');
    if (!contentLines.length) {
      throw new Error('Prefix/suffix lines expects prefix=... on line 1, suffix=... on line 2, then the text lines.');
    }
    const output = contentLines.map((line) => `${prefix}${line}${suffix}`).join('\n');
    return result(output, { lines: contentLines.length, characters: output.length });
  },

  findReplaceText(input) {
    const [findLine = '', replaceLine = '', ...contentLines] = input.split(/\r\n|\r|\n/);
    const findValue = findLine.replace(/^find=/i, '');
    const replaceValue = replaceLine.replace(/^replace=/i, '');
    if (!findValue || !contentLines.length) {
      throw new Error('Find and replace expects find=... on line 1, replace=... on line 2, then the text.');
    }
    const source = contentLines.join('\n');
    const output = source.split(findValue).join(replaceValue);
    const replacements = source.split(findValue).length - 1;
    return result(output, { ...countStats(output), replacements });
  },

  wordCounter(input) {
    const stats = countStats(input);
    const readingMinutes = Math.max(1, Math.ceil(stats.words / 220));
    const output = [
      `Words: ${stats.words}`,
      `Characters: ${stats.characters}`,
      `Characters without spaces: ${input.replace(/\s/g, '').length}`,
      `Lines: ${stats.lines}`,
      `Estimated reading time: ${readingMinutes} min`
    ].join('\n');
    return result(output, { ...stats, readingMinutes }, undefined, {
      type: 'json',
      title: 'Text stats',
      values: { ...stats, readingMinutes, charactersNoSpaces: input.replace(/\s/g, '').length }
    });
  },

  sortLines(input, options) {
    const direction = selectOption(options, 'direction', 'asc');
    const caseSensitive = booleanOption(options, 'caseSensitive', true);
    const trimLines = booleanOption(options, 'trimLines', false);
    const lines = input.split(/\r\n|\r|\n/).map((line) => (trimLines ? line.trim() : line));
    const output = lines
      .sort((a, b) => {
        const left = caseSensitive ? a : a.toLocaleLowerCase();
        const right = caseSensitive ? b : b.toLocaleLowerCase();
        return direction === 'desc' ? right.localeCompare(left) : left.localeCompare(right);
      })
      .join('\n');
    return result(output, { ...countStats(output), direction });
  },

  addLineNumbers(input) {
    const lines = input.split(/\r\n|\r|\n/);
    const width = String(lines.length).length;
    const output = lines.map((line, index) => `${String(index + 1).padStart(width, '0')}. ${line}`).join('\n');
    return result(output, { lines: lines.length, characters: output.length });
  },

  removeLineNumbers(input) {
    const output = input
      .split(/\r\n|\r|\n/)
      .map((line) => line.replace(/^\s*\d+\s*[).:-]?\s*/, ''))
      .join('\n');
    return result(output, countStats(output));
  },

  removeDuplicateLines(input, options) {
    const caseSensitive = booleanOption(options, 'caseSensitive', true);
    const trimLines = booleanOption(options, 'trimLines', false);
    const seen = new Set<string>();
    const originalLines = input.split(/\r\n|\r|\n/);
    const lines = originalLines.map((line) => (trimLines ? line.trim() : line)).filter((line) => {
      const key = caseSensitive ? line : line.toLocaleLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return result(lines.join('\n'), { lines: lines.length, removed: originalLines.length - lines.length });
  },

  trimWhitespace(input, options) {
    const collapseSpaces = booleanOption(options, 'collapseSpaces', false);
    const output = input
      .split(/\r\n|\r|\n/)
      .map((line) => {
        const trimmed = line.trim();
        return collapseSpaces ? trimmed.replace(/[ \t]+/g, ' ') : trimmed;
      })
      .join('\n')
      .trim();
    return result(output, countStats(output), collapseSpaces ? ['Repeated spaces and tabs were collapsed inside each line.'] : undefined);
  },

  removeEmptyLines(input) {
    const originalLines = input.split(/\r\n|\r|\n/);
    const lines = originalLines.filter((line) => line.trim() !== '');
    return result(lines.join('\n'), { lines: lines.length, removed: originalLines.length - lines.length });
  },

  textDiffChecker(input) {
    const [left, right] = splitTwoBlocks(input, 'Text diff checker');
    const rightSet = new Set(right);
    const leftSet = new Set(left);
    const added = right.filter((line) => !leftSet.has(line));
    const removed = left.filter((line) => !rightSet.has(line));
    const unchanged = left.filter((line) => rightSet.has(line));
    const output = [
      `Added lines: ${added.length}`,
      `Removed lines: ${removed.length}`,
      `Unchanged lines: ${unchanged.length}`,
      '',
      'Added:',
      ...(added.length ? added.map((line) => `+ ${line}`) : ['none']),
      '',
      'Removed:',
      ...(removed.length ? removed.map((line) => `- ${line}`) : ['none'])
    ].join('\n');
    return result(output, { added: added.length, removed: removed.length, unchanged: unchanged.length });
  },

  listDifference(input) {
    const [left, right] = splitTwoBlocks(input, 'List difference');
    const first = left.map((line) => line.trim()).filter(Boolean);
    const second = right.map((line) => line.trim()).filter(Boolean);
    const firstSet = new Set(first);
    const secondSet = new Set(second);
    const onlyFirst = [...firstSet].filter((item) => !secondSet.has(item));
    const onlySecond = [...secondSet].filter((item) => !firstSet.has(item));
    const both = [...firstSet].filter((item) => secondSet.has(item));
    const output = [
      'Only in first list:',
      ...(onlyFirst.length ? onlyFirst : ['none']),
      '',
      'Only in second list:',
      ...(onlySecond.length ? onlySecond : ['none']),
      '',
      'In both lists:',
      ...(both.length ? both : ['none'])
    ].join('\n');
    return result(output, { onlyFirst: onlyFirst.length, onlySecond: onlySecond.length, common: both.length });
  },

  decimalToHex(input) {
    const value = parseIntegerInput(input, 10);
    const output = `0x${value.toString(16).toUpperCase()}`;
    return result(output, { digits: output.length - 2 });
  },

  hexToDecimal(input) {
    const value = parseIntegerInput(input, 16);
    const output = value.toString(10);
    return result(output, { digits: output.length });
  },

  numberBaseConverter(input) {
    const value = parseBigIntAuto(input);
    const sign = value < 0n ? '-' : '';
    const absolute = value < 0n ? -value : value;
    const output = [
      `Decimal: ${value.toString(10)}`,
      `Binary: ${sign}0b${absolute.toString(2)}`,
      `Octal: ${sign}0o${absolute.toString(8)}`,
      `Hex: ${sign}0x${absolute.toString(16).toUpperCase()}`
    ].join('\n');
    return result(output, { digits: absolute.toString(10).length });
  },

  uuidGenerator(input) {
    const rawCount = Number(input.trim());
    if (!Number.isInteger(rawCount) || rawCount < 1) {
      throw new Error('Invalid UUID count: enter a whole number between 1 and 100.');
    }
    const count = Math.min(rawCount, 100);
    const output = Array.from({ length: count }, randomUuid).join('\n');
    return result(output, { count }, rawCount > 100 ? ['Generated the first 100 UUIDs to keep the output manageable.'] : undefined);
  },

  randomNumberGenerator(input) {
    const [rawCount = 1, rawMin = 1, rawMax = 100] = parseNumericValues(input, 1, 'random number generation');
    const count = Math.min(Math.max(Math.round(rawCount), 1), 100);
    const min = Math.ceil(Math.min(rawMin, rawMax));
    const max = Math.floor(Math.max(rawMin, rawMax));
    if (min > max) throw new Error('Invalid random number range: minimum must be lower than or equal to maximum.');
    const span = max - min + 1;
    const numbers = Array.from({ length: count }, () => String(Math.floor(Math.random() * span) + min));
    return result(numbers.join('\n'), { count, min, max }, rawCount > 100 ? ['Generated the first 100 numbers to keep the output manageable.'] : undefined);
  },

  percentageOf(input) {
    const [percent, value] = parseNumericValues(input, 2, 'percentage calculation');
    const resultValue = (percent / 100) * value;
    return calculatorOutput([
      `${formatNumber(percent)}% of ${formatNumber(value)} = ${formatNumber(resultValue)}`,
      `Formula: ${formatNumber(value)} × ${formatNumber(percent)} / 100`
    ], { percent, value, result: resultValue });
  },

  percentageChange(input) {
    const [oldValue, newValue] = parseNumericValues(input, 2, 'percentage change');
    if (oldValue === 0) {
      throw new Error('Invalid percentage change: the original value cannot be 0.');
    }
    const difference = newValue - oldValue;
    const percentChange = (difference / Math.abs(oldValue)) * 100;
    return calculatorOutput([
      `Change: ${formatNumber(percentChange)}%`,
      `Difference: ${formatNumber(difference)}`,
      `From ${formatNumber(oldValue)} to ${formatNumber(newValue)}`
    ], { oldValue, newValue, difference, percentChange });
  },

  discountCalculator(input) {
    const [price, discountPercent] = parseNumericValues(input, 2, 'discount calculation');
    if (price < 0 || discountPercent < 0) {
      throw new Error('Invalid discount calculation: price and discount must be positive numbers.');
    }
    const discount = (price * discountPercent) / 100;
    const finalPrice = price - discount;
    return calculatorOutput([
      `Original price: ${formatNumber(price)}`,
      `Discount: ${formatNumber(discount)} (${formatNumber(discountPercent)}%)`,
      `Final price: ${formatNumber(finalPrice)}`
    ], { price, discountPercent, discount, finalPrice });
  },

  vatCalculator(input) {
    const [amount, taxPercent] = parseNumericValues(input, 2, 'tax calculation');
    if (amount < 0 || taxPercent < 0) {
      throw new Error('Invalid tax calculation: amount and tax percent must be positive numbers.');
    }
    const tax = (amount * taxPercent) / 100;
    const total = amount + tax;
    return calculatorOutput([
      `Amount before tax: ${formatNumber(amount)}`,
      `Tax: ${formatNumber(tax)} (${formatNumber(taxPercent)}%)`,
      `Total: ${formatNumber(total)}`
    ], { amount, taxPercent, tax, total });
  },

  averageCalculator(input) {
    const values = parseNumericValues(input, 1, 'average calculation');
    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((total, value) => total + value, 0);
    const average = sum / values.length;
    const middle = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
    return calculatorOutput([
      `Count: ${values.length}`,
      `Sum: ${formatNumber(sum)}`,
      `Average: ${formatNumber(average)}`,
      `Median: ${formatNumber(median)}`,
      `Min: ${formatNumber(sorted[0])}`,
      `Max: ${formatNumber(sorted[sorted.length - 1])}`
    ], { count: values.length, sum, average, median, min: sorted[0], max: sorted[sorted.length - 1] });
  },

  ratioSimplifier(input) {
    const [left, right] = parseNumericValues(input, 2, 'ratio');
    if (left === 0 || right === 0) {
      throw new Error('Invalid ratio: both values must be greater than 0.');
    }
    const scale = 1000000;
    const scaledLeft = Math.round(Math.abs(left) * scale);
    const scaledRight = Math.round(Math.abs(right) * scale);
    const divisor = integerGcd(scaledLeft, scaledRight);
    const simplifiedLeft = scaledLeft / divisor;
    const simplifiedRight = scaledRight / divisor;
    const decimal = left / right;
    return calculatorOutput([
      `Simplified ratio: ${simplifiedLeft}:${simplifiedRight}`,
      `Decimal: ${formatNumber(decimal, 4)}`,
      `Original ratio: ${formatNumber(left)}:${formatNumber(right)}`
    ], { left, right, simplifiedLeft, simplifiedRight, decimal });
  },

  aspectRatioCalculator(input) {
    const [width, height] = parseNumericValues(input, 2, 'aspect ratio');
    if (width <= 0 || height <= 0) {
      throw new Error('Invalid aspect ratio: width and height must be greater than 0.');
    }
    const divisor = integerGcd(width, height);
    const ratioWidth = Math.round(width / divisor);
    const ratioHeight = Math.round(height / divisor);
    return calculatorOutput([
      `Aspect ratio: ${ratioWidth}:${ratioHeight}`,
      `Decimal: ${formatNumber(width / height, 4)}`,
      `Orientation: ${width === height ? 'square' : width > height ? 'landscape' : 'portrait'}`,
      `Size: ${formatNumber(width)} × ${formatNumber(height)}`
    ], { width, height, ratioWidth, ratioHeight });
  },

  ruleOfThreeCalculator(input) {
    const [a, b, c] = parseNumericValues(input, 3, 'rule of three calculation');
    if (a === 0) throw new Error('Invalid rule of three calculation: the first value cannot be 0.');
    const x = (b * c) / a;
    return calculatorOutput([
      `${formatNumber(a)} is to ${formatNumber(b)} as ${formatNumber(c)} is to ${formatNumber(x)}`,
      `X = ${formatNumber(x)}`,
      `Formula: ${formatNumber(b)} × ${formatNumber(c)} / ${formatNumber(a)}`
    ], { a, b, c, x });
  },

  unitPriceCalculator(input) {
    const [price, quantity] = parseNumericValues(input, 2, 'unit price calculation');
    if (price < 0 || quantity <= 0) {
      throw new Error('Invalid unit price calculation: price must be positive and quantity must be greater than 0.');
    }
    const unitPrice = price / quantity;
    return calculatorOutput([
      `Unit price: ${formatNumber(unitPrice, 4)}`,
      `Total price: ${formatNumber(price)}`,
      `Quantity: ${formatNumber(quantity)}`
    ], { price, quantity, unitPrice: formatNumber(unitPrice, 4) });
  },

  loanPaymentCalculator(input) {
    const [principal, annualRate, years] = parseNumericValues(input, 3, 'loan payment calculation');
    if (principal <= 0 || annualRate < 0 || years <= 0) {
      throw new Error('Invalid loan payment calculation: principal and years must be greater than 0, and rate cannot be negative.');
    }
    const months = Math.round(years * 12);
    const monthlyRate = annualRate / 100 / 12;
    const monthlyPayment = monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -months);
    const totalPaid = monthlyPayment * months;
    const interest = totalPaid - principal;
    return calculatorOutput([
      `Monthly payment: ${formatNumber(monthlyPayment, 2)}`,
      `Total paid: ${formatNumber(totalPaid, 2)}`,
      `Total interest: ${formatNumber(interest, 2)}`,
      `Payments: ${months}`
    ], { principal, annualRate, years, monthlyPayment: formatNumber(monthlyPayment, 2) });
  },

  bmiCalculator(input) {
    const [weightKg, rawHeight] = parseNumericValues(input, 2, 'BMI calculation');
    const heightMeters = rawHeight > 3 ? rawHeight / 100 : rawHeight;
    if (weightKg <= 0 || heightMeters <= 0) {
      throw new Error('Invalid BMI calculation: weight and height must be greater than 0.');
    }
    const bmi = weightKg / (heightMeters ** 2);
    const status = bmi < 18.5 ? 'underweight' : bmi < 25 ? 'normal' : bmi < 30 ? 'overweight' : 'obese';
    return calculatorOutput([
      `BMI: ${formatNumber(bmi, 1)}`,
      `Category: ${status}`,
      `Weight: ${formatNumber(weightKg)} kg`,
      `Height: ${formatNumber(heightMeters, 2)} m`
    ], { bmi: formatNumber(bmi, 1), status });
  },

  tipCalculator(input) {
    const [bill, tipPercent, people = 1] = parseNumericValues(input, 2, 'tip calculation');
    if (bill < 0 || tipPercent < 0 || people <= 0) {
      throw new Error('Invalid tip calculation: bill, tip percent and people must be positive numbers.');
    }
    const tip = (bill * tipPercent) / 100;
    const total = bill + tip;
    const perPerson = total / people;
    return calculatorOutput([
      `Tip: ${formatNumber(tip, 2)}`,
      `Total: ${formatNumber(total, 2)}`,
      `Per person: ${formatNumber(perPerson, 2)}`
    ], { bill, tipPercent, people, total: formatNumber(total, 2) });
  },

  businessDaysCalculator(input) {
    let [start, end] = dateLines(input, 'Business days calculator');
    if (start > end) {
      [start, end] = [end, start];
    }
    let days = 0;
    let businessDays = 0;
    const cursor = new Date(start);
    while (cursor <= end) {
      days += 1;
      const weekday = cursor.getUTCDay();
      if (weekday !== 0 && weekday !== 6) businessDays += 1;
      cursor.setUTCDate(cursor.getUTCDate() + 1);
    }
    return calculatorOutput([
      `Business days: ${businessDays}`,
      `Calendar days: ${days}`,
      `Start: ${start.toISOString().slice(0, 10)}`,
      `End: ${end.toISOString().slice(0, 10)}`
    ], { businessDays, calendarDays: days });
  },

  ageCalculator(input) {
    const [birthDate, rawEndDate] = dateLines(input, 'Age calculator');
    const endDate = rawEndDate ?? new Date();
    if (birthDate > endDate) {
      throw new Error('Invalid age calculation: birth date must be before the target date.');
    }
    let years = endDate.getUTCFullYear() - birthDate.getUTCFullYear();
    let months = endDate.getUTCMonth() - birthDate.getUTCMonth();
    let days = endDate.getUTCDate() - birthDate.getUTCDate();
    if (days < 0) {
      months -= 1;
      days += new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), 0)).getUTCDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    return calculatorOutput([
      `Age: ${years} years, ${months} months, ${days} days`,
      `Years: ${years}`,
      `Months after last birthday: ${months}`,
      `Days after last month: ${days}`
    ], { years, months, days });
  },

  countdownCalculator(input) {
    const [start, target] = dateLines(input, 'Countdown calculator');
    const milliseconds = target.getTime() - start.getTime();
    if (milliseconds < 0) {
      throw new Error('Invalid countdown: target date must be after the start date.');
    }
    const days = Math.ceil(milliseconds / 86400000);
    const weeks = days / 7;
    return calculatorOutput([
      `Days remaining: ${days}`,
      `Weeks remaining: ${formatNumber(weeks, 2)}`,
      `Start: ${start.toISOString().slice(0, 10)}`,
      `Target: ${target.toISOString().slice(0, 10)}`
    ], { days, weeks: formatNumber(weeks, 2) });
  },

  timestampToDate(input, options) {
    const raw = Number(input.trim());
    if (!Number.isFinite(raw)) throw new Error('Invalid timestamp: paste a numeric Unix timestamp in seconds or milliseconds.');
    const inputUnit = selectOption(options, 'inputUnit', 'auto');
    const milliseconds = inputUnit === 'seconds' ? raw * 1000 : inputUnit === 'milliseconds' ? raw : raw < 100000000000 ? raw * 1000 : raw;
    const date = new Date(milliseconds);
    if (Number.isNaN(date.getTime())) throw new Error('Invalid timestamp: the value is outside the supported date range.');
    return result(
      [`UTC: ${date.toISOString()}`, `Local: ${date.toString()}`, `Unix seconds: ${Math.floor(milliseconds / 1000)}`, `Milliseconds: ${milliseconds}`].join('\n'),
      { timestamp: Math.floor(milliseconds / 1000), inputUnit }
    );
  },

  dateToTimestamp(input, options) {
    const date = new Date(input.trim());
    if (Number.isNaN(date.getTime())) throw new Error('Invalid date: use an ISO date like 2026-06-18T12:00:00Z or a readable date string.');
    const outputUnit = selectOption(options, 'outputUnit', 'both');
    const seconds = Math.floor(date.getTime() / 1000);
    const milliseconds = date.getTime();
    const lines = outputUnit === 'seconds'
      ? [`Unix seconds: ${seconds}`, `ISO: ${date.toISOString()}`]
      : outputUnit === 'milliseconds'
        ? [`Milliseconds: ${milliseconds}`, `ISO: ${date.toISOString()}`]
        : [`Unix seconds: ${seconds}`, `Milliseconds: ${milliseconds}`, `ISO: ${date.toISOString()}`];
    return result(
      lines.join('\n'),
      { timestamp: seconds, milliseconds, outputUnit }
    );
  },

  hexToRgb(input) {
    const [r, g, b] = parseHex(input);
    const css = `rgb(${r}, ${g}, ${b})`;
    return result([css, `rgba(${r}, ${g}, ${b}, 1)`, `R: ${r}`, `G: ${g}`, `B: ${b}`].join('\n'), { r, g, b }, undefined, colorPreview('RGB color', css, { r, g, b }));
  },

  rgbToHex(input, options) {
    const [r, g, b] = parseRgb(input);
    const hexCase = selectOption(options, 'hexCase', 'lower');
    const includeHash = booleanOption(options, 'includeHash', true);
    const value = [r, g, b].map((item) => item.toString(16).padStart(2, '0')).join('');
    const cased = hexCase === 'upper' ? value.toUpperCase() : value.toLowerCase();
    const output = `${includeHash ? '#' : ''}${cased}`;
    return result(output, { r, g, b }, undefined, colorPreview('HEX color', output, { r, g, b }));
  },

  rgbToHsl(input) {
    const rgb = parseRgb(input);
    const [h, s, l] = rgbToHslValues(rgb);
    const css = `hsl(${h}, ${s}%, ${l}%)`;
    return result([css, `H: ${h}`, `S: ${s}%`, `L: ${l}%`].join('\n'), { h, s, l }, undefined, colorPreview('HSL color', css, { h, s, l }));
  },

  hslToRgb(input) {
    const hsl = parseHsl(input);
    const [r, g, b] = hslToRgbValues(hsl);
    const css = `rgb(${r}, ${g}, ${b})`;
    return result([css, `R: ${r}`, `G: ${g}`, `B: ${b}`].join('\n'), { r, g, b }, undefined, colorPreview('RGB color', css, { r, g, b }));
  },

  hexToHsl(input) {
    const rgb = parseHex(input);
    const [h, s, l] = rgbToHslValues(rgb);
    const css = `hsl(${h}, ${s}%, ${l}%)`;
    return result([css, `H: ${h}`, `S: ${s}%`, `L: ${l}%`].join('\n'), { h, s, l }, undefined, colorPreview('HSL color', css, { h, s, l }));
  },

  hslToHex(input, options) {
    const rgb = hslToRgbValues(parseHsl(input));
    const hexCase = selectOption(options, 'hexCase', 'lower');
    const includeHash = booleanOption(options, 'includeHash', true);
    const value = rgb.map((item) => item.toString(16).padStart(2, '0')).join('');
    const cased = hexCase === 'upper' ? value.toUpperCase() : value.toLowerCase();
    const output = `${includeHash ? '#' : ''}${cased}`;
    return result(output, { r: rgb[0], g: rgb[1], b: rgb[2] }, undefined, colorPreview('HEX color', output, { r: rgb[0], g: rgb[1], b: rgb[2] }));
  },

  rgbToCmyk(input) {
    const rgb = parseRgb(input);
    const [c, m, y, k] = rgbToCmykValues(rgb);
    const css = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    const output = `cmyk(${c}%, ${m}%, ${y}%, ${k}%)`;
    return result([output, `C: ${c}%`, `M: ${m}%`, `Y: ${y}%`, `K: ${k}%`].join('\n'), { c, m, y, k }, undefined, colorPreview('CMYK color', css, { c, m, y, k }));
  },

  cmykToRgb(input) {
    const cmyk = parseCmyk(input);
    const [r, g, b] = cmykToRgbValues(cmyk);
    const css = `rgb(${r}, ${g}, ${b})`;
    return result([css, `R: ${r}`, `G: ${g}`, `B: ${b}`].join('\n'), { r, g, b }, undefined, colorPreview('RGB color', css, { r, g, b }));
  },

  colorContrastChecker(input) {
    const lines = input.split(/\r\n|\r|\n/).map((line) => line.trim()).filter(Boolean);
    if (lines.length < 2) {
      throw new Error('Color contrast checker expects two colors, one per line, using HEX or RGB.');
    }
    const foreground = parseColorLine(lines[0]);
    const background = parseColorLine(lines[1]);
    const ratio = contrastRatio(foreground, background);
    const ratioText = `${formatNumber(ratio, 2)}:1`;
    const normalAa = ratio >= 4.5;
    const largeAa = ratio >= 3;
    const normalAaa = ratio >= 7;
    const largeAaa = ratio >= 4.5;
    return result([
      `Contrast ratio: ${ratioText}`,
      `WCAG AA normal text: ${normalAa ? 'Pass' : 'Fail'}`,
      `WCAG AA large text: ${largeAa ? 'Pass' : 'Fail'}`,
      `WCAG AAA normal text: ${normalAaa ? 'Pass' : 'Fail'}`,
      `WCAG AAA large text: ${largeAaa ? 'Pass' : 'Fail'}`
    ].join('\n'), { ratio: formatNumber(ratio, 2), normalAa: String(normalAa), largeAa: String(largeAa) });
  },

  cssGradientGenerator(input) {
    const lines = input.split(/\r\n|\r|\n/).map((line) => line.trim()).filter(Boolean);
    if (lines.length < 2) {
      throw new Error('CSS gradient generator expects two colors and an optional angle, one per line.');
    }
    const start = colorToCss(lines[0]);
    const end = colorToCss(lines[1]);
    const rawAngle = lines[2] ?? '90deg';
    const angle = /^\d+(?:deg|turn|rad|grad)?$/i.test(rawAngle) ? rawAngle.replace(/^(\d+)$/i, '$1deg') : '90deg';
    const gradient = `linear-gradient(${angle}, ${start}, ${end})`;
    return result([
      `background: ${gradient};`,
      `background-image: ${gradient};`
    ].join('\n'), { angle, colors: 2 }, undefined, colorPreview('CSS gradient', gradient, { angle }));
  },

  hexOpacityConverter(input) {
    const lines = input.split(/\r\n|\r|\n/).map((line) => line.trim()).filter(Boolean);
    if (lines.length < 2) {
      throw new Error('HEX opacity converter expects a HEX color on line 1 and opacity percent on line 2.');
    }
    const [r, g, b] = parseHex(lines[0]);
    const opacity = Number(lines[1].replace('%', ''));
    if (!Number.isFinite(opacity) || opacity < 0 || opacity > 100) {
      throw new Error('Invalid opacity: enter a number between 0 and 100.');
    }
    const alpha = Math.round((opacity / 100) * 255);
    const hex = `#${[r, g, b, alpha].map((item) => item.toString(16).padStart(2, '0')).join('')}`;
    const rgba = `rgba(${r}, ${g}, ${b}, ${formatNumber(opacity / 100, 2)})`;
    return result([
      `HEX with alpha: ${hex}`,
      `RGBA: ${rgba}`,
      `Alpha channel: ${alpha}`
    ].join('\n'), { opacity, alpha }, undefined, colorPreview('RGBA color', rgba, { opacity, alpha }));
  },

  colorPaletteGenerator(input) {
    const base = parseColorLine(input);
    const tones = [
      ['Light', mixRgb(base, [255, 255, 255], 0.55)],
      ['Soft', mixRgb(base, [255, 255, 255], 0.28)],
      ['Base', base],
      ['Deep', mixRgb(base, [0, 0, 0], 0.22)],
      ['Dark', mixRgb(base, [0, 0, 0], 0.45)]
    ] as const;
    const output = tones.map(([label, rgb]) => `${label}: ${rgbHex(rgb)} rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`).join('\n');
    const css = `rgb(${base[0]}, ${base[1]}, ${base[2]})`;
    return result(output, { colors: tones.length }, undefined, colorPreview('Color palette', css, { colors: tones.length }));
  },

  metaTitleLengthChecker(input) {
    const title = input.trim();
    const length = Array.from(title).length;
    const status = length < 30 ? 'too short' : length <= 60 ? 'good' : 'too long';
    return result([
      `Characters: ${length}`,
      `Recommended range: 30-60 characters`,
      `Remaining to 60: ${Math.max(0, 60 - length)}`,
      `Status: ${status}`
    ].join('\n'), { characters: length, remaining: Math.max(0, 60 - length), status });
  },

  metaDescriptionLengthChecker(input) {
    const description = input.trim();
    const length = Array.from(description).length;
    const status = length < 120 ? 'too short' : length <= 160 ? 'good' : 'too long';
    return result([
      `Characters: ${length}`,
      `Recommended range: 120-160 characters`,
      `Remaining to 160: ${Math.max(0, 160 - length)}`,
      `Status: ${status}`
    ].join('\n'), { characters: length, remaining: Math.max(0, 160 - length), status });
  },

  robotsTxtTester(input) {
    const lines = input.split(/\r\n|\r|\n/).map((line) => line.trim());
    const directives = lines.filter((line) => line && !line.startsWith('#'));
    const userAgents = directives.filter((line) => /^user-agent\s*:/i.test(line));
    const disallow = directives.filter((line) => /^disallow\s*:/i.test(line));
    const allow = directives.filter((line) => /^allow\s*:/i.test(line));
    const sitemaps = directives.filter((line) => /^sitemap\s*:/i.test(line));
    const warnings = [
      userAgents.length ? '' : 'No User-agent directive found.',
      directives.some((line) => /^disallow\s*:\s*\/\s*$/i.test(line)) ? 'Disallow: / blocks all crawlers for that user-agent.' : ''
    ].filter(Boolean);
    return result([
      `User-agent directives: ${userAgents.length}`,
      `Allow directives: ${allow.length}`,
      `Disallow directives: ${disallow.length}`,
      `Sitemap directives: ${sitemaps.length}`,
      `Non-comment directives: ${directives.length}`
    ].join('\n'), { userAgents: userAgents.length, allow: allow.length, disallow: disallow.length, sitemaps: sitemaps.length }, warnings.length ? warnings : undefined);
  },

  sitemapUrlCounter(input) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(input, 'application/xml');
    if (xml.getElementsByTagName('parsererror').length) {
      throw new Error('Invalid sitemap XML: check that the XML is well formed.');
    }
    const urls = Array.from(xml.getElementsByTagName('loc')).map((node) => node.textContent?.trim()).filter(Boolean);
    const uniqueUrls = new Set(urls);
    const hosts = new Set(urls.map((url) => {
      try {
        return new URL(url).hostname;
      } catch {
        return 'invalid-url';
      }
    }));
    return result([
      `URLs: ${urls.length}`,
      `Unique URLs: ${uniqueUrls.size}`,
      `Duplicate URLs: ${urls.length - uniqueUrls.size}`,
      `Hosts: ${[...hosts].join(', ') || 'none'}`
    ].join('\n'), { urls: urls.length, uniqueUrls: uniqueUrls.size, duplicates: urls.length - uniqueUrls.size });
  },

  userAgentParser(input) {
    const userAgent = input.trim();
    if (!userAgent) {
      throw new Error('User agent parser expects a browser, crawler or app user-agent string.');
    }
    const parsed = {
      browser: detectBrowser(userAgent),
      os: detectOs(userAgent),
      device: detectDevice(userAgent),
      isBot: /bot|crawler|spider|crawling/i.test(userAgent),
      raw: userAgent
    };
    return result(JSON.stringify(parsed, null, 2), { isBot: String(parsed.isBot), device: parsed.device }, undefined, jsonPreview(parsed));
  },

  httpStatusLookup(input) {
    const code = Number(input.trim());
    if (!Number.isInteger(code) || code < 100 || code > 599) {
      throw new Error('Invalid HTTP status code: enter a whole number between 100 and 599.');
    }
    const text = httpStatusText[code] ?? 'Unknown status code';
    const family = `${Math.floor(code / 100)}xx`;
    return result([
      `Code: ${code}`,
      `Name: ${text}`,
      `Family: ${family}`
    ].join('\n'), { code, family });
  },

  mimeTypeLookup(input) {
    const raw = input.trim().toLocaleLowerCase().replace(/^\./, '');
    if (!raw) {
      throw new Error('MIME type lookup expects a file extension like json or png.');
    }
    const extension = raw.includes('/') ? Object.entries(mimeTypes).find(([, type]) => type === raw)?.[0] : raw;
    const mime = raw.includes('/') ? raw : mimeTypes[raw];
    if (!mime || !extension) {
      throw new Error(`Unknown MIME type or extension: ${input.trim()}. Try common values like json, png, pdf or text/html.`);
    }
    return result([
      `Extension: .${extension}`,
      `MIME type: ${mime}`
    ].join('\n'), { extension, mime });
  },

  textAlphabetizer(input) {
    const lines = input.split(/\r\n|\r|\n/).map((line) => line.trim()).filter(Boolean);
    if (!lines.length) {
      throw new Error('Text alphabetizer expects at least one line to sort.');
    }
    const output = [...lines].sort((left, right) => left.localeCompare(right, undefined, { sensitivity: 'base', numeric: true })).join('\n');
    return result(output, { lines: lines.length });
  },

  jwtDecoder(input) {
    const parts = input.trim().split('.');
    if (parts.length < 2) throw new Error('Invalid JWT: paste a token with at least header and payload separated by dots.');
    const header = decodeJwtPart(parts[0]);
    const payload = decodeJwtPart(parts[1]);
    return result(
      JSON.stringify({ header, payload, signaturePresent: Boolean(parts[2]) }, null, 2),
      undefined,
      ['This tool decodes JWT content only. It does not verify the signature.'],
      {
        type: 'jwt',
        title: 'JWT payload',
        values: {
          algorithm: typeof header === 'object' && header && 'alg' in header ? String((header as JsonObject).alg) : 'unknown',
          tokenType: typeof header === 'object' && header && 'typ' in header ? String((header as JsonObject).typ) : 'unknown',
          payloadKeys: typeof payload === 'object' && payload ? Object.keys(payload as JsonObject).join(', ') : 'none',
          signaturePresent: Boolean(parts[2])
        }
      }
    );
  },

  jwtExpirationChecker(input) {
    const parts = input.trim().split('.');
    if (parts.length < 2) throw new Error('Invalid JWT: paste a token with at least header and payload separated by dots.');
    const payload = decodeJwtPart(parts[1]);
    if (!payload || typeof payload !== 'object') {
      throw new Error('Invalid JWT: payload must be a JSON object.');
    }
    const exp = (payload as JsonObject).exp;
    if (typeof exp !== 'number') {
      throw new Error('JWT payload does not include a numeric exp claim.');
    }
    const expiresAt = new Date(exp * 1000);
    const now = Date.now();
    const secondsRemaining = Math.floor((expiresAt.getTime() - now) / 1000);
    const status = secondsRemaining > 0 ? 'valid' : 'expired';
    return result([
      `Status: ${status}`,
      `Expires at UTC: ${expiresAt.toISOString()}`,
      `Unix exp: ${exp}`,
      `Seconds remaining: ${secondsRemaining}`
    ].join('\n'), { exp, secondsRemaining, status }, ['This tool decodes JWT content only. It does not verify the signature.']);
  }
};

export function convert(converterId: string, input: string, options: ConverterOptions = {}): ConvertResult {
  const converter = converterFunctions[converterId];
  if (!converter) {
    throw new Error(`Unknown converter: ${converterId}`);
  }
  return converter(input, options);
}
