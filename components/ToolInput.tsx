'use client';

import React, { useState } from 'react';

type ToolInputProps = {
  onConvert: (input: string) => string;
  placeholder?: string;
  label?: string;
};

export default function ToolInput({
  onConvert,
  placeholder = 'Enter input here...',
  label = 'Input',
}: ToolInputProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const handleConvert = () => {
    try {
      const result = onConvert(input);
      setOutput(result);
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Input Section */}
      <div className="flex flex-col gap-2">
        <label htmlFor="tool-input" className="font-semibold text-base">
          {label}
        </label>
        <textarea
          id="tool-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-[200px] p-4 text-base border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
          style={{ fontSize: '16px' }} /* Mobile-First: מניעת זום */
        />
      </div>

      {/* Convert Button */}
      <button
        onClick={handleConvert}
        className="w-full min-h-[44px] px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-base"
        style={{ fontSize: '16px' }}
      >
        Convert
      </button>

      {/* Output Section */}
      {output && (
        <div className="flex flex-col gap-2">
          <label htmlFor="tool-output" className="font-semibold text-base">
            Output
          </label>
          <textarea
            id="tool-output"
            value={output}
            readOnly
            className="w-full min-h-[200px] p-4 text-base border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900"
            style={{ fontSize: '16px' }}
          />
        </div>
      )}
    </div>
  );
}
