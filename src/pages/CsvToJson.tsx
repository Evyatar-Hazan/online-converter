
import { ConverterLayout } from '../components/ConverterLayout';
import { csvToJson } from '../utils/csvToJson';
import { useTranslation } from 'react-i18next';

export default function CsvToJson() {
  const { t } = useTranslation();
  return (
    <ConverterLayout
      title={t('pages.csvToJson.title')}
      description={t('pages.csvToJson.desc')}
      inputLabel={t('pages.csvToJson.input')}
      outputLabel={t('pages.csvToJson.output')}
      storageKey="converter_csv_to_json_input"
      onConvert={csvToJson}
      defaultOutputExtension="json"
    />
  );
}
