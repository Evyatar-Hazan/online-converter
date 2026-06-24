import type { ConverterTool } from '../types';

const faq = {
  private: {
    question: {
      en: 'Is my data uploaded to a server?',
      he: 'האם הנתונים נשלחים לשרת?'
    },
    answer: {
      en: 'No. The conversion runs in your browser, so your input does not need to leave your device.',
      he: 'לא. ההמרה רצה בדפדפן שלך, כך שהקלט לא צריך לצאת מהמכשיר.'
    }
  },
  free: {
    question: {
      en: 'Can I use this converter for free?',
      he: 'אפשר להשתמש בממיר בחינם?'
    },
    answer: {
      en: 'Yes. The tools are free to use, with simple advertising that helps keep the site available.',
      he: 'כן. הכלים חינמיים, עם פרסום פשוט שעוזר להשאיר את האתר זמין.'
    }
  }
};

const jsonIndentOptions = [
  {
    id: 'indent',
    type: 'select' as const,
    defaultValue: '2',
    label: { en: 'Indent size', he: 'גודל הזחה' },
    choices: [
      { value: '2', label: { en: '2 spaces', he: '2 רווחים' } },
      { value: '4', label: { en: '4 spaces', he: '4 רווחים' } }
    ]
  }
];

const csvOutputOptions = [
  {
    id: 'delimiter',
    type: 'select' as const,
    defaultValue: ',',
    label: { en: 'Delimiter', he: 'מפריד' },
    choices: [
      { value: ',', label: { en: 'Comma', he: 'פסיק' } },
      { value: ';', label: { en: 'Semicolon', he: 'נקודה-פסיק' } },
      { value: '\t', label: { en: 'Tab', he: 'טאב' } }
    ]
  }
];

const csvInputOptions = [
  ...csvOutputOptions,
  {
    id: 'trimValues',
    type: 'toggle' as const,
    defaultValue: true,
    label: { en: 'Trim values', he: 'נקה ערכים' }
  }
];

const base64EncodeOptions = [
  {
    id: 'urlSafe',
    type: 'toggle' as const,
    defaultValue: false,
    label: { en: 'URL-safe output', he: 'פלט בטוח ל־URL' }
  },
  {
    id: 'omitPadding',
    type: 'toggle' as const,
    defaultValue: false,
    label: { en: 'Omit padding', he: 'בלי סימני padding' }
  }
];

const base64DecodeOptions = [
  {
    id: 'urlSafe',
    type: 'toggle' as const,
    defaultValue: false,
    label: { en: 'URL-safe input', he: 'קלט בטוח ל־URL' }
  }
];

const urlEncodeOptions = [
  {
    id: 'spaceAsPlus',
    type: 'toggle' as const,
    defaultValue: false,
    label: { en: 'Spaces as +', he: 'רווחים כ־+' }
  }
];

const urlDecodeOptions = [
  {
    id: 'plusAsSpace',
    type: 'toggle' as const,
    defaultValue: true,
    label: { en: '+ as space', he: '+ כרווח' }
  }
];

const hexOutputOptions = [
  {
    id: 'hexCase',
    type: 'select' as const,
    defaultValue: 'lower',
    label: { en: 'HEX case', he: 'אותיות HEX' },
    choices: [
      { value: 'lower', label: { en: 'Lowercase', he: 'אותיות קטנות' } },
      { value: 'upper', label: { en: 'Uppercase', he: 'אותיות גדולות' } }
    ]
  },
  {
    id: 'includeHash',
    type: 'toggle' as const,
    defaultValue: true,
    label: { en: 'Include #', he: 'כולל #' }
  }
];

const lineSortOptions = [
  {
    id: 'direction',
    type: 'select' as const,
    defaultValue: 'asc',
    label: { en: 'Sort order', he: 'סדר מיון' },
    choices: [
      { value: 'asc', label: { en: 'A to Z', he: 'א-ת' } },
      { value: 'desc', label: { en: 'Z to A', he: 'ת-א' } }
    ]
  },
  {
    id: 'caseSensitive',
    type: 'toggle' as const,
    defaultValue: true,
    label: { en: 'Case sensitive', he: 'רגיש לאותיות גדולות' }
  },
  {
    id: 'trimLines',
    type: 'toggle' as const,
    defaultValue: false,
    label: { en: 'Trim lines first', he: 'נקה רווחים לפני פעולה' }
  }
];

const duplicateLineOptions = [
  {
    id: 'caseSensitive',
    type: 'toggle' as const,
    defaultValue: true,
    label: { en: 'Case sensitive', he: 'רגיש לאותיות גדולות' }
  },
  {
    id: 'trimLines',
    type: 'toggle' as const,
    defaultValue: false,
    label: { en: 'Trim lines first', he: 'נקה רווחים לפני פעולה' }
  }
];

const whitespaceOptions = [
  {
    id: 'collapseSpaces',
    type: 'toggle' as const,
    defaultValue: false,
    label: { en: 'Collapse repeated spaces', he: 'צמצם רווחים כפולים' }
  }
];

const timestampInputOptions = [
  {
    id: 'inputUnit',
    type: 'select' as const,
    defaultValue: 'auto',
    label: { en: 'Timestamp unit', he: 'יחידת timestamp' },
    choices: [
      { value: 'auto', label: { en: 'Auto detect', he: 'זיהוי אוטומטי' } },
      { value: 'seconds', label: { en: 'Seconds', he: 'שניות' } },
      { value: 'milliseconds', label: { en: 'Milliseconds', he: 'מילישניות' } }
    ]
  }
];

const timestampOutputOptions = [
  {
    id: 'outputUnit',
    type: 'select' as const,
    defaultValue: 'both',
    label: { en: 'Output unit', he: 'יחידת פלט' },
    choices: [
      { value: 'both', label: { en: 'Seconds and ms', he: 'שניות ומילישניות' } },
      { value: 'seconds', label: { en: 'Seconds only', he: 'שניות בלבד' } },
      { value: 'milliseconds', label: { en: 'Milliseconds only', he: 'מילישניות בלבד' } }
    ]
  }
];

