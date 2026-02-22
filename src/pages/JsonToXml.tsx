
import { ConverterLayout } from '../components/ConverterLayout';
import { jsonToXml } from '../utils/jsonToXml';

export default function JsonToXml() {
  return (
    <ConverterLayout
      title="JSON to XML Converter"
      description="Convert JSON data into well-formed XML format with automatic tag generation."
      inputLabel="JSON Input"
      outputLabel="XML Output"
      storageKey="converter_json_to_xml_input"
      onConvert={jsonToXml}
      defaultOutputExtension="xml"
    />
  );
}
