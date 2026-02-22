
import { ConverterLayout } from '../components/ConverterLayout';
import { jsonToCsv } from '../utils/jsonToCsv';
import { useTranslation } from 'react-i18next';

export default function JsonToCsv() {
  const { t } = useTranslation();
  return (
    <ConverterLayout
      title={t('pages.jsonToCsv.title')}
      description={t('pages.jsonToCsv.desc')}
      inputLabel={t('pages.jsonToCsv.input')}
      outputLabel={t('pages.jsonToCsv.output')}
      storageKey="converter_json_to_csv_input"
      onConvert={jsonToCsv}
      defaultOutputExtension="csv"
    />
  );
}
