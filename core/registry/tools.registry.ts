export type ToolMetadata = {
  slug: string;
  title: {
    he: string;
    en: string;
  };
  description: {
    he: string;
    en: string;
  };
  keywords: {
    he: string[];
    en: string[];
  };
  category?: string;
};

export const toolsRegistry: ToolMetadata[] = [
  // Tools will be added here
  // Example:
  // {
  //   slug: 'json-to-csv',
  //   title: {
  //     he: 'המרת JSON ל-CSV',
  //     en: 'JSON to CSV Converter',
  //   },
  //   description: {
  //     he: 'המר קבצי JSON לפורמט CSV בקלות ובמהירות',
  //     en: 'Convert JSON files to CSV format easily and quickly',
  //   },
  //   keywords: {
  //     he: ['json', 'csv', 'המרה', 'קונברטר'],
  //     en: ['json', 'csv', 'converter', 'transform'],
  //   },
  // },
];

export function getToolBySlug(slug: string): ToolMetadata | undefined {
  return toolsRegistry.find((tool) => tool.slug === slug);
}

export function getAllTools(): ToolMetadata[] {
  return toolsRegistry;
}

export function getToolsByCategory(category: string): ToolMetadata[] {
  return toolsRegistry.filter((tool) => tool.category === category);
}
