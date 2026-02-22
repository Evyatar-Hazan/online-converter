export function csvToJson(csvData: string): string {
    if (typeof csvData !== 'string') {
        throw new Error('CSV input must be a string.');
    }
    const normalized = csvData.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
    if (!normalized) return '[]';
    const rows: string[][] = [];
    let current = '';
    let currentRow: string[] = [];
    let inQuotes = false;
    for (let i = 0; i < normalized.length; i++) {
        const char = normalized[i];
        const next = normalized[i + 1];
        if (char === '"') {
            if (inQuotes && next === '"') {
                current += '"';
                i++;
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
    currentRow.push(current);
    rows.push(currentRow);
    if (inQuotes) {
        throw new Error('Malformed CSV: unmatched quote.');
    }
    if (rows.length === 0 || rows[0].length === 0) {
        throw new Error('CSV must include a header row.');
    }
    const headers = rows[0].map(h => h.trim());
    if (headers.some(h => !h)) {
        throw new Error('CSV headers cannot be empty.');
    }
    const dataRows = rows.slice(1).filter(r => r.some(cell => cell.trim() !== ''));
    const records = dataRows.map(row => {
        const obj: Record<string, string> = {};
        headers.forEach((header, index) => {
            const value = row[index] === undefined ? '' : row[index];
            obj[header] = value;
        });
        return obj;
    });
    return JSON.stringify(records, null, 2);
}
