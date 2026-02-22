import { useTranslation } from 'react-i18next';
import { ConverterLayout } from '../../components/ConverterLayout';
import { yamlToJson } from '../../utils/yaml';

export function YamlToJson() {
  const { t } = useTranslation();

  return (
    <ConverterLayout
      title={t('pages.yamlToJson.title')}
      description={t('pages.yamlToJson.desc')}
      inputLabel={t('pages.yamlToJson.input')}
      outputLabel={t('pages.yamlToJson.output')}
      storageKey="yaml-to-json-input"
      onConvert={yamlToJson}
      defaultOutputExtension="json"
    />
  );
}
