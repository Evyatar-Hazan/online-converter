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

function csvRows(input: string): string[][] {
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
    } else if (char === ',' && !inQuotes) {
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

function encodeBase64(input: string): string {
  return btoa(String.fromCharCode(...new TextEncoder().encode(input)));
}

function decodeBase64(input: string): string {
  const normalized = input.trim().replace(/\s+/g, '');
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

function decodeJwtPart(part: string): unknown {
  const padded = part.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(part.length / 4) * 4, '=');
  try {
    return JSON.parse(decodeBase64(padded));
  } catch {
    throw new Error('Invalid JWT: header or payload is not valid Base64URL JSON.');
  }
}

export const converterFunctions: Record<string, ConverterFunction> = {
  jsonToCsv(input) {
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
      headerArray.join(','),
      ...items.map((item) =>
        headerArray
          .map((header) => {
            if (!item || typeof item !== 'object' || Array.isArray(item)) return '';
            const value = (item as JsonObject)[header];
            if (value === undefined || value === null) return '';
            const text = typeof value === 'object' ? JSON.stringify(value) : String(value);
            return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
          })
          .join(',')
      )
    ];

    return result(rows.join('\n'), { rows: Math.max(items.length, 0), columns: headerArray.length });
  },

  csvToJson(input) {
    const rows = csvRows(input);
    if (!rows.length) return result('[]', { rows: 0, columns: 0 });

    const headers = rows[0].map((header) => header.trim());
    if (headers.some((header) => !header)) {
      throw new Error('CSV headers cannot be empty.');
    }

    const records = rows.slice(1).filter((row) => row.some((cell) => cell.trim() !== '')).map((row) => {
      const record: Record<string, string> = {};
      headers.forEach((header, index) => {
        record[header] = row[index] ?? '';
      });
      return record;
    });

    return result(JSON.stringify(records, null, 2), { rows: records.length, columns: headers.length }, undefined, {
      type: 'table',
      title: 'CSV preview',
      values: { rows: records.length, columns: headers.length },
      rows: records.slice(0, 5)
    });
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

  jsonMinifier(input) {
    const output = JSON.stringify(parseJson(input));
    return result(output, { characters: output.length });
  },

  base64Encode(input) {
    const output = encodeBase64(input);
    return result(output, { characters: output.length });
  },

  base64Decode(input) {
    const output = decodeBase64(input);
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

  urlEncode(input) {
    return result(encodeURIComponent(input), { characters: input.length });
  },

  urlDecode(input) {
    let output = '';
    try {
      output = decodeURIComponent(input);
    } catch {
      throw new Error('Invalid URL encoding: percent escapes must use two hexadecimal characters, like %20.');
    }
    return result(output, countStats(output));
  },

  htmlEscape(input) {
    const output = escapeHtml(input);
    return result(output, { characters: output.length });
  },

  htmlUnescape(input) {
    const output = unescapeHtml(input);
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

  slugGenerator(input) {
    const output = slugify(input);
    return result(output, { characters: output.length });
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

  rgbToHex(input) {
    const [r, g, b] = parseRgb(input);
    const output = `#${[r, g, b].map((value) => value.toString(16).padStart(2, '0')).join('')}`;
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
  }
};

export function convert(converterId: string, input: string, options: ConverterOptions = {}): ConvertResult {
  const converter = converterFunctions[converterId];
  if (!converter) {
    throw new Error(`Unknown converter: ${converterId}`);
  }
  return converter(input, options);
}
