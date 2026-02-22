
import { ConverterLayout } from '../components/ConverterLayout';
import { jsonToCsv } from '../utils/jsonToCsv';

export default function JsonToCsv() {
  return (
    <ConverterLayout
      title="JSON to CSV Converter"
      description="Transform JSON APIs and payloads into clean CSV files. Handles nested arrays gracefully."
      inputLabel="JSON Input"
      outputLabel="CSV Output"
      storageKey="converter_json_to_csv_input"
      onConvert={jsonToCsv}
      defaultOutputExtension="csv"
    />
  );
}
