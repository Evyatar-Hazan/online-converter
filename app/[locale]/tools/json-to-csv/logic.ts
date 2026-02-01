/**
 * JSON to CSV Converter Logic
 * Pure function that converts JSON array to CSV format
 * No side effects, no dependencies
 */

export function convertJsonToCsv(jsonInput: string): string {
  try {
    // Parse the JSON
    const data = JSON.parse(jsonInput.trim());

    // Handle non-array data
    if (!Array.isArray(data)) {
      throw new Error('Input must be a JSON array');
    }

    if (data.length === 0) {
      throw new Error('JSON array cannot be empty');
    }

    // Extract headers from first object
    const firstItem = data[0];
    if (typeof firstItem !== 'object' || firstItem === null) {
      throw new Error('Array items must be objects');
    }

    const headers = Object.keys(firstItem);

    // Create CSV header row
    const csvHeader = headers.map(escapeCSVValue).join(',');

    // Create CSV data rows
    const csvRows = data.map((item) => {
      if (typeof item !== 'object' || item === null) {
        throw new Error('All array items must be objects');
      }

      return headers
        .map((header) => {
          const value = item[header];
          return escapeCSVValue(formatValue(value));
        })
        .join(',');
    });

    // Combine header and rows
    return [csvHeader, ...csvRows].join('\n');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid JSON';
    throw new Error(`JSON parsing error: ${message}`);
  }
}

/**
 * Escape CSV values according to RFC 4180
 * If value contains comma, newline, or double quote, wrap in quotes and escape quotes
 */
function escapeCSVValue(value: string): string {
  if (value.includes(',') || value.includes('\n') || value.includes('"')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Format values for CSV
 * Convert objects/arrays to JSON, handle null/undefined
 */
function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  if (typeof value === 'number') {
    return String(value);
  }

  // For objects and arrays, convert to JSON string
  return JSON.stringify(value);
}
