
import { ConverterLayout } from '../components/ConverterLayout';
import { xmlToJson } from '../utils/xmlToJson';
import { useTranslation } from 'react-i18next';

export default function XmlToJson() {
  const { t } = useTranslation();
  return (
    <ConverterLayout
      title={t('pages.xmlToJson.title')}
      description={t('pages.xmlToJson.desc')}
      inputLabel={t('pages.xmlToJson.input')}
      outputLabel={t('pages.xmlToJson.output')}
      storageKey="converter_xml_to_json_input"
      onConvert={xmlToJson}
      defaultOutputExtension="json"
    />
  );
}