export const converters: ConverterTool[] = [
  {
    slug: 'json-to-csv',
    converterId: 'jsonToCsv',
    reverseSlug: 'csv-to-json',
    category: 'data',
    inputType: 'json',
    outputType: 'csv',
    popular: true,
    title: { en: 'JSON to CSV Converter', he: 'ממיר JSON ל־CSV' },
    shortTitle: { en: 'JSON to CSV', he: 'JSON ל־CSV' },
    description: {
      en: 'Turn JSON arrays and objects into clean CSV files for spreadsheets, reporting and analysis.',
      he: 'המר מערכי ואובייקטי JSON לקובצי CSV נקיים עבור גיליונות, דוחות וניתוח נתונים.'
    },
    metaDescription: {
      en: 'Free JSON to CSV converter with Hebrew and English UI. Convert locally in your browser with examples, copy and download.',
      he: 'ממיר JSON ל־CSV חינמי בעברית ובאנגלית. ההמרה מתבצעת בדפדפן עם דוגמאות, העתקה והורדה.'
    },
    keywords: {
      en: ['json to csv', 'convert json to csv', 'json csv converter'],
      he: ['ממיר JSON ל CSV', 'המרת JSON ל CSV', 'JSON ל CSV']
    },
    features: {
      en: ['Handles arrays', 'Escapes commas and quotes', 'Download CSV'],
      he: ['תומך במערכים', 'מטפל בפסיקים ומרכאות', 'הורדת CSV']
    },
    guide: {
      en: ['Paste a JSON object or array.', 'Click Convert or keep Auto enabled.', 'Copy the CSV or download it as a file.'],
      he: ['הדבק אובייקט או מערך JSON.', 'לחץ המרה או השאר מצב אוטומטי פעיל.', 'העתק את ה־CSV או הורד אותו כקובץ.']
    },
    examples: [
      { label: { en: 'Users table', he: 'טבלת משתמשים' }, input: '[{"name":"Avi","city":"Jerusalem"},{"name":"Maya","city":"Tel Aviv"}]' },
      { label: { en: 'Nested values', he: 'ערכים מקוננים' }, input: '[{"name":"Avi","tags":["admin","editor"]},{"name":"Maya","tags":["viewer"]}]' }
    ],
    options: csvOutputOptions,
    faq: [faq.private, faq.free],
    related: ['csv-to-json', 'json-to-yaml', 'json-formatter']
  },
  {
    slug: 'csv-to-json',
    converterId: 'csvToJson',
    reverseSlug: 'json-to-csv',
    category: 'data',
    inputType: 'csv',
    outputType: 'json',
    popular: true,
    title: { en: 'CSV to JSON Converter', he: 'ממיר CSV ל־JSON' },
    shortTitle: { en: 'CSV to JSON', he: 'CSV ל־JSON' },
    description: {
      en: 'Parse CSV headers and rows into structured JSON for APIs, scripts and data workflows.',
      he: 'פענח כותרות ושורות CSV למבנה JSON עבור API, סקריפטים ותהליכי נתונים.'
    },
    metaDescription: {
      en: 'Convert CSV to JSON online in your browser. Supports quotes, commas, Hebrew text and instant copy/download.',
      he: 'המרת CSV ל־JSON בדפדפן. תומך במרכאות, פסיקים, עברית, העתקה והורדה מידית.'
    },
    keywords: { en: ['csv to json', 'convert csv json'], he: ['CSV ל JSON', 'ממיר CSV ל JSON'] },
    features: { en: ['Header mapping', 'Quoted values', 'Pretty JSON'], he: ['מיפוי כותרות', 'ערכים במרכאות', 'JSON קריא'] },
    guide: { en: ['Paste CSV with a header row.', 'Convert to JSON.', 'Use the result in APIs or scripts.'], he: ['הדבק CSV עם שורת כותרות.', 'המר ל־JSON.', 'השתמש בתוצאה ב־API או סקריפטים.'] },
    examples: [
      { label: { en: 'People CSV', he: 'CSV אנשים' }, input: 'name,city\nAvi,Jerusalem\nMaya,Tel Aviv' },
      { label: { en: 'Quoted commas', he: 'פסיקים במרכאות' }, input: 'name,note\nAvi,"Jerusalem, Israel"\nMaya,"Tel Aviv, Israel"' }
    ],
    options: csvInputOptions,
    faq: [faq.private, faq.free],
    related: ['json-to-csv', 'json-formatter', 'yaml-to-json']
  },
  {
    slug: 'json-to-xml',
    converterId: 'jsonToXml',
    reverseSlug: 'xml-to-json',
    category: 'data',
    inputType: 'json',
    outputType: 'xml',
    title: { en: 'JSON to XML Converter', he: 'ממיר JSON ל־XML' },
    shortTitle: { en: 'JSON to XML', he: 'JSON ל־XML' },
    description: { en: 'Convert JSON payloads into readable XML with escaped values and nested structures.', he: 'המר JSON ל־XML קריא עם תווים מאובטחים ומבנים מקוננים.' },
    metaDescription: { en: 'Free JSON to XML converter. Convert nested JSON into XML locally with Hebrew and English support.', he: 'ממיר JSON ל־XML חינמי. המרת JSON מקונן ל־XML מקומית עם תמיכה בעברית ואנגלית.' },
    keywords: { en: ['json to xml', 'json xml converter'], he: ['JSON ל XML', 'ממיר JSON ל XML'] },
    features: { en: ['Nested objects', 'Array items', 'XML escaping'], he: ['אובייקטים מקוננים', 'פריטי מערך', 'המלטת XML'] },
    guide: { en: ['Paste valid JSON.', 'Convert to XML.', 'Copy or download the XML output.'], he: ['הדבק JSON תקין.', 'המר ל־XML.', 'העתק או הורד את פלט ה־XML.'] },
    examples: [{ label: { en: 'Product XML', he: 'XML מוצר' }, input: '{"product":{"name":"Plan","price":29}}' }],
    faq: [faq.private, faq.free],
    related: ['xml-to-json', 'json-formatter', 'json-to-yaml']
  },
  {
    slug: 'xml-to-json',
    converterId: 'xmlToJson',
    reverseSlug: 'json-to-xml',
    category: 'data',
    inputType: 'xml',
    outputType: 'json',
    title: { en: 'XML to JSON Converter', he: 'ממיר XML ל־JSON' },
    shortTitle: { en: 'XML to JSON', he: 'XML ל־JSON' },
    description: { en: 'Transform XML elements and attributes into clean JSON for modern applications.', he: 'המר אלמנטים ותכונות XML ל־JSON נקי עבור אפליקציות מודרניות.' },
    metaDescription: { en: 'Convert XML to JSON online, including attributes and nested elements, with bilingual English and Hebrew UI.', he: 'המרת XML ל־JSON כולל תכונות ואלמנטים מקוננים, בממשק עברית ואנגלית.' },
    keywords: { en: ['xml to json', 'convert xml json'], he: ['XML ל JSON', 'ממיר XML ל JSON'] },
    features: { en: ['Attributes', 'Nested nodes', 'Pretty output'], he: ['תכונות XML', 'צמתים מקוננים', 'פלט קריא'] },
    guide: { en: ['Paste XML.', 'Convert to JSON.', 'Review attributes marked with @ prefixes.'], he: ['הדבק XML.', 'המר ל־JSON.', 'בדוק תכונות המסומנות עם @.'] },
    examples: [{ label: { en: 'Book XML', he: 'XML ספר' }, input: '<book id="1"><title>Guide</title><pages>120</pages></book>' }],
    faq: [faq.private, faq.free],
    related: ['json-to-xml', 'json-formatter', 'csv-to-json']
  },
  {
    slug: 'json-to-yaml',
    converterId: 'jsonToYaml',
    reverseSlug: 'yaml-to-json',
    category: 'data',
    inputType: 'json',
    outputType: 'yaml',
    popular: true,
    title: { en: 'JSON to YAML Converter', he: 'ממיר JSON ל־YAML' },
    shortTitle: { en: 'JSON to YAML', he: 'JSON ל־YAML' },
    description: { en: 'Convert JSON into readable YAML for configuration files, DevOps and documentation.', he: 'המר JSON ל־YAML קריא עבור קבצי הגדרות, DevOps ותיעוד.' },
    metaDescription: { en: 'Convert JSON to YAML online with a fast browser-based tool and bilingual Hebrew/English interface.', he: 'ממיר JSON ל־YAML אונליין עם כלי מהיר בדפדפן ותמיכה מלאה בעברית ובאנגלית.' },
    keywords: { en: ['json to yaml', 'json yaml converter'], he: ['JSON ל YAML', 'ממיר JSON ל YAML'] },
    features: { en: ['Readable YAML', 'Config friendly', 'No upload'], he: ['YAML קריא', 'מתאים לקונפיגורציה', 'בלי העלאה'] },
    guide: { en: ['Paste JSON.', 'Convert to YAML.', 'Use the output in config files.'], he: ['הדבק JSON.', 'המר ל־YAML.', 'השתמש בפלט בקבצי הגדרות.'] },
    examples: [{ label: { en: 'Config object', he: 'אובייקט הגדרות' }, input: '{"app":"converter","enabled":true,"ports":[80,443]}' }],
    faq: [faq.private, faq.free],
    related: ['yaml-to-json', 'json-formatter', 'json-to-csv']
  },
  {
    slug: 'yaml-to-json',
    converterId: 'yamlToJson',
    reverseSlug: 'json-to-yaml',
    category: 'data',
    inputType: 'yaml',
    outputType: 'json',
    title: { en: 'YAML to JSON Converter', he: 'ממיר YAML ל־JSON' },
    shortTitle: { en: 'YAML to JSON', he: 'YAML ל־JSON' },
    description: { en: 'Convert YAML documents into formatted JSON for APIs and developer tooling.', he: 'המר מסמכי YAML ל־JSON מעוצב עבור API וכלי פיתוח.' },
    metaDescription: { en: 'Free YAML to JSON converter that runs locally in your browser and supports Hebrew and English.', he: 'ממיר YAML ל־JSON חינמי שרץ בדפדפן ותומך בעברית ובאנגלית.' },
    keywords: { en: ['yaml to json', 'convert yaml json'], he: ['YAML ל JSON', 'ממיר YAML ל JSON'] },
    features: { en: ['Strict parsing', 'Pretty JSON', 'Config friendly'], he: ['פענוח קפדני', 'JSON קריא', 'מתאים להגדרות'] },
    guide: { en: ['Paste YAML.', 'Convert to JSON.', 'Copy or download the formatted result.'], he: ['הדבק YAML.', 'המר ל־JSON.', 'העתק או הורד את התוצאה המעוצבת.'] },
    examples: [{ label: { en: 'YAML config', he: 'קונפיג YAML' }, input: 'app: converter\nenabled: true\nports:\n  - 80\n  - 443' }],
    faq: [faq.private, faq.free],
    related: ['json-to-yaml', 'json-formatter', 'csv-to-json']
  },
  {
    slug: 'json-formatter',
    converterId: 'jsonFormatter',
    category: 'developer',
    inputType: 'json',
    outputType: 'json',
    popular: true,
    title: { en: 'JSON Formatter and Validator', he: 'מעצב ומאמת JSON' },
    shortTitle: { en: 'JSON Formatter', he: 'עיצוב JSON' },
    description: { en: 'Format, validate and beautify JSON with clear indentation.', he: 'עיצוב, אימות וייפוי JSON עם הזחה נקייה.' },
    metaDescription: { en: 'Format and validate JSON online in your browser with bilingual English and Hebrew support.', he: 'עיצוב ואימות JSON אונליין בדפדפן עם תמיכה בעברית ובאנגלית.' },
    keywords: { en: ['json formatter', 'json validator'], he: ['עיצוב JSON', 'מאמת JSON'] },
    features: { en: ['Pretty print', 'Validation', 'Clean output'], he: ['הדפסה יפה', 'אימות', 'פלט נקי'] },
    guide: { en: ['Paste JSON.', 'Convert to format it.', 'Fix any validation error shown by the tool.'], he: ['הדבק JSON.', 'לחץ המרה כדי לעצב.', 'תקן שגיאות אימות אם מופיעות.'] },
    examples: [
      { label: { en: 'Compact JSON', he: 'JSON דחוס' }, input: '{"name":"Dana","items":[1,2,3]}' },
      { label: { en: 'API response', he: 'תגובת API' }, input: '{"ok":true,"data":{"count":2,"items":["he","en"]}}' }
    ],
    options: jsonIndentOptions,
    faq: [faq.private, faq.free],
    related: ['json-minifier', 'json-to-csv', 'yaml-to-json']
  },
  {
    slug: 'json-minifier',
    converterId: 'jsonMinifier',
    category: 'developer',
    inputType: 'json',
    outputType: 'json',
    title: { en: 'JSON Minifier', he: 'מכווץ JSON' },
    shortTitle: { en: 'JSON Minifier', he: 'כיווץ JSON' },
    description: { en: 'Remove whitespace from JSON while keeping it valid.', he: 'הסר רווחים מ־JSON תוך שמירה על תקינות.' },
    metaDescription: { en: 'Minify JSON online with a fast local browser tool for compact API payloads.', he: 'כיווץ JSON אונליין באמצעות כלי מהיר שרץ בדפדפן.' },
    keywords: { en: ['json minifier', 'minify json'], he: ['כיווץ JSON', 'JSON מיניפייר'] },
    features: { en: ['Smaller output', 'Validation', 'Instant'], he: ['פלט קטן', 'אימות', 'מידי'] },
    guide: { en: ['Paste formatted JSON.', 'Convert to minify.', 'Copy the compact JSON.'], he: ['הדבק JSON מעוצב.', 'המר לכיווץ.', 'העתק את ה־JSON הדחוס.'] },
    examples: [{ label: { en: 'Formatted JSON', he: 'JSON מעוצב' }, input: '{\n  "name": "Dana",\n  "active": true\n}' }],
    faq: [faq.private, faq.free],
    related: ['json-formatter', 'json-to-yaml']
  },
  {
    slug: 'base64-encode',
    converterId: 'base64Encode',
    reverseSlug: 'base64-decode',
    category: 'encoding',
    inputType: 'text',
    outputType: 'base64',
    popular: true,
    title: { en: 'Base64 Encoder', he: 'מקודד Base64' },
    shortTitle: { en: 'Base64 Encode', he: 'קידוד Base64' },
    description: { en: 'Encode plain text into Base64 for URLs, scripts and data payloads.', he: 'קודד טקסט רגיל ל־Base64 עבור URL, סקריפטים ומטעני נתונים.' },
    metaDescription: { en: 'Encode text to Base64 online with Unicode and Hebrew support.', he: 'קידוד טקסט ל־Base64 אונליין עם תמיכה ביוניקוד ובעברית.' },
    keywords: { en: ['base64 encode', 'base64 encoder'], he: ['קידוד Base64', 'מקודד Base64'] },
    features: { en: ['Unicode safe', 'Copy result', 'No upload'], he: ['תומך Unicode', 'העתקת תוצאה', 'בלי העלאה'] },
    guide: { en: ['Paste text.', 'Encode to Base64.', 'Copy the encoded result.'], he: ['הדבק טקסט.', 'קודד ל־Base64.', 'העתק את התוצאה המקודדת.'] },
    examples: [
      { label: { en: 'Unicode text', he: 'טקסט Unicode' }, input: 'Hello שלום' },
      { label: { en: 'URL text', he: 'טקסט לקישור' }, input: 'email=test@example.com&lang=he' }
    ],
    options: base64EncodeOptions,
    faq: [faq.private, faq.free],
    related: ['base64-decode', 'url-encode', 'html-escape']
  },
  {
    slug: 'base64-decode',
    converterId: 'base64Decode',
    reverseSlug: 'base64-encode',
    category: 'encoding',
    inputType: 'base64',
    outputType: 'text',
    popular: true,
    title: { en: 'Base64 Decoder', he: 'מפענח Base64' },
    shortTitle: { en: 'Base64 Decode', he: 'פענוח Base64' },
    description: { en: 'Decode Base64 into readable text with Unicode support.', he: 'פענח Base64 לטקסט קריא עם תמיכה ב־Unicode.' },
    metaDescription: { en: 'Decode Base64 online in your browser with English and Hebrew UI.', he: 'פענוח Base64 אונליין בדפדפן עם ממשק עברית ואנגלית.' },
    keywords: { en: ['base64 decode', 'base64 decoder'], he: ['פענוח Base64', 'מפענח Base64'] },
    features: { en: ['Unicode safe', 'Validation', 'Instant'], he: ['תומך Unicode', 'אימות', 'מידי'] },
    guide: { en: ['Paste Base64.', 'Decode to text.', 'Copy the decoded result.'], he: ['הדבק Base64.', 'פענח לטקסט.', 'העתק את התוצאה.'] },
    examples: [{ label: { en: 'Encoded greeting', he: 'ברכה מקודדת' }, input: 'SGVsbG8g16nXnNeV150=' }],
    options: base64DecodeOptions,
    faq: [faq.private, faq.free],
    related: ['base64-encode', 'url-decode', 'html-unescape']
  },
  {
    slug: 'text-to-binary',
    converterId: 'textToBinary',
    reverseSlug: 'binary-to-text',
    category: 'encoding',
    inputType: 'text',
    outputType: 'binary',
    title: { en: 'Text to Binary Converter', he: 'ממיר טקסט לבינארי' },
    shortTitle: { en: 'Text to Binary', he: 'טקסט לבינארי' },
    description: { en: 'Convert Unicode text into 8-bit binary byte groups.', he: 'המר טקסט Unicode לקבוצות בינאריות של 8 ביט.' },
    metaDescription: { en: 'Convert text to binary online with Unicode support and local browser processing.', he: 'המרת טקסט לבינארי אונליין עם תמיכה ב־Unicode והרצה מקומית בדפדפן.' },
    keywords: { en: ['text to binary', 'binary converter'], he: ['טקסט לבינארי', 'ממיר בינארי'] },
    features: { en: ['8-bit groups', 'Unicode safe', 'Copy binary'], he: ['קבוצות 8 ביט', 'תומך Unicode', 'העתקת בינארי'] },
    guide: { en: ['Paste text.', 'Convert to binary.', 'Copy the byte groups.'], he: ['הדבק טקסט.', 'המר לבינארי.', 'העתק את קבוצות הביטים.'] },
    examples: [
      { label: { en: 'Greeting', he: 'ברכה' }, input: 'Hi שלום' },
      { label: { en: 'Emoji text', he: 'טקסט עם אימוג׳י' }, input: 'Convert 🚀' }
    ],
    faq: [faq.private, faq.free],
    related: ['binary-to-text', 'base64-encode', 'url-encode']
  },
  {
    slug: 'binary-to-text',
    converterId: 'binaryToText',
    reverseSlug: 'text-to-binary',
    category: 'encoding',
    inputType: 'binary',
    outputType: 'text',
    title: { en: 'Binary to Text Converter', he: 'ממיר בינארי לטקסט' },
    shortTitle: { en: 'Binary to Text', he: 'בינארי לטקסט' },
    description: { en: 'Decode 8-bit binary byte groups into readable Unicode text.', he: 'פענח קבוצות בינאריות של 8 ביט לטקסט Unicode קריא.' },
    metaDescription: { en: 'Convert binary to text online using 8-bit byte groups with Unicode decoding.', he: 'המרת בינארי לטקסט אונליין באמצעות קבוצות 8 ביט ותמיכה ב־Unicode.' },
    keywords: { en: ['binary to text', 'decode binary'], he: ['בינארי לטקסט', 'פענוח בינארי'] },
    features: { en: ['8-bit validation', 'Unicode output', 'Instant decode'], he: ['אימות 8 ביט', 'פלט Unicode', 'פענוח מידי'] },
    guide: { en: ['Paste binary byte groups.', 'Decode to text.', 'Copy the readable output.'], he: ['הדבק קבוצות בינאריות.', 'פענח לטקסט.', 'העתק את הפלט הקריא.'] },
    examples: [
      { label: { en: 'Binary greeting', he: 'ברכה בינארית' }, input: '01001000 01101001' },
      { label: { en: 'Binary word', he: 'מילה בינארית' }, input: '01001000 01100101 01101100 01101100 01101111' }
    ],
    faq: [faq.private, faq.free],
    related: ['text-to-binary', 'base64-decode', 'url-decode']
  },
  {
    slug: 'url-encode',
    converterId: 'urlEncode',
    reverseSlug: 'url-decode',
    category: 'encoding',
    inputType: 'text',
    outputType: 'url',
    title: { en: 'URL Encoder', he: 'מקודד URL' },
    shortTitle: { en: 'URL Encode', he: 'קידוד URL' },
    description: { en: 'Encode text for safe use inside URLs and query strings.', he: 'קודד טקסט לשימוש בטוח בתוך URL ופרמטרים.' },
    metaDescription: { en: 'Encode URLs and query strings online, including Hebrew and special characters.', he: 'קידוד URL ופרמטרים אונליין, כולל עברית ותווים מיוחדים.' },
    keywords: { en: ['url encode', 'percent encode'], he: ['קידוד URL', 'URL encode'] },
    features: { en: ['Percent encoding', 'Query safe', 'Unicode'], he: ['קידוד אחוזים', 'בטוח לפרמטרים', 'Unicode'] },
    guide: { en: ['Paste text or a URL segment.', 'Encode it.', 'Use the output in links or query strings.'], he: ['הדבק טקסט או חלק מ־URL.', 'קודד אותו.', 'השתמש בפלט בקישורים או פרמטרים.'] },
    examples: [
      { label: { en: 'Search query', he: 'שאילתת חיפוש' }, input: 'hello world שלום' },
      { label: { en: 'URL params', he: 'פרמטרים ל־URL' }, input: 'name=Dana&city=Tel Aviv' }
    ],
    options: urlEncodeOptions,
    faq: [faq.private, faq.free],
    related: ['url-decode', 'base64-encode']
  },
  {
    slug: 'url-decode',
    converterId: 'urlDecode',
    reverseSlug: 'url-encode',
    category: 'encoding',
    inputType: 'url',
    outputType: 'text',
    title: { en: 'URL Decoder', he: 'מפענח URL' },
    shortTitle: { en: 'URL Decode', he: 'פענוח URL' },
    description: { en: 'Decode percent-encoded URLs into readable text.', he: 'פענח URL מקודד באחוזים לטקסט קריא.' },
    metaDescription: { en: 'Decode URL encoded strings online with Hebrew and English support.', he: 'פענוח מחרוזות URL מקודדות אונליין עם תמיכה בעברית ובאנגלית.' },
    keywords: { en: ['url decode', 'decode url'], he: ['פענוח URL', 'URL decode'] },
    features: { en: ['Percent decoding', 'Readable output', 'Instant'], he: ['פענוח אחוזים', 'פלט קריא', 'מידי'] },
    guide: { en: ['Paste an encoded URL string.', 'Decode it.', 'Copy the readable result.'], he: ['הדבק מחרוזת URL מקודדת.', 'פענח אותה.', 'העתק את התוצאה הקריאה.'] },
    examples: [{ label: { en: 'Encoded query', he: 'שאילתה מקודדת' }, input: 'hello%20world%20%D7%A9%D7%9C%D7%95%D7%9D' }],
    options: urlDecodeOptions,
    faq: [faq.private, faq.free],
    related: ['url-encode', 'query-string-to-json', 'base64-decode']
  },
  {
    slug: 'query-string-to-json',
    converterId: 'queryStringToJson',
    reverseSlug: 'json-to-query-string',
    category: 'developer',
    inputType: 'query string',
    outputType: 'json',
    title: { en: 'Query String to JSON Converter', he: 'ממיר Query String ל־JSON' },
    shortTitle: { en: 'Query String to JSON', he: 'Query String ל־JSON' },
    description: { en: 'Parse URL query parameters into readable JSON for debugging links, API calls and tracking URLs.', he: 'פענח פרמטרים של URL ל־JSON קריא עבור דיבוג קישורים, קריאות API וכתובות מעקב.' },
    metaDescription: { en: 'Convert query strings to JSON online. Parse URL parameters locally with support for repeated keys and encoded values.', he: 'המרת Query String ל־JSON אונליין. פענוח פרמטרים מקומית עם תמיכה במפתחות חוזרים וערכים מקודדים.' },
    keywords: { en: ['query string to json', 'url parameters to json'], he: ['Query String ל JSON', 'פרמטרים ל JSON'] },
    features: { en: ['Full URL support', 'Repeated keys', 'Pretty JSON'], he: ['תמיכה ב־URL מלא', 'מפתחות חוזרים', 'JSON קריא'] },
    guide: { en: ['Paste a query string or full URL.', 'Convert to JSON.', 'Inspect parameters and repeated values.'], he: ['הדבק query string או URL מלא.', 'המר ל־JSON.', 'בדוק פרמטרים וערכים חוזרים.'] },
    examples: [
      { label: { en: 'Search URL', he: 'כתובת חיפוש' }, input: 'https://example.com/search?q=online+converter&lang=he&page=2' },
      { label: { en: 'Repeated keys', he: 'מפתחות חוזרים' }, input: 'tag=json&tag=csv&sort=popular' }
    ],
    faq: [faq.private, faq.free],
    related: ['json-to-query-string', 'url-decode', 'url-encode']
  },
  {
    slug: 'json-to-query-string',
    converterId: 'jsonToQueryString',
    reverseSlug: 'query-string-to-json',
    category: 'developer',
    inputType: 'json',
    outputType: 'query string',
    title: { en: 'JSON to Query String Converter', he: 'ממיר JSON ל־Query String' },
    shortTitle: { en: 'JSON to Query String', he: 'JSON ל־Query String' },
    description: { en: 'Build URL query strings from JSON objects for links, API requests and test URLs.', he: 'בנה query strings מאובייקטי JSON עבור קישורים, בקשות API וכתובות בדיקה.' },
    metaDescription: { en: 'Convert JSON to query string online. Create URL parameters from objects and arrays directly in your browser.', he: 'המרת JSON ל־Query String אונליין. יצירת פרמטרים ל־URL מאובייקטים ומערכים ישירות בדפדפן.' },
    keywords: { en: ['json to query string', 'json to url params'], he: ['JSON ל Query String', 'JSON לפרמטרים'] },
    features: { en: ['Object keys', 'Array values', 'URL encoded'], he: ['מפתחות אובייקט', 'ערכי מערך', 'מקודד ל־URL'] },
    guide: { en: ['Paste a flat JSON object.', 'Convert to query string.', 'Copy the result into a URL or API request.'], he: ['הדבק אובייקט JSON שטוח.', 'המר ל־query string.', 'העתק את התוצאה ל־URL או בקשת API.'] },
    examples: [
      { label: { en: 'Search params', he: 'פרמטרי חיפוש' }, input: '{"q":"online converter","lang":"he","page":2}' },
      { label: { en: 'Array params', he: 'פרמטרי מערך' }, input: '{"tag":["json","csv"],"sort":"popular"}' }
    ],
    faq: [faq.private, faq.free],
    related: ['query-string-to-json', 'url-encode', 'json-formatter']
  },
  {
    slug: 'json-to-jsonl',
    converterId: 'jsonToJsonLines',
    reverseSlug: 'jsonl-to-json',
    category: 'developer',
    inputType: 'json',
    outputType: 'jsonl',
    title: { en: 'JSON to JSONL Converter', he: 'ממיר JSON ל־JSONL' },
    shortTitle: { en: 'JSON to JSONL', he: 'JSON ל־JSONL' },
    description: { en: 'Convert JSON arrays or objects into newline-delimited JSON for logs, data pipelines and AI datasets.', he: 'המר מערכי JSON או אובייקטים ל־JSON בשורות עבור לוגים, תהליכי נתונים ודאטה ל־AI.' },
    metaDescription: { en: 'Convert JSON to JSONL online. Create newline-delimited JSON locally in your browser with Hebrew and English support.', he: 'המרת JSON ל־JSONL אונליין. יצירת JSON בשורות בדפדפן עם תמיכה מלאה בעברית ובאנגלית.' },
    keywords: { en: ['json to jsonl', 'json lines converter'], he: ['JSON ל JSONL', 'ממיר JSON Lines'] },
    features: { en: ['Array support', 'One JSON value per line', 'Dataset friendly'], he: ['תמיכה במערכים', 'ערך JSON אחד בכל שורה', 'מתאים לדאטה'] },
    guide: { en: ['Paste a JSON array or object.', 'Convert to JSONL.', 'Copy the newline-delimited output.'], he: ['הדבק מערך או אובייקט JSON.', 'המר ל־JSONL.', 'העתק את הפלט שמופרד לפי שורות.'] },
    examples: [
      { label: { en: 'Events array', he: 'מערך אירועים' }, input: '[{"event":"signup","user":"Dana"},{"event":"purchase","user":"Avi"}]' },
      { label: { en: 'Single object', he: 'אובייקט יחיד' }, input: '{"event":"page_view","path":"/he/"}' }
    ],
    faq: [faq.private, faq.free],
    related: ['jsonl-to-json', 'json-formatter', 'json-to-csv']
  },
  {
    slug: 'jsonl-to-json',
    converterId: 'jsonLinesToJson',
    reverseSlug: 'json-to-jsonl',
    category: 'developer',
    inputType: 'jsonl',
    outputType: 'json',
    title: { en: 'JSONL to JSON Converter', he: 'ממיר JSONL ל־JSON' },
    shortTitle: { en: 'JSONL to JSON', he: 'JSONL ל־JSON' },
    description: { en: 'Parse newline-delimited JSON into a formatted JSON array for inspection, scripts and data cleanup.', he: 'פענח JSON בשורות למערך JSON מעוצב עבור בדיקה, סקריפטים וניקוי נתונים.' },
    metaDescription: { en: 'Convert JSONL to JSON online. Parse JSON Lines into a pretty JSON array locally in your browser.', he: 'המרת JSONL ל־JSON אונליין. פענוח JSON Lines למערך JSON קריא בדפדפן.' },
    keywords: { en: ['jsonl to json', 'json lines to json'], he: ['JSONL ל JSON', 'JSON Lines ל JSON'] },
    features: { en: ['Line validation', 'Pretty JSON array', 'Local parsing'], he: ['אימות לפי שורה', 'מערך JSON קריא', 'פענוח מקומי'] },
    guide: { en: ['Paste JSONL with one JSON value per line.', 'Convert to JSON.', 'Fix any line number error if shown.'], he: ['הדבק JSONL עם ערך JSON אחד בכל שורה.', 'המר ל־JSON.', 'תקן שגיאת מספר שורה אם מופיעה.'] },
    examples: [
      { label: { en: 'Event lines', he: 'שורות אירועים' }, input: '{"event":"signup","user":"Dana"}\n{"event":"purchase","user":"Avi"}' },
      { label: { en: 'Log lines', he: 'שורות לוג' }, input: '{"level":"info","message":"started"}\n{"level":"warn","message":"slow request"}' }
    ],
    faq: [faq.private, faq.free],
    related: ['json-to-jsonl', 'json-formatter', 'json-to-csv']
  },
  {
    slug: 'html-escape',
    converterId: 'htmlEscape',
    reverseSlug: 'html-unescape',
    category: 'developer',
    inputType: 'html',
    outputType: 'escaped html',
    title: { en: 'HTML Escape Tool', he: 'כלי המלטת HTML' },
    shortTitle: { en: 'HTML Escape', he: 'המלטת HTML' },
    description: { en: 'Escape HTML-sensitive characters for safe display in markup.', he: 'המלט תווים רגישים ב־HTML להצגה בטוחה בקוד.' },
    metaDescription: { en: 'Escape HTML entities online for safe code snippets and markup.', he: 'המלטת HTML entities אונליין עבור קוד ותצוגה בטוחה.' },
    keywords: { en: ['html escape', 'escape html'], he: ['המלטת HTML', 'HTML escape'] },
    features: { en: ['Escapes tags', 'Code friendly', 'Instant'], he: ['ממלט תגיות', 'נוח לקוד', 'מידי'] },
    guide: { en: ['Paste HTML or text.', 'Escape characters.', 'Use the result inside pages or docs.'], he: ['הדבק HTML או טקסט.', 'המלט תווים.', 'השתמש בתוצאה בעמודים או תיעוד.'] },
    examples: [{ label: { en: 'HTML snippet', he: 'קטע HTML' }, input: '<strong>Hello & welcome</strong>' }],
    faq: [faq.private, faq.free],
    related: ['html-unescape', 'url-encode']
  },
  {
    slug: 'html-unescape',
    converterId: 'htmlUnescape',
    reverseSlug: 'html-escape',
    category: 'developer',
    inputType: 'escaped html',
    outputType: 'html',
    title: { en: 'HTML Unescape Tool', he: 'כלי פענוח HTML' },
    shortTitle: { en: 'HTML Unescape', he: 'פענוח HTML' },
    description: { en: 'Decode HTML entities back into readable characters.', he: 'פענח ישויות HTML בחזרה לתווים קריאים.' },
    metaDescription: { en: 'Unescape HTML entities online with a fast browser-based converter.', he: 'פענוח HTML entities אונליין באמצעות ממיר מהיר בדפדפן.' },
    keywords: { en: ['html unescape', 'decode html entities'], he: ['פענוח HTML', 'HTML entities'] },
    features: { en: ['Entity decoding', 'Readable output', 'Instant'], he: ['פענוח ישויות', 'פלט קריא', 'מידי'] },
    guide: { en: ['Paste escaped HTML.', 'Decode entities.', 'Copy the readable result.'], he: ['הדבק HTML ממולט.', 'פענח ישויות.', 'העתק את התוצאה הקריאה.'] },
    examples: [{ label: { en: 'Escaped snippet', he: 'קטע ממולט' }, input: '&lt;strong&gt;Hello &amp; welcome&lt;/strong&gt;' }],
    faq: [faq.private, faq.free],
    related: ['html-escape', 'url-decode']
  },
  {
    slug: 'regex-escape',
    converterId: 'regexEscape',
    category: 'developer',
    inputType: 'text',
    outputType: 'regex',
    title: { en: 'Regex Escape Tool', he: 'כלי Regex Escape' },
    shortTitle: { en: 'Regex Escape', he: 'Regex Escape' },
    description: { en: 'Escape special regex characters so plain text can be used safely inside regular expressions.', he: 'המלט תווים מיוחדים של Regex כדי להשתמש בטקסט רגיל בביטויים רגולריים בצורה בטוחה.' },
    metaDescription: { en: 'Escape regex special characters online. Turn plain text into a safe regular expression pattern locally.', he: 'המלטת תווי Regex מיוחדים אונליין. הפיכת טקסט רגיל לתבנית regex בטוחה בדפדפן.' },
    keywords: { en: ['regex escape', 'escape regular expression'], he: ['Regex escape', 'המלטת Regex'] },
    features: { en: ['Escapes metacharacters', 'Pattern friendly', 'Instant copy'], he: ['ממלט תווים מיוחדים', 'מתאים לתבניות', 'העתקה מידית'] },
    guide: { en: ['Paste plain text.', 'Escape regex characters.', 'Use the output inside a regular expression.'], he: ['הדבק טקסט רגיל.', 'המלט תווי Regex.', 'השתמש בפלט בתוך ביטוי רגולרי.'] },
    examples: [
      { label: { en: 'Search text', he: 'טקסט לחיפוש' }, input: 'price is $19.99 (sale)' },
      { label: { en: 'URL path', he: 'נתיב URL' }, input: '/users/[id]?tab=profile' }
    ],
    faq: [faq.private, faq.free],
    related: ['html-escape', 'url-encode', 'text-case-converter']
  },
  {
    slug: 'text-to-unicode-escape',
    converterId: 'textToUnicodeEscape',
    reverseSlug: 'unicode-escape-to-text',
    category: 'encoding',
    inputType: 'text',
    outputType: 'unicode escape',
    title: { en: 'Text to Unicode Escape Converter', he: 'ממיר טקסט ל־Unicode Escape' },
    shortTitle: { en: 'Text to Unicode Escape', he: 'טקסט ל־Unicode Escape' },
    description: { en: 'Convert text into Unicode escape sequences for source code, debugging and encoded strings.', he: 'המר טקסט לרצפי Unicode escape עבור קוד, דיבוג ומחרוזות מקודדות.' },
    metaDescription: { en: 'Convert text to Unicode escape sequences online with Hebrew, emoji and Unicode support.', he: 'המרת טקסט ל־Unicode escape אונליין עם תמיכה בעברית, אימוג׳י ו־Unicode.' },
    keywords: { en: ['text to unicode escape', 'unicode escape converter'], he: ['טקסט ל Unicode escape', 'ממיר Unicode'] },
    features: { en: ['Hebrew support', 'Emoji support', 'Code friendly'], he: ['תמיכה בעברית', 'תמיכה באימוג׳י', 'מתאים לקוד'] },
    guide: { en: ['Paste text.', 'Convert to Unicode escapes.', 'Copy the escaped string into code or tests.'], he: ['הדבק טקסט.', 'המר ל־Unicode escapes.', 'העתק את המחרוזת לקוד או בדיקות.'] },
    examples: [
      { label: { en: 'Hebrew greeting', he: 'ברכה בעברית' }, input: 'שלום' },
      { label: { en: 'Emoji text', he: 'טקסט עם אימוג׳י' }, input: 'Hi 👋' }
    ],
    faq: [faq.private, faq.free],
    related: ['unicode-escape-to-text', 'url-encode', 'base64-encode']
  },
  {
    slug: 'unicode-escape-to-text',
    converterId: 'unicodeEscapeToText',
    reverseSlug: 'text-to-unicode-escape',
    category: 'encoding',
    inputType: 'unicode escape',
    outputType: 'text',
    title: { en: 'Unicode Escape to Text Converter', he: 'ממיר Unicode Escape לטקסט' },
    shortTitle: { en: 'Unicode Escape to Text', he: 'Unicode Escape לטקסט' },
    description: { en: 'Decode Unicode escape sequences back into readable text for debugging encoded strings.', he: 'פענח רצפי Unicode escape בחזרה לטקסט קריא עבור דיבוג מחרוזות מקודדות.' },
    metaDescription: { en: 'Decode Unicode escape sequences to text online. Supports \\uXXXX and \\u{...} notation in the browser.', he: 'פענוח Unicode escape לטקסט אונליין. תמיכה ברצפי Unicode קצרים וארוכים בדפדפן.' },
    keywords: { en: ['unicode escape to text', 'decode unicode escape'], he: ['Unicode escape לטקסט', 'פענוח Unicode'] },
    features: { en: ['\\uXXXX support', '\\u{...} support', 'Readable text'], he: ['רצפי Unicode קצרים', 'רצפי Unicode ארוכים', 'טקסט קריא'] },
    guide: { en: ['Paste Unicode escape text.', 'Decode it.', 'Copy the readable result.'], he: ['הדבק טקסט Unicode escape.', 'פענח אותו.', 'העתק את התוצאה הקריאה.'] },
    examples: [
      { label: { en: 'Hebrew escapes', he: 'Unicode עברית' }, input: '\\u05e9\\u05dc\\u05d5\\u05dd' },
      { label: { en: 'Emoji escape', he: 'Unicode אימוג׳י' }, input: 'Hi \\u{1f44b}' }
    ],
    faq: [faq.private, faq.free],
    related: ['text-to-unicode-escape', 'url-decode', 'base64-decode']
  },
  {
    slug: 'text-case-converter',
    converterId: 'textCase',
    category: 'text',
    inputType: 'text',
    outputType: 'text',
    popular: true,
    title: { en: 'Text Case Converter', he: 'ממיר אותיות גדולות וקטנות' },
    shortTitle: { en: 'Text Case', he: 'שינוי אותיות' },
    description: { en: 'Convert text into uppercase, lowercase, title case, sentence case and slug style.', he: 'המר טקסט לאותיות גדולות, קטנות, כותרת, משפט וסלאג.' },
    metaDescription: { en: 'Change text case online with uppercase, lowercase, title case and slug output.', he: 'שינוי אותיות בטקסט אונליין: גדולות, קטנות, כותרת וסלאג.' },
    keywords: { en: ['case converter', 'uppercase lowercase'], he: ['שינוי אותיות', 'אותיות גדולות קטנות'] },
    features: { en: ['Multiple formats', 'Unicode text', 'Fast copy'], he: ['כמה פורמטים', 'טקסט Unicode', 'העתקה מהירה'] },
    guide: { en: ['Paste text.', 'Convert to see common case formats.', 'Copy the line you need.'], he: ['הדבק טקסט.', 'המר כדי לראות פורמטים נפוצים.', 'העתק את השורה הרצויה.'] },
    examples: [{ label: { en: 'Mixed case', he: 'טקסט מעורב' }, input: 'hello world from Online Converter' }],
    faq: [faq.private, faq.free],
    related: ['text-to-camel-case', 'text-to-snake-case', 'slug-generator']
  },
  {
    slug: 'text-to-camel-case',
    converterId: 'textToCamelCase',
    category: 'text',
    inputType: 'text',
    outputType: 'camel case',
    title: { en: 'Text to camelCase Converter', he: 'ממיר טקסט ל־camelCase' },
    shortTitle: { en: 'Text to camelCase', he: 'טקסט ל־camelCase' },
    description: { en: 'Convert titles, labels and phrases into camelCase for variables, keys and code identifiers.', he: 'המר כותרות, תוויות וביטויים ל־camelCase עבור משתנים, מפתחות ומזהים בקוד.' },
    metaDescription: { en: 'Convert text to camelCase online for code variables, JSON keys and clean identifiers in your browser.', he: 'המרת טקסט ל־camelCase אונליין עבור משתני קוד, מפתחות JSON ומזהים נקיים בדפדפן.' },
    keywords: { en: ['text to camelcase', 'camel case converter'], he: ['טקסט ל camelCase', 'ממיר camelCase'] },
    features: { en: ['Code identifiers', 'Clean words', 'Instant copy'], he: ['מזהים לקוד', 'מילים נקיות', 'העתקה מידית'] },
    guide: { en: ['Paste a phrase.', 'Convert to camelCase.', 'Copy the identifier into code or docs.'], he: ['הדבק ביטוי.', 'המר ל־camelCase.', 'העתק את המזהה לקוד או תיעוד.'] },
    examples: [
      { label: { en: 'Variable name', he: 'שם משתנה' }, input: 'user profile image' },
      { label: { en: 'API key name', he: 'שם מפתח API' }, input: 'billing account id' }
    ],
    faq: [faq.private, faq.free],
    related: ['text-to-snake-case', 'text-to-kebab-case', 'text-case-converter']
  },
  {
    slug: 'text-to-snake-case',
    converterId: 'textToSnakeCase',
    category: 'text',
    inputType: 'text',
    outputType: 'snake case',
    title: { en: 'Text to snake_case Converter', he: 'ממיר טקסט ל־snake_case' },
    shortTitle: { en: 'Text to snake_case', he: 'טקסט ל־snake_case' },
    description: { en: 'Convert phrases into snake_case for filenames, database fields, configs and code keys.', he: 'המר ביטויים ל־snake_case עבור שמות קבצים, שדות דאטה, קונפיגים ומפתחות קוד.' },
    metaDescription: { en: 'Convert text to snake_case online. Create clean underscore-separated names locally in your browser.', he: 'המרת טקסט ל־snake_case אונליין. יצירת שמות נקיים עם קו תחתון בדפדפן.' },
    keywords: { en: ['text to snake case', 'snake_case converter'], he: ['טקסט ל snake_case', 'ממיר snake_case'] },
    features: { en: ['Underscore output', 'Code friendly', 'Filename friendly'], he: ['פלט עם קו תחתון', 'נוח לקוד', 'נוח לשמות קבצים'] },
    guide: { en: ['Paste text.', 'Convert to snake_case.', 'Use the result in code, filenames or fields.'], he: ['הדבק טקסט.', 'המר ל־snake_case.', 'השתמש בתוצאה בקוד, שמות קבצים או שדות.'] },
    examples: [
      { label: { en: 'Field name', he: 'שם שדה' }, input: 'Customer Account Number' },
      { label: { en: 'File name', he: 'שם קובץ' }, input: 'Monthly Revenue Report' }
    ],
    faq: [faq.private, faq.free],
    related: ['text-to-camel-case', 'text-to-kebab-case', 'slug-generator']
  },
  {
    slug: 'text-to-kebab-case',
    converterId: 'textToKebabCase',
    category: 'text',
    inputType: 'text',
    outputType: 'kebab case',
    title: { en: 'Text to kebab-case Converter', he: 'ממיר טקסט ל־kebab-case' },
    shortTitle: { en: 'Text to kebab-case', he: 'טקסט ל־kebab-case' },
    description: { en: 'Convert phrases into kebab-case for URLs, CSS classes, slugs and filenames.', he: 'המר ביטויים ל־kebab-case עבור URL, מחלקות CSS, slugs ושמות קבצים.' },
    metaDescription: { en: 'Convert text to kebab-case online for URLs, CSS class names, slugs and clean filenames.', he: 'המרת טקסט ל־kebab-case אונליין עבור URL, מחלקות CSS, slugs ושמות קבצים נקיים.' },
    keywords: { en: ['text to kebab case', 'kebab-case converter'], he: ['טקסט ל kebab-case', 'ממיר kebab-case'] },
    features: { en: ['Dash separated', 'URL friendly', 'CSS friendly'], he: ['מופרד במקפים', 'ידידותי ל־URL', 'נוח ל־CSS'] },
    guide: { en: ['Paste a phrase.', 'Convert to kebab-case.', 'Use the output in URLs, CSS or filenames.'], he: ['הדבק ביטוי.', 'המר ל־kebab-case.', 'השתמש בפלט ב־URL, CSS או שמות קבצים.'] },
    examples: [
      { label: { en: 'CSS class', he: 'מחלקת CSS' }, input: 'Primary Action Button' },
      { label: { en: 'SEO phrase', he: 'ביטוי SEO' }, input: 'Best Online Converter Tools' }
    ],
    faq: [faq.private, faq.free],
    related: ['slug-generator', 'text-to-snake-case', 'text-to-camel-case']
  },
  {
    slug: 'slug-generator',
    converterId: 'slugGenerator',
    category: 'text',
    inputType: 'text',
    outputType: 'slug',
    title: { en: 'Slug Generator', he: 'יוצר Slug' },
    shortTitle: { en: 'Slug Generator', he: 'יצירת Slug' },
    description: { en: 'Create SEO-friendly URL slugs from titles and phrases.', he: 'צור slugs ידידותיים ל־SEO מכותרות וביטויים.' },
    metaDescription: { en: 'Generate SEO-friendly slugs online from English or Hebrew text.', he: 'יצירת slugs ידידותיים ל־SEO אונליין מטקסט עברי או אנגלי.' },
    keywords: { en: ['slug generator', 'url slug'], he: ['יצירת slug', 'סלאג SEO'] },
    features: { en: ['URL friendly', 'Lowercase', 'Clean separators'], he: ['ידידותי ל־URL', 'אותיות קטנות', 'מפרידים נקיים'] },
    guide: { en: ['Paste a title.', 'Generate a slug.', 'Use it in URLs or filenames.'], he: ['הדבק כותרת.', 'צור slug.', 'השתמש בו ב־URL או שמות קבצים.'] },
    examples: [
      { label: { en: 'Article title', he: 'כותרת מאמר' }, input: 'Best JSON Tools for Developers' },
      { label: { en: 'Hebrew title', he: 'כותרת בעברית' }, input: 'ממירים שימושיים למפתחים' }
    ],
    faq: [faq.private, faq.free],
    related: ['text-to-kebab-case', 'text-case-converter', 'url-encode']
  },
  {
    slug: 'word-counter',
    converterId: 'wordCounter',
    category: 'text',
    inputType: 'text',
    outputType: 'stats',
    title: { en: 'Word Counter', he: 'סופר מילים' },
    shortTitle: { en: 'Word Counter', he: 'ספירת מילים' },
    description: { en: 'Count words, characters, lines and estimated reading time.', he: 'ספור מילים, תווים, שורות וזמן קריאה משוער.' },
    metaDescription: { en: 'Free word counter for English and Hebrew text with character and line counts.', he: 'סופר מילים חינמי לטקסט עברי ואנגלי כולל ספירת תווים ושורות.' },
    keywords: { en: ['word counter', 'character counter'], he: ['סופר מילים', 'ספירת תווים'] },
    features: { en: ['Words', 'Characters', 'Reading time'], he: ['מילים', 'תווים', 'זמן קריאה'] },
    guide: { en: ['Paste text.', 'Convert to calculate stats.', 'Use the counts for content planning.'], he: ['הדבק טקסט.', 'המר כדי לחשב נתונים.', 'השתמש בספירות לתכנון תוכן.'] },
    examples: [{ label: { en: 'Short paragraph', he: 'פסקה קצרה' }, input: 'Online converters save time for developers, writers and analysts.' }],
    faq: [faq.private, faq.free],
    related: ['text-case-converter', 'sort-lines']
  },
  {
    slug: 'sort-lines',
    converterId: 'sortLines',
    category: 'text',
    inputType: 'lines',
    outputType: 'sorted lines',
    title: { en: 'Sort Lines Alphabetically', he: 'מיון שורות לפי אלפבית' },
    shortTitle: { en: 'Sort Lines', he: 'מיון שורות' },
    description: { en: 'Sort lists and multiline text alphabetically.', he: 'מיין רשימות וטקסט רב־שורות לפי סדר אלפביתי.' },
    metaDescription: { en: 'Sort lines alphabetically online with a fast browser-based tool.', he: 'מיון שורות לפי אלפבית אונליין באמצעות כלי מהיר בדפדפן.' },
    keywords: { en: ['sort lines', 'alphabetize list'], he: ['מיון שורות', 'סידור רשימה'] },
    features: { en: ['Alphabetical sort', 'Keeps lines', 'Instant'], he: ['מיון אלפביתי', 'שומר שורות', 'מידי'] },
    guide: { en: ['Paste a list.', 'Sort lines.', 'Copy the ordered list.'], he: ['הדבק רשימה.', 'מיין שורות.', 'העתק את הרשימה המסודרת.'] },
    examples: [
      { label: { en: 'Names', he: 'שמות' }, input: 'Banana\nApple\nCherry' },
      { label: { en: 'Hebrew list', he: 'רשימה בעברית' }, input: 'תל אביב\nירושלים\nחיפה' }
    ],
    options: lineSortOptions,
    faq: [faq.private, faq.free],
    related: ['add-line-numbers', 'remove-duplicate-lines', 'word-counter']
  },
  {
    slug: 'add-line-numbers',
    converterId: 'addLineNumbers',
    reverseSlug: 'remove-line-numbers',
    category: 'text',
    inputType: 'lines',
    outputType: 'numbered lines',
    title: { en: 'Add Line Numbers Tool', he: 'הוספת מספרי שורות' },
    shortTitle: { en: 'Add Line Numbers', he: 'הוספת מספרי שורות' },
    description: { en: 'Add clear line numbers to lists, notes, code snippets and multiline text.', he: 'הוסף מספרי שורות ברורים לרשימות, הערות, קטעי קוד וטקסט רב־שורות.' },
    metaDescription: { en: 'Add line numbers online to text, lists and code snippets with a fast browser-based tool.', he: 'הוספת מספרי שורות אונליין לטקסט, רשימות וקטעי קוד באמצעות כלי מהיר בדפדפן.' },
    keywords: { en: ['add line numbers', 'number lines'], he: ['הוספת מספרי שורות', 'מספור שורות'] },
    features: { en: ['Numbered lines', 'Keeps order', 'Fast cleanup'], he: ['שורות ממוספרות', 'שומר סדר', 'ניקוי מהיר'] },
    guide: { en: ['Paste multiline text.', 'Add line numbers.', 'Copy the numbered output.'], he: ['הדבק טקסט רב־שורות.', 'הוסף מספרי שורות.', 'העתק את הפלט הממוספר.'] },
    examples: [
      { label: { en: 'Task list', he: 'רשימת משימות' }, input: 'Write draft\nReview copy\nPublish page' },
      { label: { en: 'Hebrew list', he: 'רשימה בעברית' }, input: 'פתיחה\nגוף הטקסט\nסיכום' }
    ],
    faq: [faq.private, faq.free],
    related: ['remove-line-numbers', 'sort-lines', 'remove-empty-lines']
  },
  {
    slug: 'remove-line-numbers',
    converterId: 'removeLineNumbers',
    reverseSlug: 'add-line-numbers',
    category: 'text',
    inputType: 'numbered lines',
    outputType: 'lines',
    title: { en: 'Remove Line Numbers Tool', he: 'הסרת מספרי שורות' },
    shortTitle: { en: 'Remove Line Numbers', he: 'הסרת מספרי שורות' },
    description: { en: 'Remove leading line numbers from copied lists, code examples and numbered notes.', he: 'הסר מספרי שורות בתחילת שורות מרשימות, דוגמאות קוד והערות ממוספרות.' },
    metaDescription: { en: 'Remove line numbers online from copied text, numbered lists and code snippets directly in your browser.', he: 'הסרת מספרי שורות אונליין מטקסט מועתק, רשימות ממוספרות וקטעי קוד ישירות בדפדפן.' },
    keywords: { en: ['remove line numbers', 'delete line numbers'], he: ['הסרת מספרי שורות', 'מחיקת מספור שורות'] },
    features: { en: ['Removes prefixes', 'Keeps text', 'List cleanup'], he: ['מסיר קידומות', 'שומר טקסט', 'ניקוי רשימות'] },
    guide: { en: ['Paste numbered lines.', 'Remove line numbers.', 'Copy the clean text.'], he: ['הדבק שורות ממוספרות.', 'הסר מספרי שורות.', 'העתק את הטקסט הנקי.'] },
    examples: [
      { label: { en: 'Numbered notes', he: 'הערות ממוספרות' }, input: '1. Write draft\n2. Review copy\n3. Publish page' },
      { label: { en: 'Code copy', he: 'קוד מועתק' }, input: '01 const name = "Dana";\n02 console.log(name);' }
    ],
    faq: [faq.private, faq.free],
    related: ['add-line-numbers', 'remove-empty-lines', 'trim-whitespace']
  },
  {
    slug: 'remove-duplicate-lines',
    converterId: 'removeDuplicateLines',
    category: 'text',
    inputType: 'lines',
    outputType: 'unique lines',
    title: { en: 'Remove Duplicate Lines', he: 'הסרת שורות כפולות' },
    shortTitle: { en: 'Remove Duplicates', he: 'הסרת כפילויות' },
    description: { en: 'Remove duplicate lines while preserving the first occurrence order.', he: 'הסר שורות כפולות תוך שמירת סדר ההופעה הראשון.' },
    metaDescription: { en: 'Remove duplicate lines online from lists, pasted text and repeated data.', he: 'הסרת שורות כפולות אונליין מרשימות וטקסט.' },
    keywords: { en: ['remove duplicate lines', 'unique lines'], he: ['הסרת שורות כפולות', 'שורות ייחודיות'] },
    features: { en: ['Unique lines', 'Order preserved', 'List cleanup'], he: ['שורות ייחודיות', 'שמירת סדר', 'ניקוי רשימות'] },
    guide: { en: ['Paste lines.', 'Remove duplicates.', 'Copy the unique list.'], he: ['הדבק שורות.', 'הסר כפילויות.', 'העתק את הרשימה הייחודית.'] },
    examples: [{ label: { en: 'Duplicate list', he: 'רשימה כפולה' }, input: 'apple\nbanana\napple\ncherry\nbanana' }],
    options: duplicateLineOptions,
    faq: [faq.private, faq.free],
    related: ['sort-lines', 'word-counter']
  },
  {
    slug: 'trim-whitespace',
    converterId: 'trimWhitespace',
    category: 'text',
    inputType: 'text',
    outputType: 'trimmed text',
    title: { en: 'Trim Whitespace Tool', he: 'כלי ניקוי רווחים' },
    shortTitle: { en: 'Trim Whitespace', he: 'ניקוי רווחים' },
    description: { en: 'Trim leading and trailing whitespace from every line of text.', he: 'נקה רווחים בתחילת ובסוף כל שורת טקסט.' },
    metaDescription: { en: 'Trim whitespace online from text and lists while keeping line structure.', he: 'ניקוי רווחים מטקסט ורשימות אונליין תוך שמירה על מבנה השורות.' },
    keywords: { en: ['trim whitespace', 'remove spaces'], he: ['ניקוי רווחים', 'הסרת רווחים'] },
    features: { en: ['Line trimming', 'Keeps line breaks', 'Fast cleanup'], he: ['ניקוי לפי שורה', 'שומר שורות', 'ניקוי מהיר'] },
    guide: { en: ['Paste text.', 'Trim whitespace.', 'Copy the cleaned result.'], he: ['הדבק טקסט.', 'נקה רווחים.', 'העתק את התוצאה הנקייה.'] },
    examples: [
      { label: { en: 'Messy lines', he: 'שורות לא נקיות' }, input: '  first line  \n   second line   ' },
      { label: { en: 'Padded values', he: 'ערכים עם רווחים' }, input: '  alpha  \n  beta  \n  gamma  ' }
    ],
    options: whitespaceOptions,
    faq: [faq.private, faq.free],
    related: ['remove-punctuation', 'remove-empty-lines', 'remove-duplicate-lines']
  },
  {
    slug: 'remove-punctuation',
    converterId: 'removePunctuation',
    category: 'text',
    inputType: 'text',
    outputType: 'clean text',
    title: { en: 'Remove Punctuation Tool', he: 'הסרת סימני פיסוק' },
    shortTitle: { en: 'Remove Punctuation', he: 'הסרת פיסוק' },
    description: { en: 'Remove punctuation and symbols from text for keyword cleanup, lists and simple text processing.', he: 'הסר סימני פיסוק וסמלים מטקסט עבור ניקוי מילות מפתח, רשימות ועיבוד טקסט פשוט.' },
    metaDescription: { en: 'Remove punctuation online from English, Hebrew and Unicode text for keywords, lists and cleanup workflows.', he: 'הסרת סימני פיסוק אונליין מטקסט עברי, אנגלי ו־Unicode עבור מילות מפתח, רשימות וניקוי טקסט.' },
    keywords: { en: ['remove punctuation', 'punctuation remover'], he: ['הסרת סימני פיסוק', 'מסיר פיסוק'] },
    features: { en: ['Punctuation cleanup', 'Unicode text', 'Keyword friendly'], he: ['ניקוי פיסוק', 'טקסט Unicode', 'נוח למילות מפתח'] },
    guide: { en: ['Paste text.', 'Remove punctuation.', 'Copy the cleaned words or list.'], he: ['הדבק טקסט.', 'הסר סימני פיסוק.', 'העתק את המילים או הרשימה הנקייה.'] },
    examples: [
      { label: { en: 'Keyword text', he: 'טקסט מילות מפתח' }, input: 'SEO tools, converters & calculators!' },
      { label: { en: 'Hebrew sentence', he: 'משפט בעברית' }, input: 'שלום, עולם! זה טקסט לבדיקה.' }
    ],
    faq: [faq.private, faq.free],
    related: ['trim-whitespace', 'word-counter', 'text-to-kebab-case']
  },
  {
    slug: 'remove-empty-lines',
    converterId: 'removeEmptyLines',
    category: 'text',
    inputType: 'lines',
    outputType: 'compact lines',
    title: { en: 'Remove Empty Lines Tool', he: 'הסרת שורות ריקות' },
    shortTitle: { en: 'Remove Empty Lines', he: 'הסרת שורות ריקות' },
    description: { en: 'Remove blank lines from lists, notes and multiline text.', he: 'הסר שורות ריקות מרשימות, הערות וטקסט רב־שורות.' },
    metaDescription: { en: 'Remove empty lines online from lists and multiline text with instant browser processing.', he: 'הסרת שורות ריקות אונליין מרשימות וטקסט רב־שורות בעיבוד מידי בדפדפן.' },
    keywords: { en: ['remove empty lines', 'delete blank lines'], he: ['הסרת שורות ריקות', 'מחיקת שורות ריקות'] },
    features: { en: ['Blank line removal', 'Keeps content order', 'List cleanup'], he: ['הסרת ריקות', 'שומר סדר', 'ניקוי רשימות'] },
    guide: { en: ['Paste multiline text.', 'Remove empty lines.', 'Copy the compact result.'], he: ['הדבק טקסט רב־שורות.', 'הסר שורות ריקות.', 'העתק את התוצאה המצומצמת.'] },
    examples: [
      { label: { en: 'List with gaps', he: 'רשימה עם רווחים' }, input: 'apple\n\nbanana\n   \ncherry' },
      { label: { en: 'CSV lines', he: 'שורות CSV' }, input: 'name,city\n\nDana,Haifa\n\nAvi,Jerusalem' }
    ],
    faq: [faq.private, faq.free],
    related: ['trim-whitespace', 'remove-duplicate-lines', 'sort-lines']
  },
  {
    slug: 'decimal-to-hex',
    converterId: 'decimalToHex',
    reverseSlug: 'hex-to-decimal',
    category: 'developer',
    inputType: 'decimal',
    outputType: 'hex',
    title: { en: 'Decimal to HEX Converter', he: 'ממיר Decimal ל־HEX' },
    shortTitle: { en: 'Decimal to HEX', he: 'Decimal ל־HEX' },
    description: { en: 'Convert whole decimal numbers into hexadecimal notation.', he: 'המר מספרים עשרוניים שלמים לייצוג הקסדצימלי.' },
    metaDescription: { en: 'Convert decimal to HEX online for programming, debugging and numeric work.', he: 'המרת Decimal ל־HEX אונליין עבור תכנות, דיבוג ועבודה מספרית.' },
    keywords: { en: ['decimal to hex', 'number to hex'], he: ['Decimal ל HEX', 'עשרוני להקסדצימלי'] },
    features: { en: ['Whole numbers', 'Uppercase HEX', '0x prefix'], he: ['מספרים שלמים', 'HEX באותיות גדולות', 'קידומת 0x'] },
    guide: { en: ['Paste a whole decimal number.', 'Convert to HEX.', 'Copy the hexadecimal value.'], he: ['הדבק מספר עשרוני שלם.', 'המר ל־HEX.', 'העתק את הערך ההקסדצימלי.'] },
    examples: [
      { label: { en: 'Decimal number', he: 'מספר עשרוני' }, input: '255' },
      { label: { en: 'Large number', he: 'מספר גדול' }, input: '65535' }
    ],
    faq: [faq.private, faq.free],
    related: ['hex-to-decimal', 'hex-to-rgb', 'rgb-to-hex']
  },
  {
    slug: 'hex-to-decimal',
    converterId: 'hexToDecimal',
    reverseSlug: 'decimal-to-hex',
    category: 'developer',
    inputType: 'hex',
    outputType: 'decimal',
    title: { en: 'HEX to Decimal Converter', he: 'ממיר HEX ל־Decimal' },
    shortTitle: { en: 'HEX to Decimal', he: 'HEX ל־Decimal' },
    description: { en: 'Convert hexadecimal numbers into decimal whole numbers.', he: 'המר מספרים הקסדצימליים למספרים עשרוניים שלמים.' },
    metaDescription: { en: 'Convert HEX to decimal online for programming, debugging and number conversion.', he: 'המרת HEX ל־Decimal אונליין עבור תכנות, דיבוג והמרות מספרים.' },
    keywords: { en: ['hex to decimal', 'hex number converter'], he: ['HEX ל Decimal', 'הקסדצימלי לעשרוני'] },
    features: { en: ['0x optional', 'Whole numbers', 'Instant result'], he: ['0x אופציונלי', 'מספרים שלמים', 'תוצאה מידית'] },
    guide: { en: ['Paste a HEX number.', 'Convert to decimal.', 'Copy the decimal value.'], he: ['הדבק מספר HEX.', 'המר ל־Decimal.', 'העתק את הערך העשרוני.'] },
    examples: [
      { label: { en: 'HEX number', he: 'מספר HEX' }, input: '0xFF' },
      { label: { en: 'Large HEX', he: 'HEX גדול' }, input: 'FFFF' }
    ],
    faq: [faq.private, faq.free],
    related: ['decimal-to-hex', 'hex-to-rgb', 'rgb-to-hex']
  },
  {
    slug: 'uuid-generator',
    converterId: 'uuidGenerator',
    category: 'developer',
    inputType: 'count',
    outputType: 'uuid',
    title: { en: 'UUID Generator', he: 'יוצר UUID' },
    shortTitle: { en: 'UUID Generator', he: 'יצירת UUID' },
    description: { en: 'Generate one or more UUID v4 values locally for testing, development and mock data.', he: 'צור ערכי UUID v4 אחד או יותר מקומית עבור בדיקות, פיתוח ונתוני דמה.' },
    metaDescription: { en: 'Generate UUID v4 values online in your browser. Enter a count and copy unique IDs for development or testing.', he: 'יצירת UUID v4 אונליין בדפדפן. הזן כמות והעתק מזהים ייחודיים לפיתוח או בדיקות.' },
    keywords: { en: ['uuid generator', 'guid generator'], he: ['יוצר UUID', 'מחולל GUID'] },
    features: { en: ['UUID v4', 'Multiple IDs', 'Local generation'], he: ['UUID v4', 'כמה מזהים', 'יצירה מקומית'] },
    guide: { en: ['Enter how many UUIDs to generate.', 'Convert to generate IDs.', 'Copy the list into code, tests or mock data.'], he: ['הזן כמה UUID ליצור.', 'לחץ המרה כדי ליצור מזהים.', 'העתק את הרשימה לקוד, בדיקות או נתוני דמה.'] },
    examples: [
      { label: { en: 'Five UUIDs', he: 'חמישה UUID' }, input: '5' },
      { label: { en: 'Single UUID', he: 'UUID אחד' }, input: '1' }
    ],
    faq: [faq.private, faq.free],
    related: ['json-formatter', 'decimal-to-hex', 'regex-escape']
  },
  {
    slug: 'percentage-calculator',
    converterId: 'percentageOf',
    category: 'calculator',
    inputType: 'numbers',
    outputType: 'percentage',
    popular: true,
    title: { en: 'Percentage Calculator', he: 'מחשבון אחוזים' },
    shortTitle: { en: 'Percentage Calculator', he: 'מחשבון אחוזים' },
    description: { en: 'Calculate what percentage of a number equals, such as 20% of 150.', he: 'חשב כמה שווה אחוז מסוים מתוך מספר, למשל 20% מתוך 150.' },
    metaDescription: { en: 'Free percentage calculator online. Calculate percent of a number locally in your browser with examples.', he: 'מחשבון אחוזים חינמי אונליין. חישוב אחוז מתוך מספר בדפדפן עם דוגמאות.' },
    keywords: { en: ['percentage calculator', 'percent of number'], he: ['מחשבון אחוזים', 'חישוב אחוזים'] },
    features: { en: ['Percent of number', 'Formula shown', 'Fast result'], he: ['אחוז מתוך מספר', 'נוסחה מוצגת', 'תוצאה מהירה'] },
    guide: { en: ['Enter percent and value, for example 20, 150.', 'Convert to calculate.', 'Copy the result and formula.'], he: ['הזן אחוז וערך, למשל 20, 150.', 'לחץ המרה לחישוב.', 'העתק את התוצאה והנוסחה.'] },
    examples: [
      { label: { en: '20% of 150', he: '20% מתוך 150' }, input: '20, 150' },
      { label: { en: '17% of 240', he: '17% מתוך 240' }, input: '17, 240' }
    ],
    faq: [faq.private, faq.free],
    related: ['percentage-change-calculator', 'discount-calculator', 'vat-calculator']
  },
  {
    slug: 'percentage-change-calculator',
    converterId: 'percentageChange',
    category: 'calculator',
    inputType: 'numbers',
    outputType: 'percentage',
    title: { en: 'Percentage Change Calculator', he: 'מחשבון שינוי באחוזים' },
    shortTitle: { en: 'Percentage Change', he: 'שינוי באחוזים' },
    description: { en: 'Calculate percentage increase or decrease between an old value and a new value.', he: 'חשב עלייה או ירידה באחוזים בין ערך ישן לערך חדש.' },
    metaDescription: { en: 'Calculate percentage change online between two values, including difference and increase or decrease percent.', he: 'חישוב שינוי באחוזים אונליין בין שני ערכים, כולל הפרש ואחוז עלייה או ירידה.' },
    keywords: { en: ['percentage change calculator', 'percent increase decrease'], he: ['מחשבון שינוי באחוזים', 'אחוז עליה ירידה'] },
    features: { en: ['Increase or decrease', 'Difference shown', 'Two-number input'], he: ['עלייה או ירידה', 'הפרש מוצג', 'קלט של שני מספרים'] },
    guide: { en: ['Enter old value and new value.', 'Convert to calculate the change.', 'Use the result for quick comparisons.'], he: ['הזן ערך ישן וערך חדש.', 'חשב את השינוי.', 'השתמש בתוצאה להשוואות מהירות.'] },
    examples: [
      { label: { en: 'Growth example', he: 'דוגמת גדילה' }, input: '100, 125' },
      { label: { en: 'Decrease example', he: 'דוגמת ירידה' }, input: '250, 200' }
    ],
    faq: [faq.private, faq.free],
    related: ['percentage-calculator', 'average-calculator', 'discount-calculator']
  },
  {
    slug: 'discount-calculator',
    converterId: 'discountCalculator',
    category: 'calculator',
    inputType: 'numbers',
    outputType: 'calculation',
    popular: true,
    title: { en: 'Discount Calculator', he: 'מחשבון הנחה' },
    shortTitle: { en: 'Discount Calculator', he: 'מחשבון הנחה' },
    description: { en: 'Calculate discount amount and final price from an original price and discount percentage.', he: 'חשב סכום הנחה ומחיר סופי לפי מחיר מקורי ואחוז הנחה.' },
    metaDescription: { en: 'Free discount calculator online. Enter price and discount percent to get discount amount and final price.', he: 'מחשבון הנחה חינמי אונליין. הזן מחיר ואחוז הנחה לקבלת סכום ההנחה והמחיר הסופי.' },
    keywords: { en: ['discount calculator', 'sale price calculator'], he: ['מחשבון הנחה', 'חישוב הנחה'] },
    features: { en: ['Final price', 'Discount amount', 'Percent input'], he: ['מחיר סופי', 'סכום הנחה', 'קלט אחוזים'] },
    guide: { en: ['Enter price and discount percent.', 'Convert to calculate final price.', 'Copy the breakdown.'], he: ['הזן מחיר ואחוז הנחה.', 'חשב מחיר סופי.', 'העתק את הפירוט.'] },
    examples: [
      { label: { en: '25% off 200', he: '25% הנחה מ־200' }, input: '200, 25' },
      { label: { en: 'Sale price', he: 'מחיר מבצע' }, input: '349, 15' }
    ],
    faq: [faq.private, faq.free],
    related: ['percentage-calculator', 'vat-calculator', 'percentage-change-calculator']
  },
  {
    slug: 'vat-calculator',
    converterId: 'vatCalculator',
    category: 'calculator',
    inputType: 'numbers',
    outputType: 'calculation',
    title: { en: 'VAT Calculator', he: 'מחשבון מע״מ' },
    shortTitle: { en: 'VAT Calculator', he: 'מחשבון מע״מ' },
    description: { en: 'Calculate tax amount and total price from a base amount and tax percentage.', he: 'חשב סכום מס ומחיר כולל לפי סכום בסיס ואחוז מס.' },
    metaDescription: { en: 'VAT calculator online for quick tax totals. Enter amount and tax percent to calculate tax and total.', he: 'מחשבון מע״מ אונליין לחישוב מהיר. הזן סכום ואחוז מס לקבלת סכום המס והסה״כ.' },
    keywords: { en: ['vat calculator', 'tax calculator'], he: ['מחשבון מעמ', 'חישוב מעמ'] },
    features: { en: ['Tax amount', 'Total with tax', 'Custom percent'], he: ['סכום מס', 'סה״כ כולל מס', 'אחוז מותאם'] },
    guide: { en: ['Enter amount and tax percent.', 'Convert to calculate tax and total.', 'Verify important tax use separately.'], he: ['הזן סכום ואחוז מס.', 'חשב מס וסה״כ.', 'אמת שימושי מס חשובים בנפרד.'] },
    examples: [
      { label: { en: '17% tax', he: '17% מס' }, input: '100, 17' },
      { label: { en: 'Custom tax', he: 'מס מותאם' }, input: '250, 8.5' }
    ],
    faq: [faq.private, faq.free],
    related: ['discount-calculator', 'percentage-calculator', 'average-calculator']
  },
  {
    slug: 'average-calculator',
    converterId: 'averageCalculator',
    category: 'calculator',
    inputType: 'numbers',
    outputType: 'calculation',
    title: { en: 'Average Calculator', he: 'מחשבון ממוצע' },
    shortTitle: { en: 'Average Calculator', he: 'מחשבון ממוצע' },
    description: { en: 'Calculate average, sum, median, minimum and maximum from a list of numbers.', he: 'חשב ממוצע, סכום, חציון, מינימום ומקסימום מרשימת מספרים.' },
    metaDescription: { en: 'Average calculator online. Paste numbers to calculate count, sum, average, median, min and max.', he: 'מחשבון ממוצע אונליין. הדבק מספרים לקבלת כמות, סכום, ממוצע, חציון, מינימום ומקסימום.' },
    keywords: { en: ['average calculator', 'mean calculator'], he: ['מחשבון ממוצע', 'חישוב ממוצע'] },
    features: { en: ['Average', 'Median', 'Min and max'], he: ['ממוצע', 'חציון', 'מינימום ומקסימום'] },
    guide: { en: ['Paste numbers separated by spaces, commas or lines.', 'Convert to calculate statistics.', 'Copy the summary.'], he: ['הדבק מספרים מופרדים ברווחים, פסיקים או שורות.', 'חשב סטטיסטיקה.', 'העתק את הסיכום.'] },
    examples: [
      { label: { en: 'Scores', he: 'ציונים' }, input: '82, 91, 77, 88, 95' },
      { label: { en: 'Revenue list', he: 'רשימת הכנסות' }, input: '1200\n1450\n1320\n1680' }
    ],
    faq: [faq.private, faq.free],
    related: ['percentage-change-calculator', 'percentage-calculator', 'ratio-simplifier']
  },
  {
    slug: 'ratio-simplifier',
    converterId: 'ratioSimplifier',
    category: 'calculator',
    inputType: 'ratio',
    outputType: 'ratio',
    title: { en: 'Ratio Simplifier', he: 'מצמצם יחס' },
    shortTitle: { en: 'Ratio Simplifier', he: 'צמצום יחס' },
    description: { en: 'Simplify ratios such as 1920:1080 into their smallest whole-number form.', he: 'צמצם יחסים כמו 1920:1080 לצורה השלמה הקטנה ביותר.' },
    metaDescription: { en: 'Simplify ratios online. Convert large ratios into smaller whole-number ratios and decimal values.', he: 'צמצום יחסים אונליין. המרת יחסים גדולים ליחס שלם קטן וערך עשרוני.' },
    keywords: { en: ['ratio simplifier', 'simplify ratio'], he: ['צמצום יחס', 'מחשבון יחס'] },
    features: { en: ['Simplified ratio', 'Decimal value', 'Aspect-ratio friendly'], he: ['יחס מצומצם', 'ערך עשרוני', 'מתאים ליחסי מסך'] },
    guide: { en: ['Enter two ratio numbers.', 'Convert to simplify.', 'Use the result for sizing, design or quick math.'], he: ['הזן שני מספרי יחס.', 'חשב צמצום.', 'השתמש בתוצאה למידות, עיצוב או חישוב מהיר.'] },
    examples: [
      { label: { en: 'HD aspect ratio', he: 'יחס מסך HD' }, input: '1920:1080' },
      { label: { en: 'Simple ratio', he: 'יחס פשוט' }, input: '150, 100' }
    ],
    faq: [faq.private, faq.free],
    related: ['average-calculator', 'percentage-calculator', 'text-to-kebab-case']
  },
  {
    slug: 'timestamp-to-date',
    converterId: 'timestampToDate',
    reverseSlug: 'date-to-timestamp',
    category: 'time',
    inputType: 'timestamp',
    outputType: 'date',
    title: { en: 'Unix Timestamp to Date', he: 'חותמת Unix לתאריך' },
    shortTitle: { en: 'Timestamp to Date', he: 'זמן Unix לתאריך' },
    description: { en: 'Convert Unix timestamps in seconds or milliseconds into readable dates.', he: 'המר חותמות זמן Unix בשניות או מילישניות לתאריכים קריאים.' },
    metaDescription: { en: 'Convert Unix timestamp to date online with UTC and local time output.', he: 'המרת Unix timestamp לתאריך אונליין עם פלט UTC וזמן מקומי.' },
    keywords: { en: ['timestamp to date', 'unix timestamp converter'], he: ['timestamp לתאריך', 'חותמת יוניקס'] },
    features: { en: ['Seconds or ms', 'UTC output', 'Local output'], he: ['שניות או מילישניות', 'פלט UTC', 'פלט מקומי'] },
    guide: { en: ['Paste a Unix timestamp.', 'Convert it.', 'Use UTC or local date output.'], he: ['הדבק timestamp של Unix.', 'המר אותו.', 'השתמש בפלט UTC או מקומי.'] },
    examples: [{ label: { en: 'Unix timestamp', he: 'חותמת Unix' }, input: '1704067200' }],
    options: timestampInputOptions,
    faq: [faq.private, faq.free],
    related: ['date-to-timestamp']
  },
  {
    slug: 'date-to-timestamp',
    converterId: 'dateToTimestamp',
    reverseSlug: 'timestamp-to-date',
    category: 'time',
    inputType: 'date',
    outputType: 'timestamp',
    title: { en: 'Date to Unix Timestamp', he: 'תאריך לחותמת Unix' },
    shortTitle: { en: 'Date to Timestamp', he: 'תאריך ל־Timestamp' },
    description: { en: 'Convert readable dates into Unix timestamps in seconds and milliseconds.', he: 'המר תאריכים קריאים לחותמות Unix בשניות ומילישניות.' },
    metaDescription: { en: 'Convert date to Unix timestamp online with seconds and milliseconds output.', he: 'המרת תאריך ל־Unix timestamp אונליין בשניות ומילישניות.' },
    keywords: { en: ['date to timestamp', 'unix timestamp'], he: ['תאריך לטיימסטמפ', 'תאריך ל Unix'] },
    features: { en: ['Seconds', 'Milliseconds', 'ISO date'], he: ['שניות', 'מילישניות', 'תאריך ISO'] },
    guide: { en: ['Paste a date string.', 'Convert it.', 'Copy the timestamp format you need.'], he: ['הדבק מחרוזת תאריך.', 'המר אותה.', 'העתק את פורמט הזמן הרצוי.'] },
    examples: [{ label: { en: 'ISO date', he: 'תאריך ISO' }, input: '2026-06-18T12:00:00Z' }],
    options: timestampOutputOptions,
    faq: [faq.private, faq.free],
    related: ['timestamp-to-date']
  },
  {
    slug: 'hex-to-rgb',
    converterId: 'hexToRgb',
    reverseSlug: 'rgb-to-hex',
    category: 'color',
    inputType: 'hex',
    outputType: 'rgb',
    title: { en: 'HEX to RGB Converter', he: 'ממיר HEX ל־RGB' },
    shortTitle: { en: 'HEX to RGB', he: 'HEX ל־RGB' },
    description: { en: 'Convert HEX color values into RGB and CSS-ready formats.', he: 'המר ערכי צבע HEX ל־RGB ופורמטים מוכנים ל־CSS.' },
    metaDescription: { en: 'Convert HEX to RGB online for CSS, design and frontend work.', he: 'המרת HEX ל־RGB אונליין עבור CSS, עיצוב ופיתוח פרונטאנד.' },
    keywords: { en: ['hex to rgb', 'color converter'], he: ['HEX ל RGB', 'ממיר צבעים'] },
    features: { en: ['RGB output', 'CSS format', 'Color preview'], he: ['פלט RGB', 'פורמט CSS', 'תצוגת צבע'] },
    guide: { en: ['Paste a HEX color.', 'Convert to RGB.', 'Use the CSS value in your project.'], he: ['הדבק צבע HEX.', 'המר ל־RGB.', 'השתמש בערך CSS בפרויקט.'] },
    examples: [
      { label: { en: 'Brand color', he: 'צבע מותג' }, input: '#4f46e5' },
      { label: { en: 'Short HEX', he: 'HEX קצר' }, input: '#0ea' }
    ],
    faq: [faq.private, faq.free],
    related: ['rgb-to-hex', 'hex-to-hsl', 'rgb-to-cmyk']
  },
  {
    slug: 'rgb-to-hex',
    converterId: 'rgbToHex',
    reverseSlug: 'hex-to-rgb',
    category: 'color',
    inputType: 'rgb',
    outputType: 'hex',
    title: { en: 'RGB to HEX Converter', he: 'ממיר RGB ל־HEX' },
    shortTitle: { en: 'RGB to HEX', he: 'RGB ל־HEX' },
    description: { en: 'Convert RGB color values into HEX for CSS and design systems.', he: 'המר ערכי RGB ל־HEX עבור CSS ומערכות עיצוב.' },
    metaDescription: { en: 'Convert RGB to HEX online for frontend and design work.', he: 'המרת RGB ל־HEX אונליין עבור פיתוח ועיצוב.' },
    keywords: { en: ['rgb to hex', 'color converter'], he: ['RGB ל HEX', 'ממיר צבעים'] },
    features: { en: ['HEX output', 'CSS ready', 'Fast'], he: ['פלט HEX', 'מוכן ל־CSS', 'מהיר'] },
    guide: { en: ['Paste RGB values.', 'Convert to HEX.', 'Copy the color code.'], he: ['הדבק ערכי RGB.', 'המר ל־HEX.', 'העתק את קוד הצבע.'] },
    examples: [
      { label: { en: 'RGB color', he: 'צבע RGB' }, input: 'rgb(79, 70, 229)' },
      { label: { en: 'Plain RGB', he: 'RGB פשוט' }, input: '14, 234, 170' }
    ],
    options: hexOutputOptions,
    faq: [faq.private, faq.free],
    related: ['hex-to-rgb', 'rgb-to-hsl', 'rgb-to-cmyk']
  },
  {
    slug: 'rgb-to-hsl',
    converterId: 'rgbToHsl',
    reverseSlug: 'hsl-to-rgb',
    category: 'color',
    inputType: 'rgb',
    outputType: 'hsl',
    title: { en: 'RGB to HSL Converter', he: 'ממיר RGB ל־HSL' },
    shortTitle: { en: 'RGB to HSL', he: 'RGB ל־HSL' },
    description: { en: 'Convert RGB colors into HSL values for CSS and design systems.', he: 'המר צבעי RGB לערכי HSL עבור CSS ומערכות עיצוב.' },
    metaDescription: { en: 'Convert RGB to HSL online for CSS color work and frontend design.', he: 'המרת RGB ל־HSL אונליין עבור צבעי CSS ועיצוב פרונטאנד.' },
    keywords: { en: ['rgb to hsl', 'hsl color converter'], he: ['RGB ל HSL', 'ממיר צבע HSL'] },
    features: { en: ['CSS HSL output', 'Hue degrees', 'Saturation and lightness'], he: ['פלט HSL ל־CSS', 'Hue במעלות', 'רוויה ובהירות'] },
    guide: { en: ['Paste RGB values.', 'Convert to HSL.', 'Copy the CSS-ready value.'], he: ['הדבק ערכי RGB.', 'המר ל־HSL.', 'העתק ערך מוכן ל־CSS.'] },
    examples: [
      { label: { en: 'RGB brand color', he: 'צבע RGB' }, input: 'rgb(79, 70, 229)' },
      { label: { en: 'Green tone', he: 'גוון ירוק' }, input: '14, 234, 170' }
    ],
    faq: [faq.private, faq.free],
    related: ['hsl-to-rgb', 'rgb-to-hex', 'hex-to-hsl']
  },
  {
    slug: 'hsl-to-rgb',
    converterId: 'hslToRgb',
    reverseSlug: 'rgb-to-hsl',
    category: 'color',
    inputType: 'hsl',
    outputType: 'rgb',
    title: { en: 'HSL to RGB Converter', he: 'ממיר HSL ל־RGB' },
    shortTitle: { en: 'HSL to RGB', he: 'HSL ל־RGB' },
    description: { en: 'Convert HSL color values into RGB for CSS and design handoff.', he: 'המר ערכי HSL ל־RGB עבור CSS והעברה מעיצוב לפיתוח.' },
    metaDescription: { en: 'Convert HSL to RGB online with CSS-friendly output for frontend work.', he: 'המרת HSL ל־RGB אונליין עם פלט ידידותי ל־CSS עבור פרונטאנד.' },
    keywords: { en: ['hsl to rgb', 'convert hsl rgb'], he: ['HSL ל RGB', 'ממיר HSL'] },
    features: { en: ['CSS RGB output', 'Hue support', 'Fast conversion'], he: ['פלט RGB ל־CSS', 'תמיכה ב־Hue', 'המרה מהירה'] },
    guide: { en: ['Paste HSL values.', 'Convert to RGB.', 'Copy the color value.'], he: ['הדבק ערכי HSL.', 'המר ל־RGB.', 'העתק את ערך הצבע.'] },
    examples: [
      { label: { en: 'HSL color', he: 'צבע HSL' }, input: 'hsl(243, 76%, 59%)' },
      { label: { en: 'Warm tone', he: 'גוון חם' }, input: 'hsl(32, 92%, 54%)' }
    ],
    faq: [faq.private, faq.free],
    related: ['rgb-to-hsl', 'hsl-to-hex', 'hex-to-rgb']
  },
  {
    slug: 'hex-to-hsl',
    converterId: 'hexToHsl',
    reverseSlug: 'hsl-to-hex',
    category: 'color',
    inputType: 'hex',
    outputType: 'hsl',
    title: { en: 'HEX to HSL Converter', he: 'ממיר HEX ל־HSL' },
    shortTitle: { en: 'HEX to HSL', he: 'HEX ל־HSL' },
    description: { en: 'Convert HEX colors into HSL values for CSS, themes and design systems.', he: 'המר צבעי HEX לערכי HSL עבור CSS, ערכות נושא ומערכות עיצוב.' },
    metaDescription: { en: 'Convert HEX to HSL online with CSS-ready output and instant color preview.', he: 'המרת HEX ל־HSL אונליין עם פלט מוכן ל־CSS ותצוגת צבע מידית.' },
    keywords: { en: ['hex to hsl', 'convert hex hsl'], he: ['HEX ל HSL', 'ממיר HEX HSL'] },
    features: { en: ['CSS HSL output', 'Short HEX support', 'Color preview'], he: ['פלט HSL ל־CSS', 'תמיכה ב־HEX קצר', 'תצוגת צבע'] },
    guide: { en: ['Paste a HEX color.', 'Convert to HSL.', 'Copy the HSL value into CSS.'], he: ['הדבק צבע HEX.', 'המר ל־HSL.', 'העתק את ערך ה־HSL ל־CSS.'] },
    examples: [
      { label: { en: 'Indigo HEX', he: 'HEX אינדיגו' }, input: '#4f46e5' },
      { label: { en: 'Short HEX', he: 'HEX קצר' }, input: '#0ea' }
    ],
    faq: [faq.private, faq.free],
    related: ['hsl-to-hex', 'hex-to-rgb', 'rgb-to-hsl']
  },
  {
    slug: 'hsl-to-hex',
    converterId: 'hslToHex',
    reverseSlug: 'hex-to-hsl',
    category: 'color',
    inputType: 'hsl',
    outputType: 'hex',
    title: { en: 'HSL to HEX Converter', he: 'ממיר HSL ל־HEX' },
    shortTitle: { en: 'HSL to HEX', he: 'HSL ל־HEX' },
    description: { en: 'Convert HSL color values into HEX codes for CSS and design handoff.', he: 'המר ערכי HSL לקודי HEX עבור CSS והעברה מעיצוב לפיתוח.' },
    metaDescription: { en: 'Convert HSL to HEX online with optional uppercase output and instant browser conversion.', he: 'המרת HSL ל־HEX אונליין עם אפשרות לאותיות גדולות והמרה מידית בדפדפן.' },
    keywords: { en: ['hsl to hex', 'convert hsl hex'], he: ['HSL ל HEX', 'ממיר HSL HEX'] },
    features: { en: ['HEX output', 'CSS ready', 'Color preview'], he: ['פלט HEX', 'מוכן ל־CSS', 'תצוגת צבע'] },
    guide: { en: ['Paste an HSL color.', 'Convert to HEX.', 'Choose uppercase or no # when needed.'], he: ['הדבק צבע HSL.', 'המר ל־HEX.', 'בחר אותיות גדולות או בלי # לפי הצורך.'] },
    examples: [
      { label: { en: 'HSL brand color', he: 'צבע HSL' }, input: 'hsl(243, 76%, 59%)' },
      { label: { en: 'Warm tone', he: 'גוון חם' }, input: 'hsl(32, 92%, 54%)' }
    ],
    options: hexOutputOptions,
    faq: [faq.private, faq.free],
    related: ['hex-to-hsl', 'hsl-to-rgb', 'rgb-to-hex']
  },
  {
    slug: 'rgb-to-cmyk',
    converterId: 'rgbToCmyk',
    reverseSlug: 'cmyk-to-rgb',
    category: 'color',
    inputType: 'rgb',
    outputType: 'cmyk',
    title: { en: 'RGB to CMYK Converter', he: 'ממיר RGB ל־CMYK' },
    shortTitle: { en: 'RGB to CMYK', he: 'RGB ל־CMYK' },
    description: { en: 'Convert RGB colors into CMYK percentages for print-oriented color work.', he: 'המר צבעי RGB לאחוזי CMYK עבור עבודת צבע שמיועדת לדפוס.' },
    metaDescription: { en: 'Convert RGB to CMYK online with clear channel percentages and color preview.', he: 'המרת RGB ל־CMYK אונליין עם אחוזי ערוצים ברורים ותצוגת צבע.' },
    keywords: { en: ['rgb to cmyk', 'cmyk converter'], he: ['RGB ל CMYK', 'ממיר CMYK'] },
    features: { en: ['CMYK percentages', 'RGB input', 'Color preview'], he: ['אחוזי CMYK', 'קלט RGB', 'תצוגת צבע'] },
    guide: { en: ['Paste RGB values.', 'Convert to CMYK.', 'Copy the percentages for print handoff.'], he: ['הדבק ערכי RGB.', 'המר ל־CMYK.', 'העתק את האחוזים להעברה לדפוס.'] },
    examples: [
      { label: { en: 'Brand RGB', he: 'RGB מותג' }, input: 'rgb(79, 70, 229)' },
      { label: { en: 'Teal RGB', he: 'RGB טורקיז' }, input: '14, 234, 170' }
    ],
    faq: [faq.private, faq.free],
    related: ['cmyk-to-rgb', 'rgb-to-hex', 'rgb-to-hsl']
  },
  {
    slug: 'cmyk-to-rgb',
    converterId: 'cmykToRgb',
    reverseSlug: 'rgb-to-cmyk',
    category: 'color',
    inputType: 'cmyk',
    outputType: 'rgb',
    title: { en: 'CMYK to RGB Converter', he: 'ממיר CMYK ל־RGB' },
    shortTitle: { en: 'CMYK to RGB', he: 'CMYK ל־RGB' },
    description: { en: 'Convert CMYK percentages into RGB values for web and CSS usage.', he: 'המר אחוזי CMYK לערכי RGB עבור שימוש בווב וב־CSS.' },
    metaDescription: { en: 'Convert CMYK to RGB online for web colors, CSS and design-to-code workflows.', he: 'המרת CMYK ל־RGB אונליין עבור צבעי ווב, CSS ועבודה מעיצוב לקוד.' },
    keywords: { en: ['cmyk to rgb', 'convert cmyk rgb'], he: ['CMYK ל RGB', 'ממיר CMYK RGB'] },
    features: { en: ['RGB output', 'CSS ready', 'Color preview'], he: ['פלט RGB', 'מוכן ל־CSS', 'תצוגת צבע'] },
    guide: { en: ['Paste four CMYK percentages.', 'Convert to RGB.', 'Copy the CSS-ready value.'], he: ['הדבק ארבעה אחוזי CMYK.', 'המר ל־RGB.', 'העתק את הערך המוכן ל־CSS.'] },
    examples: [
      { label: { en: 'Indigo CMYK', he: 'CMYK אינדיגו' }, input: 'cmyk(65%, 69%, 0%, 10%)' },
      { label: { en: 'Print values', he: 'ערכי דפוס' }, input: '94, 0, 27, 8' }
    ],
    faq: [faq.private, faq.free],
    related: ['rgb-to-cmyk', 'hex-to-rgb', 'rgb-to-hex']
  },
  {
    slug: 'character-remover',
    converterId: 'removeCharacters',
    category: 'text',
    inputType: 'text',
    outputType: 'clean text',
    new: true,
    title: { en: 'Character Remover', he: 'מסיר תווים מטקסט' },
    shortTitle: { en: 'Character Remover', he: 'מסיר תווים' },
    description: { en: 'Remove specific characters from text for cleanup, spreadsheets and URL lists.', he: 'הסר תווים מסוימים מטקסט לניקוי רשימות, גיליונות וכתובות URL.' },
    metaDescription: { en: 'Free character remover. Remove selected characters from text locally in your browser.', he: 'מסיר תווים חינמי. הסר תווים נבחרים מטקסט ישירות בדפדפן.' },
    keywords: { en: ['remove characters from text', 'character remover'], he: ['הסרת תווים מטקסט', 'מסיר תווים'] },
    features: { en: ['Custom characters', 'Unicode support', 'Local only'], he: ['תווים מותאמים', 'תמיכה ביוניקוד', 'מקומי בלבד'] },
    guide: { en: ['Write the characters to remove on the first line.', 'Paste the text on the following lines.', 'Convert and copy the cleaned text.'], he: ['כתוב בשורה הראשונה את התווים להסרה.', 'הדבק את הטקסט בשורות הבאות.', 'המר והעתק את הטקסט הנקי.'] },
    examples: [
      { label: { en: 'Remove vowels', he: 'הסרת תנועות' }, input: 'aeiou\nBeautiful converter text' },
      { label: { en: 'Clean punctuation', he: 'ניקוי סימנים' }, input: '.,!\nHello, world! שלום.' }
    ],
    faq: [faq.private, faq.free],
    related: ['remove-punctuation', 'trim-whitespace', 'find-replace']
  },
  {
    slug: 'prefix-suffix-lines',
    converterId: 'prefixSuffixLines',
    category: 'text',
    inputType: 'lines',
    outputType: 'lines',
    new: true,
    title: { en: 'Add Prefix and Suffix to Lines', he: 'הוספת קידומת וסיומת לשורות' },
    shortTitle: { en: 'Prefix/Suffix Lines', he: 'קידומת וסיומת' },
    description: { en: 'Add the same prefix and suffix to every line in a list.', he: 'הוסף קידומת וסיומת קבועות לכל שורה ברשימה.' },
    metaDescription: { en: 'Add prefix or suffix to every line online. Fast browser-only line editor.', he: 'הוספת קידומת או סיומת לכל שורה אונליין, במהירות ובדפדפן.' },
    keywords: { en: ['add prefix to each line', 'add suffix to each line'], he: ['הוספת קידומת לשורות', 'הוספת סיומת לשורות'] },
    features: { en: ['Line by line', 'Prefix and suffix', 'Bulk editing'], he: ['שורה אחרי שורה', 'קידומת וסיומת', 'עריכה בכמות'] },
    guide: { en: ['Use prefix= on line 1.', 'Use suffix= on line 2.', 'Paste the lines below.'], he: ['השתמש ב־prefix= בשורה 1.', 'השתמש ב־suffix= בשורה 2.', 'הדבק את השורות מתחת.'] },
    examples: [
      { label: { en: 'HTML list items', he: 'פריטי HTML' }, input: 'prefix=<li>\nsuffix=</li>\nJSON tools\nCSV tools\nText tools' },
      { label: { en: 'Quoted list', he: 'רשימה במרכאות' }, input: 'prefix="\nsuffix=",\nalpha\nbeta\ngamma' }
    ],
    faq: [faq.private, faq.free],
    related: ['add-line-numbers', 'sort-lines', 'remove-duplicate-lines']
  },
  {
    slug: 'find-replace',
    converterId: 'findReplaceText',
    category: 'text',
    inputType: 'text',
    outputType: 'text',
    new: true,
    title: { en: 'Find and Replace Text', he: 'חיפוש והחלפה בטקסט' },
    shortTitle: { en: 'Find Replace', he: 'חיפוש והחלפה' },
    description: { en: 'Find a phrase and replace every exact match in text.', he: 'מצא ביטוי והחלף כל התאמה מדויקת בטקסט.' },
    metaDescription: { en: 'Find and replace text online with local browser processing and instant output.', he: 'חיפוש והחלפה בטקסט אונליין עם עיבוד מקומי ופלט מידי.' },
    keywords: { en: ['find replace online', 'replace text online'], he: ['חיפוש והחלפה אונליין', 'החלפת טקסט'] },
    features: { en: ['Exact match', 'Bulk replacement', 'Replacement count'], he: ['התאמה מדויקת', 'החלפה בכמות', 'ספירת החלפות'] },
    guide: { en: ['Use find= on line 1.', 'Use replace= on line 2.', 'Paste the text below.'], he: ['השתמש ב־find= בשורה 1.', 'השתמש ב־replace= בשורה 2.', 'הדבק את הטקסט מתחת.'] },
    examples: [
      { label: { en: 'Update product name', he: 'עדכון שם מוצר' }, input: 'find=old converter\nreplace=online converter\nThis old converter is fast.' },
      { label: { en: 'Replace separator', he: 'החלפת מפריד' }, input: 'find=;\nreplace=,\none;two;three' }
    ],
    faq: [faq.private, faq.free],
    related: ['character-remover', 'trim-whitespace', 'remove-punctuation']
  },
  {
    slug: 'csv-to-tsv',
    converterId: 'csvToTsv',
    reverseSlug: 'tsv-to-csv',
    category: 'data',
    inputType: 'csv',
    outputType: 'tsv',
    new: true,
    title: { en: 'CSV to TSV Converter', he: 'ממיר CSV ל־TSV' },
    shortTitle: { en: 'CSV to TSV', he: 'CSV ל־TSV' },
    description: { en: 'Convert comma-separated CSV data into tab-separated TSV.', he: 'המר נתוני CSV מופרדי פסיקים לפורמט TSV מופרד טאבים.' },
    metaDescription: { en: 'Free CSV to TSV converter with quoted CSV support and local browser conversion.', he: 'ממיר CSV ל־TSV חינמי עם תמיכה במרכאות והמרה מקומית בדפדפן.' },
    keywords: { en: ['csv to tsv converter', 'convert csv to tsv'], he: ['CSV ל TSV', 'ממיר CSV TSV'] },
    features: { en: ['Quoted CSV support', 'TSV output', 'Spreadsheet friendly'], he: ['תמיכה ב־CSV עם מרכאות', 'פלט TSV', 'מתאים לגיליונות'] },
    guide: { en: ['Paste CSV data.', 'Choose the delimiter if needed.', 'Convert and download TSV.'], he: ['הדבק נתוני CSV.', 'בחר מפריד אם צריך.', 'המר והורד TSV.'] },
    examples: [{ label: { en: 'People CSV', he: 'CSV אנשים' }, input: 'name,city\nAvi,Jerusalem\nMaya,Tel Aviv' }],
    options: csvOutputOptions,
    faq: [faq.private, faq.free],
    related: ['tsv-to-csv', 'csv-to-json', 'json-to-csv']
  },
  {
    slug: 'tsv-to-csv',
    converterId: 'tsvToCsv',
    reverseSlug: 'csv-to-tsv',
    category: 'data',
    inputType: 'tsv',
    outputType: 'csv',
    new: true,
    title: { en: 'TSV to CSV Converter', he: 'ממיר TSV ל־CSV' },
    shortTitle: { en: 'TSV to CSV', he: 'TSV ל־CSV' },
    description: { en: 'Convert tab-separated TSV data into CSV for spreadsheets and imports.', he: 'המר נתוני TSV מופרדי טאבים ל־CSV עבור גיליונות וייבוא נתונים.' },
    metaDescription: { en: 'Convert TSV to CSV online in your browser with copy and download support.', he: 'המרת TSV ל־CSV אונליין בדפדפן עם העתקה והורדה.' },
    keywords: { en: ['tsv to csv converter', 'convert tsv to csv'], he: ['TSV ל CSV', 'ממיר TSV CSV'] },
    features: { en: ['Tab-separated input', 'CSV output', 'Download ready'], he: ['קלט מופרד טאבים', 'פלט CSV', 'מוכן להורדה'] },
    guide: { en: ['Paste TSV data.', 'Convert to CSV.', 'Copy or download the result.'], he: ['הדבק נתוני TSV.', 'המר ל־CSV.', 'העתק או הורד את התוצאה.'] },
    examples: [{ label: { en: 'People TSV', he: 'TSV אנשים' }, input: 'name\tcity\nAvi\tJerusalem\nMaya\tTel Aviv' }],
    faq: [faq.private, faq.free],
    related: ['csv-to-tsv', 'csv-to-json', 'json-to-csv']
  },
  {
    slug: 'url-parser',
    converterId: 'urlParser',
    category: 'developer',
    inputType: 'url',
    outputType: 'json',
    new: true,
    title: { en: 'URL Parser', he: 'מפרק URL' },
    shortTitle: { en: 'URL Parser', he: 'פירוק URL' },
    description: { en: 'Parse a full URL into protocol, host, path, query parameters and hash.', he: 'פרק URL מלא לפרוטוקול, דומיין, נתיב, פרמטרים ו־hash.' },
    metaDescription: { en: 'Parse URLs online into structured JSON with query parameters and path details.', he: 'פירוק URL אונליין ל־JSON מובנה עם פרמטרים ונתיב.' },
    keywords: { en: ['url parser online', 'parse url'], he: ['פירוק URL', 'URL parser'] },
    features: { en: ['Query parameters', 'Path details', 'JSON output'], he: ['פרמטרים', 'פרטי נתיב', 'פלט JSON'] },
    guide: { en: ['Paste a full URL.', 'Convert to parse it.', 'Use the JSON fields in debugging or documentation.'], he: ['הדבק URL מלא.', 'המר כדי לפרק אותו.', 'השתמש בשדות JSON לדיבוג או תיעוד.'] },
    examples: [{ label: { en: 'Search URL', he: 'URL חיפוש' }, input: 'https://example.com/search?q=online+converter&tag=json&tag=csv#results' }],
    faq: [faq.private, faq.free],
    related: ['query-string-to-json', 'json-to-query-string', 'url-decode']
  },
  {
    slug: 'aspect-ratio-calculator',
    converterId: 'aspectRatioCalculator',
    category: 'calculator',
    inputType: 'numbers',
    outputType: 'ratio',
    new: true,
    title: { en: 'Aspect Ratio Calculator', he: 'מחשבון יחס תמונה' },
    shortTitle: { en: 'Aspect Ratio', he: 'יחס תמונה' },
    description: { en: 'Calculate simplified aspect ratios for images, video, screens and layouts.', he: 'חשב יחס תמונה מצומצם עבור תמונות, וידאו, מסכים ולייאאוטים.' },
    metaDescription: { en: 'Aspect ratio calculator for width and height values. Get simplified ratios like 16:9.', he: 'מחשבון יחס תמונה לרוחב וגובה. קבל יחסים מצומצמים כמו 16:9.' },
    keywords: { en: ['aspect ratio calculator', 'calculate aspect ratio'], he: ['מחשבון יחס תמונה', 'יחס מסך'] },
    features: { en: ['Simplified ratio', 'Decimal value', 'Orientation'], he: ['יחס מצומצם', 'ערך עשרוני', 'כיוון'] },
    guide: { en: ['Enter width and height.', 'Convert to calculate.', 'Copy the simplified ratio.'], he: ['הזן רוחב וגובה.', 'המר לחישוב.', 'העתק את היחס המצומצם.'] },
    examples: [
      { label: { en: 'Full HD', he: 'Full HD' }, input: '1920, 1080' },
      { label: { en: 'Portrait', he: 'פורטרט' }, input: '1080, 1920' }
    ],
    faq: [faq.private, faq.free],
    related: ['ratio-simplifier', 'percentage-change-calculator', 'average-calculator']
  },
  {
    slug: 'color-contrast-checker',
    converterId: 'colorContrastChecker',
    category: 'color',
    inputType: 'text',
    outputType: 'calculation',
    new: true,
    title: { en: 'Color Contrast Checker', he: 'בודק קונטרסט צבעים' },
    shortTitle: { en: 'Contrast Checker', he: 'בדיקת קונטרסט' },
    description: { en: 'Check WCAG contrast ratio between two HEX or RGB colors.', he: 'בדוק יחס קונטרסט WCAG בין שני צבעי HEX או RGB.' },
    metaDescription: { en: 'Free color contrast checker for WCAG AA and AAA using HEX or RGB colors.', he: 'בודק קונטרסט צבעים חינמי ל־WCAG AA ו־AAA עם HEX או RGB.' },
    keywords: { en: ['color contrast checker', 'wcag contrast checker'], he: ['בדיקת קונטרסט צבעים', 'WCAG צבעים'] },
    features: { en: ['WCAG AA', 'WCAG AAA', 'HEX and RGB'], he: ['WCAG AA', 'WCAG AAA', 'HEX ו־RGB'] },
    guide: { en: ['Enter foreground on line 1.', 'Enter background on line 2.', 'Convert to see pass/fail results.'], he: ['הזן צבע קדמי בשורה 1.', 'הזן רקע בשורה 2.', 'המר כדי לראות עובר/נכשל.'] },
    examples: [
      { label: { en: 'Dark on white', he: 'כהה על לבן' }, input: '#111827\n#ffffff' },
      { label: { en: 'Brand on white', he: 'מותג על לבן' }, input: 'rgb(79, 70, 229)\n#ffffff' }
    ],
    faq: [faq.private, faq.free],
    related: ['hex-to-rgb', 'rgb-to-hex', 'hex-to-hsl']
  },
  {
    slug: 'meta-title-length-checker',
    converterId: 'metaTitleLengthChecker',
    category: 'developer',
    inputType: 'text',
    outputType: 'count',
    new: true,
    title: { en: 'Meta Title Length Checker', he: 'בודק אורך Meta Title' },
    shortTitle: { en: 'Title Length', he: 'אורך Title' },
    description: { en: 'Check if an SEO title is within the recommended character range.', he: 'בדוק אם כותרת SEO נמצאת בטווח התווים המומלץ.' },
    metaDescription: { en: 'Free meta title length checker for SEO titles, character count and recommended range.', he: 'בודק אורך Meta Title חינמי ל־SEO, ספירת תווים וטווח מומלץ.' },
    keywords: { en: ['meta title length checker', 'title length checker'], he: ['בדיקת אורך טייטל', 'Meta Title SEO'] },
    features: { en: ['Character count', 'SEO range', 'Status'], he: ['ספירת תווים', 'טווח SEO', 'סטטוס'] },
    guide: { en: ['Paste your SEO title.', 'Convert to count characters.', 'Adjust toward the recommended range.'], he: ['הדבק כותרת SEO.', 'המר לספירת תווים.', 'התאם לטווח המומלץ.'] },
    examples: [{ label: { en: 'SEO title', he: 'כותרת SEO' }, input: 'JSON to CSV Converter - Free Online Tool' }],
    faq: [faq.private, faq.free],
    related: ['meta-description-length-checker', 'word-counter', 'slug-generator']
  },
  {
    slug: 'meta-description-length-checker',
    converterId: 'metaDescriptionLengthChecker',
    category: 'developer',
    inputType: 'text',
    outputType: 'count',
    new: true,
    title: { en: 'Meta Description Length Checker', he: 'בודק אורך Meta Description' },
    shortTitle: { en: 'Description Length', he: 'אורך Description' },
    description: { en: 'Check meta description length against common SEO recommendations.', he: 'בדוק אורך Meta Description מול המלצות SEO נפוצות.' },
    metaDescription: { en: 'Free meta description length checker with character count and recommended SEO range.', he: 'בודק אורך Meta Description חינמי עם ספירת תווים וטווח SEO מומלץ.' },
    keywords: { en: ['meta description length checker', 'description length checker'], he: ['בדיקת אורך מטא דיסקריפשן', 'Meta Description SEO'] },
    features: { en: ['Character count', 'SEO recommendation', 'Local only'], he: ['ספירת תווים', 'המלצת SEO', 'מקומי בלבד'] },
    guide: { en: ['Paste the meta description.', 'Convert to count characters.', 'Shorten or expand the copy if needed.'], he: ['הדבק Meta Description.', 'המר לספירת תווים.', 'קצר או הרחב את הטקסט לפי הצורך.'] },
    examples: [{ label: { en: 'Meta description', he: 'Meta Description' }, input: 'Convert JSON to CSV online for free. Fast browser-only conversion with copy, download, examples and bilingual Hebrew and English UI.' }],
    faq: [faq.private, faq.free],
    related: ['meta-title-length-checker', 'word-counter', 'slug-generator']
  },
  {
    slug: 'jwt-expiration-checker',
    converterId: 'jwtExpirationChecker',
    category: 'developer',
    inputType: 'jwt',
    outputType: 'calculation',
    new: true,
    title: { en: 'JWT Expiration Checker', he: 'בודק תפוגת JWT' },
    shortTitle: { en: 'JWT Exp Checker', he: 'תפוגת JWT' },
    description: { en: 'Decode the exp claim in a JWT and check whether the token is expired.', he: 'פענח את שדה exp בתוך JWT ובדוק אם הטוקן פג תוקף.' },
    metaDescription: { en: 'Check JWT expiration online in your browser. Decode exp, UTC expiry time and remaining seconds without upload.', he: 'בדיקת תפוגת JWT אונליין בדפדפן. פענוח exp, זמן UTC ושניות שנותרו בלי העלאה.' },
    keywords: { en: ['jwt expiration checker', 'jwt exp checker'], he: ['בדיקת תפוגת JWT', 'JWT exp'] },
    features: { en: ['exp claim', 'Expiry status', 'Local decode'], he: ['שדה exp', 'סטטוס תפוגה', 'פענוח מקומי'] },
    guide: { en: ['Paste a JWT.', 'Convert to decode the exp claim.', 'Use the result for debugging only, not signature verification.'], he: ['הדבק JWT.', 'המר לפענוח שדה exp.', 'השתמש בתוצאה לדיבוג בלבד, לא לאימות חתימה.'] },
    examples: [{ label: { en: 'JWT with exp', he: 'JWT עם exp' }, input: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiRGFuYSIsImV4cCI6MTg5MzQ1NjAwMH0.signature' }],
    faq: [faq.private, faq.free],
    related: ['jwt-decoder', 'base64-decode', 'json-formatter']
  },
  {
    slug: 'text-to-morse-code',
    converterId: 'textToMorse',
    reverseSlug: 'morse-code-to-text',
    category: 'encoding',
    inputType: 'text',
    outputType: 'morse',
    new: true,
    title: { en: 'Text to Morse Code Converter', he: 'ממיר טקסט לקוד מורס' },
    shortTitle: { en: 'Text to Morse', he: 'טקסט למורס' },
    description: { en: 'Convert English letters, numbers and common symbols into Morse code.', he: 'המר אותיות באנגלית, מספרים וסימנים נפוצים לקוד מורס.' },
    metaDescription: { en: 'Convert text to Morse code online with dots, dashes and word separators.', he: 'המרת טקסט לקוד מורס אונליין עם נקודות, קווים ומפרידי מילים.' },
    keywords: { en: ['text to morse code', 'morse code encoder'], he: ['טקסט לקוד מורס', 'ממיר מורס'] },
    features: { en: ['Letters and numbers', 'Word separators', 'Instant output'], he: ['אותיות ומספרים', 'מפרידי מילים', 'פלט מידי'] },
    guide: { en: ['Paste English text.', 'Convert to Morse.', 'Copy the dots and dashes.'], he: ['הדבק טקסט באנגלית.', 'המר למורס.', 'העתק את הנקודות והקווים.'] },
    examples: [
      { label: { en: 'SOS', he: 'SOS' }, input: 'SOS' },
      { label: { en: 'Greeting', he: 'ברכה' }, input: 'Hello 2026' }
    ],
    faq: [faq.private, faq.free],
    related: ['morse-code-to-text', 'text-to-binary', 'text-to-unicode-escape']
  },
  {
    slug: 'morse-code-to-text',
    converterId: 'morseToText',
    reverseSlug: 'text-to-morse-code',
    category: 'encoding',
    inputType: 'morse',
    outputType: 'text',
    new: true,
    title: { en: 'Morse Code to Text Converter', he: 'ממיר קוד מורס לטקסט' },
    shortTitle: { en: 'Morse to Text', he: 'מורס לטקסט' },
    description: { en: 'Decode Morse code into readable text using spaces between letters and / between words.', he: 'פענח קוד מורס לטקסט קריא עם רווחים בין אותיות ו־/ בין מילים.' },
    metaDescription: { en: 'Decode Morse code to text online. Convert dots and dashes into readable letters in your browser.', he: 'פענוח קוד מורס לטקסט אונליין. המרת נקודות וקווים לאותיות בדפדפן.' },
    keywords: { en: ['morse code to text', 'morse code decoder'], he: ['קוד מורס לטקסט', 'מפענח מורס'] },
    features: { en: ['Dots and dashes', 'Word separators', 'Unknown symbol warnings'], he: ['נקודות וקווים', 'מפרידי מילים', 'אזהרות לסימנים לא מוכרים'] },
    guide: { en: ['Paste Morse code.', 'Use spaces between letters and / between words.', 'Convert to text.'], he: ['הדבק קוד מורס.', 'השתמש ברווח בין אותיות ו־/ בין מילים.', 'המר לטקסט.'] },
    examples: [
      { label: { en: 'SOS', he: 'SOS' }, input: '... --- ...' },
      { label: { en: 'Greeting', he: 'ברכה' }, input: '.... . .-.. .-.. --- / ..--- ----- ..--- -....' }
    ],
    faq: [faq.private, faq.free],
    related: ['text-to-morse-code', 'binary-to-text', 'unicode-escape-to-text']
  },
  {
    slug: 'rule-of-three-calculator',
    converterId: 'ruleOfThreeCalculator',
    category: 'calculator',
    inputType: 'numbers',
    outputType: 'calculation',
    new: true,
    title: { en: 'Rule of Three Calculator', he: 'מחשבון ערך משולש' },
    shortTitle: { en: 'Rule of Three', he: 'ערך משולש' },
    description: { en: 'Solve direct proportions with three known values and one unknown value.', he: 'פתור יחס ישר עם שלושה ערכים ידועים וערך חסר אחד.' },
    metaDescription: { en: 'Rule of three calculator online. Enter A, B and C to solve X using direct proportion.', he: 'מחשבון ערך משולש אונליין. הזן A, B ו־C למציאת X לפי יחס ישר.' },
    keywords: { en: ['rule of three calculator', 'proportion calculator'], he: ['מחשבון ערך משולש', 'חישוב יחס ישר'] },
    features: { en: ['Direct proportion', 'Formula shown', 'Fast result'], he: ['יחס ישר', 'נוסחה מוצגת', 'תוצאה מהירה'] },
    guide: { en: ['Enter A, B and C.', 'Convert to calculate X.', 'Use it for quick proportion problems.'], he: ['הזן A, B ו־C.', 'המר לחישוב X.', 'השתמש לבעיות יחס מהירות.'] },
    examples: [
      { label: { en: 'Simple proportion', he: 'יחס פשוט' }, input: '2, 10, 5' },
      { label: { en: 'Recipe scale', he: 'הגדלת מתכון' }, input: '4, 250, 10' }
    ],
    faq: [faq.private, faq.free],
    related: ['ratio-simplifier', 'percentage-calculator', 'average-calculator']
  },
  {
    slug: 'robots-txt-tester',
    converterId: 'robotsTxtTester',
    category: 'developer',
    inputType: 'robots',
    outputType: 'stats',
    new: true,
    title: { en: 'Robots.txt Tester', he: 'בודק robots.txt' },
    shortTitle: { en: 'Robots Tester', he: 'בדיקת Robots' },
    description: { en: 'Inspect robots.txt directives, count allow/disallow rules and spot common crawl blockers.', he: 'בדוק הנחיות robots.txt, ספר allow/disallow וזהה חסימות זחילה נפוצות.' },
    metaDescription: { en: 'Robots.txt tester for quick local checks of user-agent, allow, disallow and sitemap directives.', he: 'בודק robots.txt לבדיקות מקומיות של user-agent, allow, disallow ו־sitemap.' },
    keywords: { en: ['robots txt tester', 'robots.txt checker'], he: ['בודק robots.txt', 'בדיקת robots'] },
    features: { en: ['Directive counts', 'Block-all warning', 'Local only'], he: ['ספירת הנחיות', 'אזהרת חסימה מלאה', 'מקומי בלבד'] },
    guide: { en: ['Paste robots.txt content.', 'Convert to inspect directives.', 'Review warnings before publishing.'], he: ['הדבק תוכן robots.txt.', 'המר לבדיקת ההנחיות.', 'בדוק אזהרות לפני פרסום.'] },
    examples: [{ label: { en: 'Basic robots.txt', he: 'robots.txt בסיסי' }, input: 'User-agent: *\nAllow: /\nSitemap: https://example.com/sitemap.xml' }],
    faq: [faq.private, faq.free],
    related: ['sitemap-url-counter', 'meta-title-length-checker', 'url-parser']
  },
  {
    slug: 'sitemap-url-counter',
    converterId: 'sitemapUrlCounter',
    category: 'developer',
    inputType: 'sitemap',
    outputType: 'stats',
    new: true,
    title: { en: 'Sitemap URL Counter', he: 'סופר כתובות Sitemap' },
    shortTitle: { en: 'Sitemap Counter', he: 'ספירת Sitemap' },
    description: { en: 'Count URLs, duplicates and hosts in a pasted XML sitemap.', he: 'ספור כתובות, כפילויות ודומיינים בתוך sitemap XML שהודבק.' },
    metaDescription: { en: 'Count URLs in XML sitemap content locally in your browser, including duplicates and hosts.', he: 'ספירת כתובות בתוך sitemap XML בדפדפן, כולל כפילויות ודומיינים.' },
    keywords: { en: ['sitemap url counter', 'sitemap checker online'], he: ['ספירת sitemap', 'בודק sitemap'] },
    features: { en: ['URL count', 'Duplicate count', 'Host summary'], he: ['ספירת URL', 'ספירת כפילויות', 'סיכום דומיינים'] },
    guide: { en: ['Paste sitemap XML.', 'Convert to count URLs.', 'Use the summary for SEO checks.'], he: ['הדבק sitemap XML.', 'המר לספירת כתובות.', 'השתמש בסיכום לבדיקות SEO.'] },
    examples: [{ label: { en: 'Small sitemap', he: 'Sitemap קטן' }, input: '<?xml version="1.0"?>\n<urlset>\n  <url><loc>https://example.com/</loc></url>\n  <url><loc>https://example.com/tools/</loc></url>\n</urlset>' }],
    faq: [faq.private, faq.free],
    related: ['robots-txt-tester', 'url-parser', 'meta-description-length-checker']
  },
  {
    slug: 'number-base-converter',
    converterId: 'numberBaseConverter',
    category: 'calculator',
    inputType: 'numbers',
    outputType: 'calculation',
    new: true,
    title: { en: 'Number Base Converter', he: 'ממיר בסיסי מספרים' },
    shortTitle: { en: 'Number Bases', he: 'בסיסי מספרים' },
    description: { en: 'Convert whole numbers between decimal, binary, octal and hexadecimal.', he: 'המר מספרים שלמים בין Decimal, Binary, Octal ו־Hexadecimal.' },
    metaDescription: { en: 'Convert number bases online between decimal, binary, octal and hexadecimal.', he: 'המרת בסיסי מספרים אונליין בין Decimal, Binary, Octal ו־Hexadecimal.' },
    keywords: { en: ['number base converter', 'binary decimal hex converter'], he: ['ממיר בסיסי מספרים', 'בינארי דצימלי הקס'] },
    features: { en: ['Decimal', 'Binary', 'Octal and HEX'], he: ['Decimal', 'Binary', 'Octal ו־HEX'] },
    guide: { en: ['Enter a whole number.', 'Use 0b, 0o or 0x prefixes when needed.', 'Convert to see all bases.'], he: ['הזן מספר שלם.', 'השתמש ב־0b, 0o או 0x לפי הצורך.', 'המר כדי לראות את כל הבסיסים.'] },
    examples: [
      { label: { en: 'Decimal', he: 'Decimal' }, input: '255' },
      { label: { en: 'Binary', he: 'Binary' }, input: '0b11111111' }
    ],
    faq: [faq.private, faq.free],
    related: ['decimal-to-hex', 'hex-to-decimal', 'text-to-binary']
  },
  {
    slug: 'random-number-generator',
    converterId: 'randomNumberGenerator',
    category: 'calculator',
    inputType: 'numbers',
    outputType: 'numbers',
    new: true,
    title: { en: 'Random Number Generator', he: 'מחולל מספרים אקראיים' },
    shortTitle: { en: 'Random Numbers', he: 'מספרים אקראיים' },
    description: { en: 'Generate random whole numbers from a count, minimum and maximum range.', he: 'צור מספרים שלמים אקראיים לפי כמות, מינימום ומקסימום.' },
    metaDescription: { en: 'Random number generator online. Enter count, min and max to generate numbers locally.', he: 'מחולל מספרים אקראיים אונליין. הזן כמות, מינימום ומקסימום ליצירה מקומית.' },
    keywords: { en: ['random number generator', 'random number picker'], he: ['מחולל מספרים אקראיים', 'מספר רנדומלי'] },
    features: { en: ['Custom range', 'Multiple numbers', 'Local generation'], he: ['טווח מותאם', 'כמה מספרים', 'יצירה מקומית'] },
    guide: { en: ['Enter count, minimum and maximum.', 'Convert to generate numbers.', 'Copy the list.'], he: ['הזן כמות, מינימום ומקסימום.', 'המר ליצירת מספרים.', 'העתק את הרשימה.'] },
    examples: [
      { label: { en: 'Ten numbers 1-100', he: 'עשרה מספרים 1-100' }, input: '10, 1, 100' },
      { label: { en: 'One dice roll', he: 'הטלת קובייה אחת' }, input: '1, 1, 6' }
    ],
    faq: [faq.private, faq.free],
    related: ['uuid-generator', 'average-calculator', 'number-base-converter']
  },
  {
    slug: 'jwt-decoder',
    converterId: 'jwtDecoder',
    category: 'developer',
    inputType: 'jwt',
    outputType: 'json',
    title: { en: 'JWT Decoder', he: 'מפענח JWT' },
    shortTitle: { en: 'JWT Decoder', he: 'פענוח JWT' },
    description: { en: 'Decode JWT header and payload locally without verifying the signature.', he: 'פענח header ו־payload של JWT מקומית ללא אימות חתימה.' },
    metaDescription: { en: 'Decode JWT tokens online in your browser. Header and payload only; no upload.', he: 'פענוח JWT אונליין בדפדפן. header ו־payload בלבד, בלי העלאה.' },
    keywords: { en: ['jwt decoder', 'decode jwt'], he: ['פענוח JWT', 'JWT decoder'] },
    features: { en: ['Header', 'Payload', 'Local only'], he: ['Header', 'Payload', 'מקומי בלבד'] },
    guide: { en: ['Paste a JWT.', 'Decode header and payload.', 'Do not treat this as signature verification.'], he: ['הדבק JWT.', 'פענח header ו־payload.', 'אל תתייחס לזה כאימות חתימה.'] },
    examples: [{ label: { en: 'Sample JWT', he: 'JWT לדוגמה' }, input: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiRGFuYSIsImFkbWluIjpmYWxzZX0.signature' }],
    faq: [faq.private, faq.free],
    related: ['jwt-expiration-checker', 'base64-decode', 'json-formatter']
  }
];

export const converterBySlug = new Map(converters.map((tool) => [tool.slug, tool]));
