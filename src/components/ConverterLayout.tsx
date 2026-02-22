import { useState } from 'react';
import { Download, Copy, RefreshCw, Trash2 } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { useLocalStorage } from '../hooks/useLocalStorage';

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

  const handleConvert = () => {
    try {
      setError('');
      if (!inputVal.trim()) {
        setOutputVal('');
        return;
      }
      const result = onConvert(inputVal);
      setOutputVal(result);
    } catch (err: any) {
      setError(err.message || 'Conversion failed. Please check your logic or input formatting.');
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
      alert('Copied to clipboard!');
    } catch (err) {
      alert('Failed to copy.');
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
        
        <div className="card">
          <h2 style={{ marginBottom: '0.5rem', color: 'var(--primary-color)' }}>{title}</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{description}</p>
          
          <div style={{ marginBottom: '1rem' }}>
            <label className="section-title" style={{ display: 'block', marginBottom: '0.5rem' }}>{inputLabel}</label>
            <textarea
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={`Paste your ${inputLabel.toLowerCase()} here...`}
            />
          </div>

          <div className="btn-container">
            <button className="btn btn-primary" onClick={handleConvert}>
              <RefreshCw size={18} /> Convert
            </button>
            <button className="btn" onClick={handleClear} style={{ backgroundColor: '#64748b' }}>
              <Trash2 size={18} /> Clear
            </button>
          </div>

          {error && <div className="error-msg" style={{ display: 'block' }}>{error}</div>}

          <div style={{ marginTop: '2rem' }}>
            <label className="section-title" style={{ display: 'block', marginBottom: '0.5rem' }}>{outputLabel}</label>
            <textarea
              readOnly
              value={outputVal}
              placeholder={`Your ${outputLabel.toLowerCase()} will appear here...`}
            />
          </div>

          <div className="btn-container">
            <button className="btn btn-success" onClick={handleDownload} disabled={!outputVal}>
              <Download size={18} /> Download
            </button>
            <button className="btn" onClick={handleCopy} disabled={!outputVal} style={{ backgroundColor: '#64748b' }}>
              <Copy size={18} /> Copy
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
