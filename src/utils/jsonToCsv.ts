type JsonObject = Record<string, unknown>;

export function jsonToCsv(jsonData: string | JsonObject | JsonObject[]): string {
    let data: unknown;
    try {
        data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    } catch {
        throw new Error('Invalid JSON format.');
    }
    if (!data) return '';
    const items = Array.isArray(data) ? data : [data];
    if (items.length === 0) return '';
    const headers = new Set<string>();
    items.forEach(item => {
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
            Object.keys(item).forEach(key => headers.add(key));
        }
    });
    if (headers.size === 0) return '';
    const headerArray = Array.from(headers);
    const csvRows: string[] = [];
    csvRows.push(headerArray.join(','));
    items.forEach(item => {
        const row = headerArray.map(header => {
            if (typeof item !== 'object' || item === null || Array.isArray(item)) {
                return '';
            }
            const val = (item as JsonObject)[header];
            if (val === undefined || val === null) {
                return '';
            }
            let stringVal = String(val);
            if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n')) {
                stringVal = `"${stringVal.replace(/"/g, '""')}"`;
            }
            return stringVal;
        });
        csvRows.push(row.join(','));
    });
    return csvRows.join('\n');
}
