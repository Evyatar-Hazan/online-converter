'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToolLayout from '@/components/ToolLayout';
import ToolInput from '@/components/ToolInput';
import ToolOutput from '@/components/ToolOutput';
import ToolActions from '@/components/ToolActions';
import { convertJsonToCsv } from './logic';

export default function JsonToCsvPage() {
  const t = useTranslations('json-to-csv');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  const handleConvert = (jsonInput: string) => {
    setInput(jsonInput);
    setError('');

    try {
      const result = convertJsonToCsv(jsonInput);
      setOutput(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      setOutput('');
      return '';
    }
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const handleDownload = () => {
    if (output) {
      const element = document.createElement('a');
      element.setAttribute(
        'href',
        `data:text/csv;charset=utf-8,${encodeURIComponent(output)}`
      );
      element.setAttribute('download', 'data.csv');
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <ToolLayout title={t('title')} description={t('description')}>
      <div className="flex flex-col gap-4">
        <ToolInput
          onConvert={handleConvert}
          placeholder={t('inputPlaceholder')}
          label={t('inputLabel')}
        />

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-base">{error}</p>
          </div>
        )}

        {output && (
          <>
            <ToolOutput value={output} label={t('outputLabel')} />
            <ToolActions
              onCopy={handleCopy}
              onClear={handleClear}
              onDownload={handleDownload}
            />
          </>
        )}

        {!output && !error && input && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-blue-700 dark:text-blue-300 text-base">
              {t('clickConvert')}
            </p>
          </div>
        )}
      </div>

      {/* FAQ Section */}
      <section className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4">{t('faqTitle')}</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">{t('faq1Title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('faq1Answer')}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">{t('faq2Title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('faq2Answer')}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">{t('faq3Title')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('faq3Answer')}</p>
          </div>
        </div>
      </section>
    </ToolLayout>
  );
}
