'use client';

import React from 'react';

type ToolOutputProps = {
  value: string;
  label?: string;
};

export default function ToolOutput({ value, label = 'Output' }: ToolOutputProps) {
  if (!value) return null;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="tool-output" className="font-semibold text-base">
        {label}
      </label>
      <textarea
        id="tool-output"
        value={value}
        readOnly
        className="w-full min-h-[200px] p-4 text-base border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900"
        style={{ fontSize: '16px' }}
      />
    </div>
  );
}
