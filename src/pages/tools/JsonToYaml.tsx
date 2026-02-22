import { useTranslation } from 'react-i18next';
import { ConverterLayout } from '../../components/ConverterLayout';
import { jsonToYaml } from '../../utils/yaml';

export function JsonToYaml() {
  const { t } = useTranslation();

  return (
    <ConverterLayout
      title={t('pages.jsonToYaml.title')}
      description={t('pages.jsonToYaml.desc')}
      inputLabel={t('pages.jsonToYaml.input')}
      outputLabel={t('pages.jsonToYaml.output')}
      storageKey="json-to-yaml-input"
      onConvert={jsonToYaml}
      defaultOutputExtension="yaml"
    />
  );
}
