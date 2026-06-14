import { useState } from 'react';
import { Download, Copy, RefreshCw, Trash2 } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTranslation } from 'react-i18next';

interface ConverterLayoutProps {
  title: string;
  description: string;
  inputLabel: string;
  outputLabel: string;
  storageKey: string;
  onConvert: (input: string) => string;
  defaultOutputExtension: string;
}

export function ConverterLayout({
  title,
  description,
  inputLabel,
  outputLabel,
  storageKey,
  onConvert,
  defaultOutputExtension
}: ConverterLayoutProps) {
  const [inputVal, setInputVal] = useLocalStorage<string>(storageKey, '');
  const [outputVal, setOutputVal] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { t } = useTranslation();

  const handleConvert = () => {
    try {
      setError('');
      if (!inputVal.trim()) {
        setOutputVal('');
        return;
      }
      const result = onConvert(inputVal);
      setOutputVal(result);
    } catch {
      setError(t('converter.failMsg'));
      setOutputVal('');
    }
  };

  const handleDownload = () => {
    if (!outputVal) return;
    const blob = new Blob([outputVal], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `converted.${defaultOutputExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (!outputVal) return;
    try {
      await navigator.clipboard.writeText(outputVal);
      alert(t('converter.copied'));
    } catch {
      alert(t('converter.copyFail'));
    }
  };

  const handleClear = () => {
    setInputVal('');
    setOutputVal('');
    setError('');
  };

  return (
    <div className="app-wrapper">
      <div className="container">
        <Header showBack={true} />
        
        <main className="card" aria-labelledby="tool-title">
          <h2 id="tool-title" style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }}>{title}</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{description}</p>
          
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="converter-input" className="section-title" style={{ display: 'block', marginBottom: '0.5rem' }}>{inputLabel}</label>
            <textarea
              id="converter-input"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={t('converter.inputPlaceholder', { label: inputLabel })}
              aria-invalid={!!error}
            />
          </div>

          <div className="btn-container">
            <button className="btn btn-primary" onClick={handleConvert}>
              <RefreshCw size={18} aria-hidden="true" /> {t('converter.convert')}
            </button>
            <button className="btn" onClick={handleClear} style={{ backgroundColor: '#64748b' }}>
              <Trash2 size={18} aria-hidden="true" /> {t('converter.clear')}
            </button>
          </div>

          <div aria-live="assertive" aria-atomic="true">
            {error && <div className="error-msg" style={{ display: 'block' }}>{error}</div>}
          </div>

          <div style={{ marginTop: '2rem' }}>
            <label htmlFor="converter-output" className="section-title" style={{ display: 'block', marginBottom: '0.5rem' }}>{outputLabel}</label>
            <textarea
              id="converter-output"
              readOnly
              value={outputVal}
              placeholder={t('converter.outputPlaceholder', { label: outputLabel })}
            />
          </div>

          <div className="btn-container">
            <button className="btn btn-success" onClick={handleDownload} disabled={!outputVal}>
              <Download size={18} aria-hidden="true" /> {t('converter.download')}
            </button>
            <button className="btn" onClick={handleCopy} disabled={!outputVal} style={{ backgroundColor: '#64748b' }}>
              <Copy size={18} aria-hidden="true" /> {t('converter.copy')}
            </button>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
