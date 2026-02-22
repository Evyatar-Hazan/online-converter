
import { ConverterLayout } from '../components/ConverterLayout';
import { csvToJson } from '../utils/csvToJson';

export default function CsvToJson() {
  return (
    <ConverterLayout
      title="CSV to JSON Converter"
      description="Parse CSV data into structured JSON format. Supports complex quotes and commas."
      inputLabel="CSV Input"
      outputLabel="JSON Output"
      storageKey="converter_csv_to_json_input"
      onConvert={csvToJson}
      defaultOutputExtension="json"
    />
  );
}
