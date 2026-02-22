function isPrimitive(val: any): boolean {
    return val === null || typeof val !== 'object';
}

function escapeXml(value: any): string {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function formatValue(val: any, level: number): string {
    const indent = '  '.repeat(level);
    const nextLevel = level + 1;
    if (Array.isArray(val)) {
        if (val.length === 0) {
            return `${indent}<item></item>`;
        }
        return val
            .map(item => {
                if (isPrimitive(item)) {
                    return `${indent}<item>${escapeXml(item ?? '')}</item>`;
                }
                const inner = formatValue(item, nextLevel);
                return `${indent}<item>\n${inner}\n${indent}</item>`;
            })
            .join('\n');
    }
    if (val && typeof val === 'object') {
        const keys = Object.keys(val);
        if (keys.length === 0) {
            return `${indent}`;
        }
        return keys
            .map(key => {
                const child = val[key];
                if (isPrimitive(child)) {
                    return `${indent}<${key}>${escapeXml(child ?? '')}</${key}>`;
                }
                const inner = formatValue(child, nextLevel);
                if (!inner.trim()) {
                    return `${indent}<${key}></${key}>`;
                }
                return `${indent}<${key}>\n${inner}\n${indent}</${key}>`;
            })
            .join('\n');
    }
    return `${indent}${escapeXml(val ?? '')}`;
}

export function jsonToXml(jsonData: string | Record<string, any>, rootName: string = 'root'): string {
    const parsedRoot = typeof rootName === 'string' && rootName.trim() ? rootName.trim() : 'root';
    let data: any;
    try {
        data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    } catch (e) {
        throw new Error('Invalid JSON format.');
    }
    if (data === undefined) {
        return `<${parsedRoot}></${parsedRoot}>`;
    }
    if (isPrimitive(data)) {
        const safeValue = escapeXml(data ?? '');
        return `<${parsedRoot}>${safeValue}</${parsedRoot}>`;
    }
    const body = formatValue(data, 1);
    if (!body.trim()) {
        return `<${parsedRoot}></${parsedRoot}>`;
    }
    return `<${parsedRoot}>\n${body}\n</${parsedRoot}>`;
}
