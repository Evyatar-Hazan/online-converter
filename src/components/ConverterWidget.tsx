import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ArrowLeftRight, CheckCircle2, Clipboard, Download, Eraser, FileText, Link, Play, Sparkles } from 'lucide-react';
import { convert } from '../lib/converter-functions';
import type { ConvertPreview, ConverterOptions, ConverterTool, Locale } from '../types';
import { ui } from '../data/site';

interface ConverterWidgetProps {
  tool: ConverterTool;
  locale: Locale;
}

declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: Record<string, string | number | boolean> }) => void;
  }
}

const formatLabels: Record<Locale, Record<string, string>> = {
  en: {
    json: 'JSON',
    jsonl: 'JSONL',
    csv: 'CSV',
    xml: 'XML',
    yaml: 'YAML',
    text: 'Text',
    binary: 'Binary',
    base64: 'Base64',
    decimal: 'Decimal',
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
    timestamp: 'Timestamp',
    date: 'Date',
    hex: 'HEX',
    rgb: 'RGB',
    hsl: 'HSL',
    cmyk: 'CMYK',
    jwt: 'JWT',
    regex: 'Regex',
    'unicode escape': 'Unicode escape',
    count: 'Count',
    uuid: 'UUID'
  },
  he: {
    json: 'JSON',
    jsonl: 'JSONL',
    csv: 'CSV',
    xml: 'XML',
    yaml: 'YAML',
    text: 'טקסט',
    binary: 'בינארי',
    base64: 'Base64',
    decimal: 'Decimal',
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
    timestamp: 'חותמת זמן',
    date: 'תאריך',
    hex: 'HEX',
    rgb: 'RGB',
    hsl: 'HSL',
    cmyk: 'CMYK',
    jwt: 'JWT',
    regex: 'Regex',
    'unicode escape': 'Unicode Escape',
    count: 'כמות',
    uuid: 'UUID'
  }
};

const outputExtensions: Record<string, string> = {
  json: 'json',
  jsonl: 'jsonl',
  csv: 'csv',
  xml: 'xml',
  yaml: 'yaml',
  text: 'txt',
  binary: 'txt',
  base64: 'txt',
  decimal: 'txt',
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
  timestamp: 'txt',
  date: 'txt',
  hex: 'txt',
  rgb: 'css',
  hsl: 'css',
  cmyk: 'txt',
  jwt: 'json',
  regex: 'txt',
  'unicode escape': 'txt',
  count: 'txt',
  uuid: 'txt'
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

export function ConverterWidget({ tool, locale }: ConverterWidgetProps) {
  const labels = ui[locale];
  const defaultOptionValues = useMemo<ConverterOptions>(() => {
    return Object.fromEntries((tool.options ?? []).map((option) => [option.id, option.defaultValue]));
  }, [tool.options]);
  const initialInput = useMemo(() => readLinkedInput(tool.examples[0]?.input ?? ''), [tool.examples]);
  const initialOptionValues = useMemo(() => readLinkedOptions(defaultOptionValues), [defaultOptionValues]);
  const [selectedExampleIndex, setSelectedExampleIndex] = useState(initialInput === (tool.examples[0]?.input ?? '') ? 0 : -1);
  const activeExample = tool.examples[selectedExampleIndex] ?? tool.examples[0];
  const sample = activeExample?.input ?? '';
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
    errorHint: locale === 'he' ? 'בדוק את מבנה הקלט, נסה דוגמה מוכנה או נקה תווים שהועתקו ממקור חיצוני.' : 'Check the input structure, try a sample, or remove characters copied from another source.',
    clearInput: labels.clear
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

  const inputStats = useMemo(() => {
    const lines = input ? input.split(/\r\n|\r|\n/).length : 0;
    return { characters: input.length, lines };
  }, [input]);

  const outputStats = useMemo(() => {
    const lines = output ? output.split(/\r\n|\r|\n/).length : 0;
    return { characters: output.length, lines };
  }, [output]);

  const status = error ? 'error' : output ? 'success' : 'idle';
  const statusLabel = error ? labels.conversionFailed : output ? widgetText.converted : widgetText.ready;
  const downloadExtension = outputExtensions[tool.outputType] ?? 'txt';

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
      window.plausible?.(name, { props: detail.props });
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
          <button className="icon-button text-button" type="button" onClick={() => setAutoConvert((value) => !value)} aria-pressed={autoConvert} title={widgetText.manualHint}>
            <Sparkles size={16} aria-hidden="true" />
            {labels.autoConvert}
          </button>
          <button className="icon-button" type="button" onClick={() => setInput(sample)} aria-label={widgetText.sampleName} title={widgetText.sampleName}>
            <Play size={16} aria-hidden="true" />
          </button>
          <button className="icon-button" type="button" onClick={() => setInput('')} aria-label={widgetText.clearInput} title={widgetText.clearInput}>
            <Eraser size={16} aria-hidden="true" />
          </button>
          {tool.reverseSlug && (
            <a className="icon-button" href={`/${locale}/${tool.reverseSlug}/`} aria-label={labels.swap} title={labels.swap}>
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

      <div className="editor-grid">
        <label className="editor-panel">
          <span className="panel-header">
            <span>{labels.input}</span>
            <small>
              {inputStats.characters} {labels.characters} · {inputStats.lines} {labels.lines}
            </small>
          </span>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
            dir="ltr"
            aria-invalid={Boolean(error)}
          />
        </label>

        <label className="editor-panel">
          <span className="panel-header">
            <span>{labels.output}</span>
            <small>
              {outputStats.characters} {labels.characters} · {outputStats.lines} {labels.lines}
            </small>
          </span>
          <textarea value={output} readOnly spellCheck={false} dir="ltr" />
          {!output && (
            <div className="empty-output" aria-hidden="true">
              <FileText size={22} />
              <span>{widgetText.emptyOutput}</span>
            </div>
          )}
        </label>
      </div>

      <div className="converter-actions">
        <button className="primary-action" type="button" onClick={() => runConversion('manual')}>
          <Play size={18} aria-hidden="true" />
          {labels.convert}
        </button>
        <button className="secondary-action" type="button" onClick={copyOutput} disabled={!output}>
          <Clipboard size={18} aria-hidden="true" />
          {copied ? labels.copied : labels.copy}
        </button>
        <button className="secondary-action" type="button" onClick={downloadOutput} disabled={!output}>
          <Download size={18} aria-hidden="true" />
          {labels.download}
        </button>
        <button className="secondary-action" type="button" onClick={copyShareLink} disabled={!input.trim() && Object.keys(optionValues).length === 0}>
          <Link size={18} aria-hidden="true" />
          {shareCopied ? widgetText.shared : widgetText.share}
        </button>
        {Object.keys(metadata).length > 0 && (
          <div className="metadata-strip" aria-label="Metadata">
            {Object.entries(metadata).map(([key, value]) => (
              <span key={key}>
                {key}: {value}
              </span>
            ))}
          </div>
        )}
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
          <div className="error-message">
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
