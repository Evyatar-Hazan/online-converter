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
    metaDescription: { en: 'Minify JSON online with a fast local browser tool.', he: 'כיווץ JSON אונליין באמצעות כלי מהיר שרץ בדפדפן.' },
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
    faq: [faq.private, faq.free],
    related: ['url-encode', 'base64-decode']
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
    related: ['slug-generator', 'word-counter', 'remove-duplicate-lines']
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
    related: ['text-case-converter', 'url-encode']
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
    related: ['remove-duplicate-lines', 'word-counter']
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
    metaDescription: { en: 'Remove duplicate lines online from lists and text.', he: 'הסרת שורות כפולות אונליין מרשימות וטקסט.' },
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
    related: ['remove-empty-lines', 'remove-duplicate-lines', 'sort-lines']
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
    related: ['rgb-to-hex']
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
    faq: [faq.private, faq.free],
    related: ['hex-to-rgb']
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
    related: ['hsl-to-rgb', 'rgb-to-hex', 'hex-to-rgb']
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
    related: ['rgb-to-hsl', 'rgb-to-hex', 'hex-to-rgb']
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
    related: ['base64-decode', 'json-formatter']
  }
];

export const converterBySlug = new Map(converters.map((tool) => [tool.slug, tool]));
