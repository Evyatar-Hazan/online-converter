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
  {
    slug: 'json-to-csv',
    title: {
      he: 'המרת JSON ל-CSV',
      en: 'JSON to CSV Converter',
    },
    description: {
      he: 'המר קבצי JSON לפורמט CSV בקלות ובמהירות. כלי חינם למפתחים ואנשי טכנולוגיה.',
      en: 'Convert JSON files to CSV format easily and quickly. Free tool for developers and tech professionals.',
    },
    keywords: {
      he: ['json', 'csv', 'המרה', 'קונברטר', 'json to csv'],
      en: ['json', 'csv', 'converter', 'transform', 'json to csv'],
    },
    category: 'data',
  },
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
