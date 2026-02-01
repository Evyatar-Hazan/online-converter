'use client';

import React from 'react';

type ToolActionsProps = {
  onCopy?: () => void;
  onClear?: () => void;
  onDownload?: () => void;
};

export default function ToolActions({
  onCopy,
  onClear,
  onDownload,
}: ToolActionsProps) {
  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-4">
      {onCopy && (
        <button
          onClick={onCopy}
          className="min-h-[44px] px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg font-semibold transition-colors text-base"
          style={{ fontSize: '16px' }}
        >
          Copy
        </button>
      )}

      {onClear && (
        <button
          onClick={onClear}
          className="min-h-[44px] px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg font-semibold transition-colors text-base"
          style={{ fontSize: '16px' }}
        >
          Clear
        </button>
      )}

      {onDownload && (
        <button
          onClick={onDownload}
          className="min-h-[44px] px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors text-base"
          style={{ fontSize: '16px' }}
        >
          Download
        </button>
      )}
    </div>
  );
}
