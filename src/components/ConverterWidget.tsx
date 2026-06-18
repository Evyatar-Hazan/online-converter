import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, ArrowLeftRight, CheckCircle2, Clipboard, Download, Eraser, FileText, Play, Sparkles } from 'lucide-react';
import { convert } from '../lib/converter-functions';
import type { ConverterTool, Locale } from '../types';
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
    csv: 'CSV',
    xml: 'XML',
    yaml: 'YAML',
    text: 'Text',
    binary: 'Binary',
    base64: 'Base64',
    decimal: 'Decimal',
    url: 'URL',
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
    jwt: 'JWT'
  },
  he: {
    json: 'JSON',
    csv: 'CSV',
    xml: 'XML',
    yaml: 'YAML',
    text: 'טקסט',
    binary: 'בינארי',
    base64: 'Base64',
    decimal: 'Decimal',
    url: 'URL',
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
    jwt: 'JWT'
  }
};

const outputExtensions: Record<string, string> = {
  json: 'json',
  csv: 'csv',
  xml: 'xml',
  yaml: 'yaml',
  text: 'txt',
  binary: 'txt',
  base64: 'txt',
  decimal: 'txt',
  url: 'txt',
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
  jwt: 'json'
};

export function ConverterWidget({ tool, locale }: ConverterWidgetProps) {
  const labels = ui[locale];
  const [selectedExampleIndex, setSelectedExampleIndex] = useState(0);
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
    sampleName: locale === 'he' ? 'טען דוגמה' : 'Load sample',
    clearInput: labels.clear
  };
  const [input, setInput] = useState(tool.examples[0]?.input ?? '');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [warnings, setWarnings] = useState<string[]>([]);
  const [metadata, setMetadata] = useState<Record<string, string | number>>({});
  const [autoConvert, setAutoConvert] = useState(true);
  const [copied, setCopied] = useState(false);

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

    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      const result = convert(tool.converterId, input);
      setOutput(result.output);
      setWarnings(result.warnings ?? []);
      setMetadata(result.metadata ?? {});
      if (source === 'manual') {
        trackEvent('convert_tool', { inputCharacters: input.length, outputCharacters: result.output.length });
      }
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : labels.conversionFailed;
      setError(message || labels.conversionFailed);
      setOutput('');
      if (source === 'manual') {
        trackEvent('convert_error', { inputCharacters: input.length });
      }
    }
  }, [input, labels.conversionFailed, tool.converterId, trackEvent]);

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
    trackEvent('load_example', { exampleIndex: index });
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

      <div className="status-region" aria-live="polite" aria-atomic="true">
        {error && <p className="error-message">{error}</p>}
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
