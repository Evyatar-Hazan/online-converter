
import { ConverterLayout } from '../components/ConverterLayout';
import { jsonToXml } from '../utils/jsonToXml';
import { useTranslation } from 'react-i18next';

export default function JsonToXml() {
  const { t } = useTranslation();
  return (
    <ConverterLayout
      title={t('pages.jsonToXml.title')}
      description={t('pages.jsonToXml.desc')}
      inputLabel={t('pages.jsonToXml.input')}
      outputLabel={t('pages.jsonToXml.output')}
      storageKey="converter_json_to_xml_input"
      onConvert={jsonToXml}
      defaultOutputExtension="xml"
    />
  );
}
