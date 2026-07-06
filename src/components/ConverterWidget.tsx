import React, { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { AlertTriangle, ArrowLeftRight, CheckCircle2, Clipboard, Download, Eraser, FileText, Link, Play, Sparkles } from 'lucide-react';
import { convert } from '../lib/converter-functions';
import type { ConvertPreview, ConverterOptions, ConverterTool, Locale } from '../types';
import { ui } from '../data/site';

interface ConverterWidgetProps {
  tool: ConverterTool;
  locale: Locale;
}

const formatLabels: Record<Locale, Record<string, string>> = {
  en: {
    json: 'JSON',
    jsonl: 'JSONL',
    csv: 'CSV',
    tsv: 'TSV',
    xml: 'XML',
    yaml: 'YAML',
    css: 'CSS',
    markdown: 'Markdown',
    schema: 'Schema',
    typescript: 'TypeScript',
    text: 'Text',
    diff: 'Diff',
    list: 'List',
    binary: 'Binary',
    morse: 'Morse',
    base64: 'Base64',
    decimal: 'Decimal',
    octal: 'Octal',
    url: 'URL',
    'query string': 'Query string',
    html: 'HTML',
    'escaped html': 'Escaped HTML',
    slug: 'Slug',
    stats: 'Stats',
    lines: 'Lines',
    'sorted lines': 'Sorted lines',
    'unique lines': 'Unique lines',
    'trimmed text': 'Trimmed text',
    'compact lines': 'Compact lines',
    'numbered lines': 'Numbered lines',
    'clean text': 'Clean text',
    'camel case': 'camelCase',
    'snake case': 'snake_case',
    'kebab case': 'kebab-case',
    timestamp: 'Timestamp',
    date: 'Date',
    hex: 'HEX',
    rgb: 'RGB',
    hsl: 'HSL',
    cmyk: 'CMYK',
    jwt: 'JWT',
    robots: 'robots.txt',
    sitemap: 'Sitemap',
    'user agent': 'User agent',
    'status code': 'Status code',
    phonetic: 'Phonetic',
    days: 'Days',
    palette: 'Palette',
    mime: 'MIME',
    bmi: 'BMI',
    salary: 'Salary',
    cipher: 'Cipher',
    utm: 'UTM',
    'json path': 'JSON Path',
    frequency: 'Frequency',
    duration: 'Duration',
    regex: 'Regex',
    'unicode escape': 'Unicode escape',
    count: 'Count',
    uuid: 'UUID',
    numbers: 'Numbers',
    percentage: 'Percentage',
    calculation: 'Calculation',
    ratio: 'Ratio'
  },
  he: {
    json: 'JSON',
    jsonl: 'JSONL',
    csv: 'CSV',
    tsv: 'TSV',
    xml: 'XML',
    yaml: 'YAML',
    css: 'CSS',
    markdown: 'Markdown',
    schema: 'Schema',
    typescript: 'TypeScript',
    text: 'טקסט',
    diff: 'הבדלים',
    list: 'רשימה',
    binary: 'בינארי',
    morse: 'Morse',
    base64: 'Base64',
    decimal: 'Decimal',
    octal: 'Octal',
    url: 'URL',
    'query string': 'Query String',
    html: 'HTML',
    'escaped html': 'HTML מקודד',
    slug: 'Slug',
    stats: 'סטטיסטיקה',
    lines: 'שורות',
    'sorted lines': 'שורות ממוינות',
    'unique lines': 'שורות ייחודיות',
    'trimmed text': 'טקסט נקי',
    'compact lines': 'שורות מצומצמות',
    'numbered lines': 'שורות ממוספרות',
    'clean text': 'טקסט נקי',
    'camel case': 'camelCase',
    'snake case': 'snake_case',
    'kebab case': 'kebab-case',
    timestamp: 'חותמת זמן',
    date: 'תאריך',
    hex: 'HEX',
    rgb: 'RGB',
    hsl: 'HSL',
    cmyk: 'CMYK',
    jwt: 'JWT',
    robots: 'robots.txt',
    sitemap: 'Sitemap',
    'user agent': 'User Agent',
    'status code': 'קוד סטטוס',
    phonetic: 'פונטי',
    days: 'ימים',
    palette: 'פלטת צבעים',
    mime: 'MIME',
    bmi: 'BMI',
    salary: 'שכר',
    cipher: 'צופן',
    utm: 'UTM',
    'json path': 'JSON Path',
    frequency: 'תדירות',
    duration: 'משך זמן',
    regex: 'Regex',
    'unicode escape': 'Unicode Escape',
    count: 'כמות',
    uuid: 'UUID',
    numbers: 'מספרים',
    percentage: 'אחוזים',
    calculation: 'חישוב',
    ratio: 'יחס'
  }
};

const outputExtensions: Record<string, string> = {
  json: 'json',
  jsonl: 'jsonl',
  csv: 'csv',
  tsv: 'tsv',
  xml: 'xml',
  yaml: 'yaml',
  css: 'css',
  markdown: 'md',
  schema: 'json',
  typescript: 'ts',
  text: 'txt',
  diff: 'txt',
  list: 'txt',
  binary: 'txt',
  morse: 'txt',
  base64: 'txt',
  decimal: 'txt',
  octal: 'txt',
  url: 'txt',
  'query string': 'txt',
  html: 'html',
  'escaped html': 'html',
  slug: 'txt',
  stats: 'txt',
  lines: 'txt',
  'sorted lines': 'txt',
  'unique lines': 'txt',
  'trimmed text': 'txt',
  'compact lines': 'txt',
  'numbered lines': 'txt',
  'clean text': 'txt',
  'camel case': 'txt',
  'snake case': 'txt',
  'kebab case': 'txt',
  timestamp: 'txt',
  date: 'txt',
  hex: 'txt',
  rgb: 'css',
  hsl: 'css',
  cmyk: 'txt',
  jwt: 'json',
  robots: 'txt',
  sitemap: 'txt',
  'user agent': 'json',
  'status code': 'txt',
  phonetic: 'txt',
  days: 'txt',
  palette: 'txt',
  mime: 'txt',
  bmi: 'txt',
  salary: 'txt',
  cipher: 'txt',
  utm: 'txt',
  'json path': 'json',
  frequency: 'txt',
  duration: 'txt',
  regex: 'txt',
  'unicode escape': 'txt',
  count: 'txt',
  uuid: 'txt',
  numbers: 'txt',
  percentage: 'txt',
  calculation: 'txt',
  ratio: 'txt'
};

function previewEntries(preview: ConvertPreview) {
  return Object.entries(preview.values ?? {}).filter(([, value]) => value !== undefined && value !== '');
}

function readLinkedInput(fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  return new URLSearchParams(window.location.search).get('input') ?? fallback;
}

function readLinkedOptions(defaults: ConverterOptions): ConverterOptions {
  if (typeof window === 'undefined') return defaults;
  const linkedOptions = new URLSearchParams(window.location.search).get('options');
  if (!linkedOptions) return defaults;

  try {
    const parsed = JSON.parse(linkedOptions) as ConverterOptions;
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? { ...defaults, ...parsed } : defaults;
  } catch {
    return defaults;
  }
}

function inputGuidance(tool: ConverterTool, locale: Locale) {
  const fallback = locale === 'he'
    ? 'הדבק כאן קלט, ערוך אותו לפי הצורך ולחץ המרה.'
    : 'Paste input here, adjust it if needed, then convert.';

  const guidance: Partial<Record<string, Record<Locale, string>>> = {
    data: {
      en: 'Paste structured data here. Valid brackets, quotes and separators matter.',
      he: 'הדבק כאן נתונים מובנים. סוגריים, מרכאות ומפרידים צריכים להיות תקינים.'
    },
    text: {
      en: 'Paste text here. Line breaks and spaces are kept unless the tool changes them.',
      he: 'הדבק כאן טקסט. שורות ורווחים נשמרים אלא אם הכלי משנה אותם.'
    },
    encoding: {
      en: 'Paste the text or encoded value here. Keep a copy of the original until the result looks right.',
      he: 'הדבק כאן טקסט או ערך מקודד. שמור עותק של המקור עד שהתוצאה נראית תקינה.'
    },
    calculator: {
      en: 'Enter the numbers in the order shown by the sample. Commas, spaces and line breaks are supported.',
      he: 'הזן מספרים לפי הסדר שמופיע בדוגמה. פסיקים, רווחים ושורות נתמכים.'
    }
  };

  return guidance[tool.category]?.[locale] ?? fallback;
}

function errorGuidance(tool: ConverterTool, locale: Locale) {
  const fallback = locale === 'he'
    ? 'בדוק את מבנה הקלט, נסה דוגמה מוכנה או נקה תווים שהועתקו ממקור חיצוני.'
    : 'Check the input structure, try a sample, or remove characters copied from another source.';

  const guidance: Partial<Record<string, Record<Locale, string>>> = {
    data: {
      en: 'Check brackets, quotes, headers and separators. Loading a sample is the fastest way to compare the expected shape.',
      he: 'בדוק סוגריים, מרכאות, כותרות ומפרידים. טעינת דוגמה היא הדרך המהירה להשוות למבנה הצפוי.'
    },
    color: {
      en: 'Check that every color channel is inside the valid range and that the format matches the selected tool.',
      he: 'בדוק שכל ערוץ צבע נמצא בטווח תקין ושהפורמט מתאים לכלי שנבחר.'
    },
    calculator: {
      en: 'Check that all required numbers are present, in the right order, and that percent values are written as numbers.',
      he: 'בדוק שכל המספרים הדרושים קיימים, בסדר הנכון, ושאחוזים נכתבים כמספרים.'
    }
  };

  return guidance[tool.category]?.[locale] ?? fallback;
}

export function ConverterWidget({ tool, locale }: ConverterWidgetProps) {
  const labels = ui[locale];
  const widgetId = useId();
  const defaultOptionValues = useMemo<ConverterOptions>(() => {
    return Object.fromEntries((tool.options ?? []).map((option) => [option.id, option.defaultValue]));
  }, [tool.options]);
  const initialInput = useMemo(() => readLinkedInput(tool.examples[0]?.input ?? ''), [tool.examples]);
  const initialOptionValues = useMemo(() => readLinkedOptions(defaultOptionValues), [defaultOptionValues]);
  const [selectedExampleIndex, setSelectedExampleIndex] = useState(initialInput === (tool.examples[0]?.input ?? '') ? 0 : -1);
  const inputTypeLabel = formatLabels[locale][tool.inputType] ?? tool.inputType;
  const outputTypeLabel = formatLabels[locale][tool.outputType] ?? tool.outputType;
  const widgetText = {
    ready: locale === 'he' ? 'מוכן להמרה' : 'Ready to convert',
    converted: locale === 'he' ? 'הפלט מוכן' : 'Output ready',
    emptyOutput: locale === 'he' ? 'הפלט יופיע כאן אחרי ההמרה.' : 'Your converted output will appear here.',
    inputType: locale === 'he' ? 'סוג קלט' : 'Input type',
    outputType: locale === 'he' ? 'סוג פלט' : 'Output type',
    localOnly: locale === 'he' ? 'ההמרה מתבצעת בדפדפן שלך' : 'Runs in your browser',
    manualHint: locale === 'he' ? 'כבה אוטומטי כדי לעבוד ידנית' : 'Turn off Auto for manual mode',
    examples: locale === 'he' ? 'דוגמאות' : 'Examples',
    preview: locale === 'he' ? 'תצוגה מהירה' : 'Quick preview',
    sampleName: locale === 'he' ? 'טען דוגמה' : 'Load sample',
    share: locale === 'he' ? 'העתק קישור שיתוף' : 'Copy share link',
    shared: locale === 'he' ? 'קישור הועתק' : 'Link copied',
    errorHint: errorGuidance(tool, locale),
    clearInput: labels.clear,
    inputHelp: inputGuidance(tool, locale),
    outputHelp: locale === 'he' ? 'התוצאה מופיעה כאן אחרי המרה תקינה.' : 'The result appears here after a valid conversion.',
    fixInput: locale === 'he' ? 'צריך לתקן את הקלט' : 'Input needs attention',
    mode: locale === 'he' ? 'מצב עבודה' : 'Work mode',
    autoMode: locale === 'he' ? 'המרה אוטומטית' : 'Auto convert on',
    manualMode: locale === 'he' ? 'המרה ידנית' : 'Manual convert',
    selectedExample: locale === 'he' ? 'דוגמה נבחרת' : 'Selected example',
    noExample: locale === 'he' ? 'ללא דוגמה' : 'No example selected',
    resultState: locale === 'he' ? 'מצב התוצאה' : 'Result state',
    resultReady: locale === 'he' ? 'מוכן להעתקה או הורדה' : 'Ready to copy or download',
    resultWaiting: locale === 'he' ? 'מחכה להמרה תקינה' : 'Waiting for a valid result',
    convertFirst: locale === 'he' ? 'המר קודם ואז הפלט יהיה מוכן' : 'Convert first and the result will be ready here',
    inputActions: locale === 'he' ? 'סרגל פעולות לשדה המקור' : 'Source field actions toolbar',
    outputActions: locale === 'he' ? 'סרגל פעולות לשדה התוצאה' : 'Output field actions toolbar',
    outputSummary: locale === 'he' ? 'סיכום פלט' : 'Output summary',
    inputState: locale === 'he' ? 'מצב קלט' : 'Input state',
    outputState: locale === 'he' ? 'מצב פלט' : 'Output state',
    nextAction: locale === 'he' ? 'הפעולה הבאה' : 'Next action',
    inputEmpty: locale === 'he' ? 'מחכה לקלט' : 'Waiting for input',
    inputReady: locale === 'he' ? 'קלט מוכן' : 'Input ready',
    paste: locale === 'he' ? 'הדבק מהלוח' : 'Paste from clipboard',
    pasted: locale === 'he' ? 'הודבק' : 'Pasted',
    useOutputAsInput: locale === 'he' ? 'העבר פלט לקלט' : 'Use output as input',
    useInputCopy: locale === 'he' ? 'העתק קלט' : 'Copy input',
    inputCopied: locale === 'he' ? 'קלט הועתק' : 'Input copied',
    runNow: locale === 'he' ? 'הרץ עכשיו' : 'Run now',
    loadSampleFirst: locale === 'he' ? 'טען דוגמה או הדבק קלט' : 'Load a sample or paste input',
    outputNextStep: locale === 'he' ? 'העתק, הורד או המשך לכלי הבא' : 'Copy, download, or keep refining',
    manualNextStep: locale === 'he' ? 'המר ידנית כשאתה רוצה לשלוט על התוצאה' : 'Run a manual conversion when you want a fresh result',
    autoNextStep: locale === 'he' ? 'הפלט יתעדכן אוטומטית אחרי כל שינוי' : 'Output updates automatically after each change',
    pasteFailed: locale === 'he' ? 'לא הצלחנו לקרוא מהלוח. אפשר להדביק ידנית.' : 'Could not read the clipboard. You can still paste manually.',
    shareSetup: locale === 'he' ? 'שתף הגדרה' : 'Share setup'
  };
  const [input, setInput] = useState(initialInput);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [warnings, setWarnings] = useState<string[]>([]);
  const [metadata, setMetadata] = useState<Record<string, string | number>>({});
  const [preview, setPreview] = useState<ConvertPreview | null>(null);
  const [optionValues, setOptionValues] = useState<ConverterOptions>(initialOptionValues);
  const [autoConvert, setAutoConvert] = useState(true);
  const [copied, setCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [inputCopied, setInputCopied] = useState(false);
  const [pasted, setPasted] = useState(false);

  const inputStats = useMemo(() => {
    const lines = input ? input.split(/\r\n|\r|\n/).length : 0;
    return { characters: input.length, lines };
  }, [input]);

  const outputStats = useMemo(() => {
    const lines = output ? output.split(/\r\n|\r|\n/).length : 0;
    return { characters: output.length, lines };
  }, [output]);

  const status = error ? 'error' : output ? 'success' : 'idle';
  const statusLabel = error ? widgetText.fixInput : output ? widgetText.converted : widgetText.ready;
  const downloadExtension = outputExtensions[tool.outputType] ?? 'txt';
  const inputId = `${widgetId}-input`;
  const outputId = `${widgetId}-output`;
  const inputHelpId = `${widgetId}-input-help`;
  const outputHelpId = `${widgetId}-output-help`;
  const errorId = `${widgetId}-error`;

  const trackEvent = useCallback(
    (name: string, props: Record<string, string | number | boolean> = {}) => {
      const detail = {
        name,
        props: {
          tool: tool.slug,
          converter: tool.converterId,
          locale,
          ...props
        }
      };

      window.dispatchEvent(new CustomEvent('online-converter:event', { detail }));
    },
    [locale, tool.converterId, tool.slug]
  );

  const runConversion = useCallback((source: 'auto' | 'manual' = 'auto') => {
    setError('');
    setWarnings([]);
    setMetadata({});
    setPreview(null);

    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      const result = convert(tool.converterId, input, optionValues);
      setOutput(result.output);
      setWarnings(result.warnings ?? []);
      setMetadata(result.metadata ?? {});
      setPreview(result.preview ?? null);
      if (source === 'manual') {
        trackEvent('convert_tool', { inputCharacters: input.length, outputCharacters: result.output.length });
      }
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : labels.conversionFailed;
      setError(message || labels.conversionFailed);
      setOutput('');
      setPreview(null);
      if (source === 'manual') {
        trackEvent('convert_error', { inputCharacters: input.length });
      }
    }
  }, [input, labels.conversionFailed, optionValues, tool.converterId, trackEvent]);

  useEffect(() => {
    if (!autoConvert) return;
    const timer = window.setTimeout(runConversion, 180);
    return () => window.clearTimeout(timer);
  }, [autoConvert, runConversion]);

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    trackEvent('copy_output', { outputCharacters: output.length });
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  const copyInput = async () => {
    if (!input) return;
    await navigator.clipboard.writeText(input);
    trackEvent('copy_input', { inputCharacters: input.length });
    setInputCopied(true);
    window.setTimeout(() => setInputCopied(false), 1200);
  };

  const pasteInput = async () => {
    try {
      const pastedText = await navigator.clipboard.readText();
      if (!pastedText) return;
      setInput(pastedText);
      setSelectedExampleIndex(-1);
      trackEvent('paste_input', { inputCharacters: pastedText.length });
      setPasted(true);
      window.setTimeout(() => setPasted(false), 1200);
    } catch {
      setError(widgetText.pasteFailed);
      trackEvent('paste_input_error');
    }
  };

  const copyShareLink = async () => {
    const url = new URL(window.location.href);
    url.search = '';
    if (input.trim()) {
      url.searchParams.set('input', input);
    }
    if (Object.keys(optionValues).length > 0) {
      url.searchParams.set('options', JSON.stringify(optionValues));
    }
    await navigator.clipboard.writeText(url.toString());
    trackEvent('copy_share_link', { inputCharacters: input.length, hasOptions: Object.keys(optionValues).length > 0 });
    setShareCopied(true);
    window.setTimeout(() => setShareCopied(false), 1400);
  };

  const downloadOutput = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${tool.slug}.${downloadExtension}`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    trackEvent('download_output', { outputCharacters: output.length });
  };

  const loadExample = (index: number) => {
    const example = tool.examples[index];
    if (!example) return;
    setSelectedExampleIndex(index);
    setInput(example.input);
    setError('');
    setWarnings([]);
    setMetadata({});
    setPreview(null);
    trackEvent('load_example', { exampleIndex: index });
  };

  const loadSelectedExample = () => {
    const index = selectedExampleIndex >= 0 ? selectedExampleIndex : 0;
    const example = tool.examples[index];
    if (!example) return;
    setInput(example.input);
    trackEvent('load_sample', { exampleIndex: index });
  };

  const clearInput = () => {
    setInput('');
    setOutput('');
    setError('');
    setWarnings([]);
    setMetadata({});
    setPreview(null);
    trackEvent('clear_input', { hadInput: Boolean(input.trim()), hadOutput: Boolean(output.trim()) });
  };

  const useOutputAsInput = () => {
    if (!output) return;
    setInput(output);
    setSelectedExampleIndex(-1);
    setCopied(false);
    trackEvent('reuse_output_as_input', { outputCharacters: output.length });
  };

  const toggleAutoConvert = () => {
    setAutoConvert((value) => {
      trackEvent('toggle_auto_convert', { enabled: !value });
      return !value;
    });
  };

  const updateOption = (id: string, value: string | boolean) => {
    setOptionValues((current) => ({ ...current, [id]: value }));
    trackEvent('change_option', { option: id, value: String(value) });
  };

  return (
    <section className="converter-widget" aria-labelledby="converter-title">
      <div className="converter-toolbar">
        <div className="converter-heading">
          <p className="eyebrow">{labels.instant}</p>
          <h2 id="converter-title">{tool.shortTitle[locale]}</h2>
          <div className="converter-badges" aria-label={tool.title[locale]}>
            <span>{widgetText.localOnly}</span>
            <span>{widgetText.inputType}: {inputTypeLabel}</span>
            <span>{widgetText.outputType}: {outputTypeLabel}</span>
          </div>
        </div>
        <div className="toolbar-actions" role="toolbar" aria-label={tool.title[locale]}>
          <button className="icon-button text-button" type="button" onClick={toggleAutoConvert} aria-pressed={autoConvert} title={widgetText.manualHint}>
            <Sparkles size={16} aria-hidden="true" />
            {labels.autoConvert}
          </button>
          <button className="icon-button" type="button" onClick={loadSelectedExample} aria-label={widgetText.sampleName} title={widgetText.sampleName}>
            <Play size={16} aria-hidden="true" />
          </button>
          <button className="icon-button" type="button" onClick={clearInput} aria-label={widgetText.clearInput} title={widgetText.clearInput}>
            <Eraser size={16} aria-hidden="true" />
          </button>
          {tool.reverseSlug && (
            <a className="icon-button" href={`/${locale}/${tool.reverseSlug}/`} aria-label={labels.swap} title={labels.swap} onClick={() => trackEvent('open_reverse_tool', { reverseSlug: tool.reverseSlug ?? '' })}>
              <ArrowLeftRight size={16} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>

      {tool.examples.length > 0 && (
        <div className="example-strip" aria-label={widgetText.examples}>
          <span>{widgetText.examples}</span>
          <div className="example-actions">
            {tool.examples.map((example, index) => (
              <button
                className={index === selectedExampleIndex ? 'example-chip active' : 'example-chip'}
                type="button"
                key={`${example.label.en}-${index}`}
                onClick={() => loadExample(index)}
                aria-pressed={index === selectedExampleIndex}
              >
                {example.label[locale]}
              </button>
            ))}
          </div>
        </div>
      )}

      {tool.options && tool.options.length > 0 && (
        <div className="options-strip" aria-label={locale === 'he' ? 'אפשרויות המרה' : 'Conversion options'}>
          <span>{locale === 'he' ? 'אפשרויות' : 'Options'}</span>
          <div className="option-actions">
            {tool.options.map((option) => (
              option.type === 'toggle' ? (
                <label className="option-toggle" key={option.id}>
                  <input
                    type="checkbox"
                    checked={Boolean(optionValues[option.id])}
                    onChange={(event) => updateOption(option.id, event.currentTarget.checked)}
                  />
                  <span>{option.label[locale]}</span>
                </label>
              ) : (
                <label className="option-select" key={option.id}>
                  <span>{option.label[locale]}</span>
                  <select
                    value={String(optionValues[option.id] ?? option.defaultValue)}
                    onChange={(event) => updateOption(option.id, event.currentTarget.value)}
                  >
                    {(option.choices ?? []).map((choice) => (
                      <option value={choice.value} key={choice.value}>
                        {choice.label[locale]}
                      </option>
                    ))}
                  </select>
                </label>
              )
            ))}
          </div>
        </div>
      )}

      <div className={`converter-status converter-status-${status}`} aria-live="polite">
        {status === 'error' ? <AlertTriangle size={18} aria-hidden="true" /> : <CheckCircle2 size={18} aria-hidden="true" />}
        <span>{statusLabel}</span>
      </div>

      <div className="workspace-summary" aria-label={widgetText.outputSummary}>
        <article className="summary-card">
          <span>{widgetText.inputState}</span>
          <strong>{input.trim() ? widgetText.inputReady : widgetText.inputEmpty}</strong>
          <p>{input.trim() ? `${inputStats.characters} ${labels.characters} · ${inputStats.lines} ${labels.lines}` : widgetText.loadSampleFirst}</p>
          <div className="summary-actions">
            <button className="summary-action-button" type="button" onClick={pasteInput}>
              <Clipboard size={14} aria-hidden="true" />
              {pasted ? widgetText.pasted : widgetText.paste}
            </button>
            {tool.examples.length > 0 && (
              <button className="summary-action-button" type="button" onClick={loadSelectedExample}>
                <Play size={14} aria-hidden="true" />
                {widgetText.sampleName}
              </button>
            )}
          </div>
        </article>
        <article className="summary-card">
          <span>{widgetText.nextAction}</span>
          <strong>{autoConvert ? widgetText.autoMode : widgetText.manualMode}</strong>
          <p>{autoConvert ? widgetText.autoNextStep : widgetText.manualNextStep}</p>
          <div className="summary-actions">
            <button className="summary-action-button" type="button" onClick={() => runConversion('manual')} disabled={!input.trim()}>
              <Play size={14} aria-hidden="true" />
              {widgetText.runNow}
            </button>
            <button className="summary-action-button" type="button" onClick={copyShareLink} disabled={!input.trim() && Object.keys(optionValues).length === 0}>
              <Link size={14} aria-hidden="true" />
              {shareCopied ? widgetText.shared : widgetText.shareSetup}
            </button>
          </div>
        </article>
        <article className="summary-card">
          <span>{widgetText.outputState}</span>
          <strong>{output ? widgetText.resultReady : widgetText.resultWaiting}</strong>
          <p>{output ? widgetText.outputNextStep : widgetText.convertFirst}</p>
          <div className="summary-actions">
            <button className="summary-action-button" type="button" onClick={copyOutput} disabled={!output}>
              <Clipboard size={14} aria-hidden="true" />
              {copied ? labels.copied : labels.copy}
            </button>
            <button className="summary-action-button" type="button" onClick={useOutputAsInput} disabled={!output}>
              <ArrowLeftRight size={14} aria-hidden="true" />
              {widgetText.useOutputAsInput}
            </button>
          </div>
        </article>
      </div>

      <div className="editor-grid">
        <div className="editor-panel">
          <span className="panel-header">
            <span className="panel-header-main">
              <label htmlFor={inputId}>{labels.input}</label>
              <small>
                {inputStats.characters} {labels.characters} · {inputStats.lines} {labels.lines}
              </small>
            </span>
            <span className="panel-inline-actions" role="toolbar" aria-label={widgetText.inputActions}>
              <button className="panel-action-button" type="button" onClick={copyInput} disabled={!input}>
                <Clipboard size={14} aria-hidden="true" />
                {inputCopied ? widgetText.inputCopied : widgetText.useInputCopy}
              </button>
              {tool.examples.length > 0 && (
                <button className="panel-action-button" type="button" onClick={loadSelectedExample}>
                  <Play size={14} aria-hidden="true" />
                  {widgetText.sampleName}
                </button>
              )}
              <button className="panel-action-button" type="button" onClick={pasteInput}>
                <Clipboard size={14} aria-hidden="true" />
                {pasted ? widgetText.pasted : widgetText.paste}
              </button>
              <button className="panel-action-button" type="button" onClick={clearInput}>
                <Eraser size={14} aria-hidden="true" />
                {widgetText.clearInput}
              </button>
            </span>
          </span>
          <span className="sr-only" id={inputHelpId}>{widgetText.inputHelp}</span>
          <textarea
            id={inputId}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
            dir="auto"
            aria-invalid={Boolean(error)}
            aria-describedby={inputHelpId}
            aria-errormessage={error ? errorId : undefined}
          />
        </div>

        <div className="editor-panel">
          <span className="panel-header">
            <span className="panel-header-main">
              <label htmlFor={outputId}>{labels.output}</label>
              <small>
                {outputStats.characters} {labels.characters} · {outputStats.lines} {labels.lines}
              </small>
            </span>
            <span className="panel-inline-actions" role="toolbar" aria-label={widgetText.outputActions}>
              <button className="panel-action-button" type="button" onClick={copyOutput} disabled={!output}>
                <Clipboard size={14} aria-hidden="true" />
                {copied ? labels.copied : labels.copy}
              </button>
              <button className="panel-action-button" type="button" onClick={useOutputAsInput} disabled={!output}>
                <ArrowLeftRight size={14} aria-hidden="true" />
                {widgetText.useOutputAsInput}
              </button>
              <button className="panel-action-button" type="button" onClick={downloadOutput} disabled={!output}>
                <Download size={14} aria-hidden="true" />
                {labels.download}
              </button>
            </span>
          </span>
          <span className="sr-only" id={outputHelpId}>{widgetText.outputHelp}</span>
          <textarea id={outputId} value={output} readOnly spellCheck={false} dir="auto" aria-describedby={outputHelpId} />
          {!output && (
            <div className="empty-output">
              <FileText size={22} />
              <span>{widgetText.emptyOutput}</span>
            </div>
          )}
        </div>
      </div>

      {Object.keys(metadata).length > 0 && (
        <div className="output-summary-grid" aria-label={locale === 'he' ? 'פרטי פלט' : 'Output details'}>
          {Object.entries(metadata).map(([key, value]) => (
            <article className="summary-metric" key={key}>
              <span>{key}</span>
              <strong>{value}</strong>
            </article>
          ))}
        </div>
      )}

      <div className="converter-actions">
        <button className="primary-action" type="button" onClick={() => runConversion('manual')}>
          <Play size={18} aria-hidden="true" />
          {labels.convert}
        </button>
        <button className="secondary-action" type="button" onClick={copyShareLink} disabled={!input.trim() && Object.keys(optionValues).length === 0}>
          <Link size={18} aria-hidden="true" />
          {shareCopied ? widgetText.shared : widgetText.share}
        </button>
      </div>

      {preview && (
        <div className={`preview-panel preview-${preview.type}`} aria-label={widgetText.preview}>
          <div className="preview-heading">
            <span>{widgetText.preview}</span>
            {preview.title && <strong>{preview.title}</strong>}
          </div>

          {preview.type === 'color' && typeof preview.values?.css === 'string' && (
            <div className="color-preview">
              <span className="color-swatch" style={{ background: preview.values.css }} aria-hidden="true" />
              <code>{preview.values.css}</code>
            </div>
          )}

          {previewEntries(preview).length > 0 && (
            <dl className="preview-metadata">
              {previewEntries(preview).map(([key, value]) => (
                <div key={key}>
                  <dt>{key}</dt>
                  <dd>{String(value)}</dd>
                </div>
              ))}
            </dl>
          )}

          {preview.rows && preview.rows.length > 0 && (
            <div className="preview-table-wrap">
              <table className="preview-table">
                <thead>
                  <tr>
                    {Object.keys(preview.rows[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.map((row, index) => (
                    <tr key={`${index}-${Object.values(row).join('-')}`}>
                      {Object.keys(preview.rows?.[0] ?? {}).map((key) => (
                        <td key={key}>{String(row[key] ?? '')}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="status-region" aria-live="polite" aria-atomic="true">
        {error && (
          <div className="error-message" id={errorId}>
            <strong>{error}</strong>
            <span>{widgetText.errorHint}</span>
          </div>
        )}
        {warnings.length > 0 && (
          <div className="warning-message">
            <strong>{labels.warnings}</strong>
            <ul>
              {warnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
