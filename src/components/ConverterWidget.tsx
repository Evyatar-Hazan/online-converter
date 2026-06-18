import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeftRight, Clipboard, Download, Eraser, Play, Sparkles } from 'lucide-react';
import { convert } from '../lib/converter-functions';
import type { ConverterTool, Locale } from '../types';
import { ui } from '../data/site';

interface ConverterWidgetProps {
  tool: ConverterTool;
  locale: Locale;
}

export function ConverterWidget({ tool, locale }: ConverterWidgetProps) {
  const labels = ui[locale];
  const sample = tool.examples[0]?.input ?? '';
  const [input, setInput] = useState(sample);
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

  const runConversion = useCallback(() => {
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
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : labels.conversionFailed;
      setError(message || labels.conversionFailed);
      setOutput('');
    }
  }, [input, labels.conversionFailed, tool.converterId]);

  useEffect(() => {
    if (!autoConvert) return;
    const timer = window.setTimeout(runConversion, 180);
    return () => window.clearTimeout(timer);
  }, [autoConvert, runConversion]);

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  const downloadOutput = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${tool.slug}.${tool.outputType.replace(/\s+/g, '-')}`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="converter-widget" aria-labelledby="converter-title">
      <div className="converter-toolbar">
        <div>
          <p className="eyebrow">{labels.instant}</p>
          <h2 id="converter-title">{tool.shortTitle[locale]}</h2>
        </div>
        <div className="toolbar-actions" role="toolbar" aria-label={tool.title[locale]}>
          <button className="icon-button text-button" type="button" onClick={() => setAutoConvert((value) => !value)} aria-pressed={autoConvert}>
            <Sparkles size={16} aria-hidden="true" />
            {labels.autoConvert}
          </button>
          <button className="icon-button" type="button" onClick={() => setInput(sample)} aria-label={labels.sample}>
            <Play size={16} aria-hidden="true" />
          </button>
          <button className="icon-button" type="button" onClick={() => setInput('')} aria-label={labels.clear}>
            <Eraser size={16} aria-hidden="true" />
          </button>
          {tool.reverseSlug && (
            <a className="icon-button" href={`/${locale}/${tool.reverseSlug}/`} aria-label={labels.swap}>
              <ArrowLeftRight size={16} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>

      <div className="editor-grid">
        <label className="editor-panel">
          <span>{labels.input}</span>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            spellCheck={false}
            dir="ltr"
            aria-invalid={Boolean(error)}
          />
          <small>
            {inputStats.characters} {labels.characters} · {inputStats.lines} {labels.lines}
          </small>
        </label>

        <label className="editor-panel">
          <span>{labels.output}</span>
          <textarea value={output} readOnly spellCheck={false} dir="ltr" />
          <small>
            {Object.entries(metadata).map(([key, value]) => `${key}: ${value}`).join(' · ') || `${output.length} ${labels.characters}`}
          </small>
        </label>
      </div>

      <div className="converter-actions">
        <button className="primary-action" type="button" onClick={runConversion}>
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
