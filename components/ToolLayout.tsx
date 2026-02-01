'use client';

import React from 'react';

type ToolLayoutProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function ToolLayout({
  title,
  description,
  children,
}: ToolLayoutProps) {
  return (
    <main className="min-h-screen w-full p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{title}</h1>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </header>

        {/* Tool Content */}
        <div className="flex flex-col gap-4">{children}</div>
      </div>
    </main>
  );
}
