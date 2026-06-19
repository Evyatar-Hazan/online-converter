export type Locale = 'en' | 'he';

export type ConverterCategory =
  | 'data'
  | 'text'
  | 'encoding'
  | 'time'
  | 'developer'
  | 'color'
  | 'calculator';

export interface LocalizedText {
  en: string;
  he: string;
}

export interface LocalizedList {
  en: string[];
  he: string[];
}

export interface FaqItem {
  question: LocalizedText;
  answer: LocalizedText;
}

export interface ToolExample {
  label: LocalizedText;
  input: string;
}

export interface ConverterOptionChoice {
  label: LocalizedText;
  value: string;
}

export interface ConverterOption {
  id: string;
  label: LocalizedText;
  type: 'select' | 'toggle';
  defaultValue: string | boolean;
  choices?: ConverterOptionChoice[];
}

export interface ConverterTool {
  slug: string;
  converterId: string;
  reverseSlug?: string;
  category: ConverterCategory;
  inputType: string;
  outputType: string;
  title: LocalizedText;
  shortTitle: LocalizedText;
  description: LocalizedText;
  metaDescription: LocalizedText;
  keywords: LocalizedList;
  features: LocalizedList;
  guide: LocalizedList;
  examples: ToolExample[];
  options?: ConverterOption[];
  faq: FaqItem[];
  related: string[];
  popular?: boolean;
  new?: boolean;
}

export type ConverterOptions = Record<string, string | number | boolean>;

export interface ConvertPreview {
  type: 'color' | 'json' | 'table' | 'jwt';
  title?: string;
  values?: Record<string, string | number | boolean>;
  rows?: Record<string, string | number | boolean>[];
}

export interface ConvertResult {
  output: string;
  warnings?: string[];
  metadata?: Record<string, string | number>;
  preview?: ConvertPreview;
}
