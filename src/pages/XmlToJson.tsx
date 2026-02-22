
import { ConverterLayout } from '../components/ConverterLayout';
import { xmlToJson } from '../utils/xmlToJson';

export default function XmlToJson() {
  return (
    <ConverterLayout
      title="XML to JSON Converter"
      description="Convert XML structures and attributes into clean JSON. Great for modernizing legacy APIs."
      inputLabel="XML Input"
      outputLabel="JSON Output"
      storageKey="converter_xml_to_json_input"
      onConvert={xmlToJson}
      defaultOutputExtension="json"
    />
  );
}
