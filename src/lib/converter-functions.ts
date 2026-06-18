import { parse, stringify } from 'yaml';
import type { ConvertResult } from '../types';

type JsonObject = Record<string, unknown>;
type ConverterFunction = (input: string) => ConvertResult;

function result(output: string, metadata?: Record<string, string | number>, warnings?: string[]): ConvertResult {
  return { output, metadata, warnings };
}

function parseJson(input: string): unknown {
  return JSON.parse(input);
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
    throw new Error('Malformed CSV: unmatched quote.');
  }

  currentRow.push(current);
  rows.push(currentRow);
  return rows;
}

function encodeBase64(input: string): string {
  return btoa(String.fromCharCode(...new TextEncoder().encode(input)));
}

function decodeBase64(input: string): string {
  const binary = atob(input.trim());
  return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));
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
    throw new Error('RGB input must include three values.');
  }
  const values = matches.slice(0, 3).map((value) => Number(value));
  if (values.some((value) => Number.isNaN(value) || value < 0 || value > 255)) {
    throw new Error('RGB values must be between 0 and 255.');
  }
  return values.map((value) => Math.round(value)) as [number, number, number];
}

function parseHex(input: string): [number, number, number] {
  const hex = input.trim().replace(/^#/, '');
  const normalized = hex.length === 3 ? hex.split('').map((char) => char + char).join('') : hex;
  if (!/^[0-9a-f]{6}$/i.test(normalized)) {
    throw new Error('HEX input must be 3 or 6 hexadecimal characters.');
  }
  return [
    parseInt(normalized.slice(0, 2), 16),
    parseInt(normalized.slice(2, 4), 16),
    parseInt(normalized.slice(4, 6), 16)
  ];
}

function decodeJwtPart(part: string): unknown {
  const padded = part.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(part.length / 4) * 4, '=');
  return JSON.parse(decodeBase64(padded));
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

    return result(JSON.stringify(records, null, 2), { rows: records.length, columns: headers.length });
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
      throw new Error('Invalid XML format.');
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

  jsonFormatter(input) {
    const output = JSON.stringify(parseJson(input), null, 2);
    return result(output, countStats(output));
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

  urlEncode(input) {
    return result(encodeURIComponent(input), { characters: input.length });
  },

  urlDecode(input) {
    const output = decodeURIComponent(input);
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
    return result(output, { ...stats, readingMinutes });
  },

  sortLines(input) {
    const output = input.split(/\r\n|\r|\n/).sort((a, b) => a.localeCompare(b)).join('\n');
    return result(output, countStats(output));
  },

  removeDuplicateLines(input) {
    const seen = new Set<string>();
    const lines = input.split(/\r\n|\r|\n/).filter((line) => {
      if (seen.has(line)) return false;
      seen.add(line);
      return true;
    });
    return result(lines.join('\n'), { lines: lines.length, removed: input.split(/\r\n|\r|\n/).length - lines.length });
  },

  timestampToDate(input) {
    const raw = Number(input.trim());
    if (Number.isNaN(raw)) throw new Error('Timestamp must be a number.');
    const milliseconds = raw < 100000000000 ? raw * 1000 : raw;
    const date = new Date(milliseconds);
    if (Number.isNaN(date.getTime())) throw new Error('Invalid timestamp.');
    return result(
      [`UTC: ${date.toISOString()}`, `Local: ${date.toString()}`, `Unix seconds: ${Math.floor(milliseconds / 1000)}`, `Milliseconds: ${milliseconds}`].join('\n'),
      { timestamp: Math.floor(milliseconds / 1000) }
    );
  },

  dateToTimestamp(input) {
    const date = new Date(input.trim());
    if (Number.isNaN(date.getTime())) throw new Error('Invalid date.');
    return result(
      [`Unix seconds: ${Math.floor(date.getTime() / 1000)}`, `Milliseconds: ${date.getTime()}`, `ISO: ${date.toISOString()}`].join('\n'),
      { timestamp: Math.floor(date.getTime() / 1000) }
    );
  },

  hexToRgb(input) {
    const [r, g, b] = parseHex(input);
    return result([`rgb(${r}, ${g}, ${b})`, `rgba(${r}, ${g}, ${b}, 1)`, `R: ${r}`, `G: ${g}`, `B: ${b}`].join('\n'), { r, g, b });
  },

  rgbToHex(input) {
    const [r, g, b] = parseRgb(input);
    const output = `#${[r, g, b].map((value) => value.toString(16).padStart(2, '0')).join('')}`;
    return result(output, { r, g, b });
  },

  jwtDecoder(input) {
    const parts = input.trim().split('.');
    if (parts.length < 2) throw new Error('JWT must include header and payload.');
    const header = decodeJwtPart(parts[0]);
    const payload = decodeJwtPart(parts[1]);
    return result(
      JSON.stringify({ header, payload, signaturePresent: Boolean(parts[2]) }, null, 2),
      undefined,
      ['This tool decodes JWT content only. It does not verify the signature.']
    );
  }
};

export function convert(converterId: string, input: string): ConvertResult {
  const converter = converterFunctions[converterId];
  if (!converter) {
    throw new Error(`Unknown converter: ${converterId}`);
  }
  return converter(input);
}
