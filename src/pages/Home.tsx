
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ToolCard } from '../components/ToolCard';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="app-wrapper">
      <div className="container">
        <Header showBack={false} />
        <main>
          <div className="tools-grid">
            <ToolCard
              iconType="FileText"
              title={t('tools.jsonToCsv.title')}
              description={t('tools.jsonToCsv.desc')}
              features={[t('tools.jsonToCsv.f1'), t('tools.jsonToCsv.f2'), t('tools.jsonToCsv.f3')]}
              linkUrl="/json-to-csv"
              openText={t('tools.jsonToCsv.open')}
            />
            <ToolCard
              iconType="Database"
              title={t('tools.csvToJson.title')}
              description={t('tools.csvToJson.desc')}
              features={[t('tools.csvToJson.f1'), t('tools.csvToJson.f2'), t('tools.csvToJson.f3')]}
              linkUrl="/csv-to-json"
              openText={t('tools.csvToJson.open')}
            />
            <ToolCard
              iconType="Code2"
              title={t('tools.jsonToXml.title')}
              description={t('tools.jsonToXml.desc')}
              features={[t('tools.jsonToXml.f1'), t('tools.jsonToXml.f2'), t('tools.jsonToXml.f3')]}
              linkUrl="/json-to-xml"
              openText={t('tools.jsonToXml.open')}
            />
            <ToolCard
              iconType="FileJson"
              title={t('tools.xmlToJson.title')}
              description={t('tools.xmlToJson.desc')}
              features={[t('tools.xmlToJson.f1'), t('tools.xmlToJson.f2'), t('tools.xmlToJson.f3')]}
              linkUrl="/xml-to-json"
              openText={t('tools.xmlToJson.open')}
            />
            <ToolCard
              iconType="FileCog"
              title={t('tools.jsonToYaml.title')}
              description={t('tools.jsonToYaml.desc')}
              features={[t('tools.jsonToYaml.f1'), t('tools.jsonToYaml.f2'), t('tools.jsonToYaml.f3')]}
              linkUrl="/json-to-yaml"
              openText={t('tools.jsonToYaml.open')}
            />
            <ToolCard
              iconType="Settings2"
              title={t('tools.yamlToJson.title')}
              description={t('tools.yamlToJson.desc')}
              features={[t('tools.yamlToJson.f1'), t('tools.yamlToJson.f2'), t('tools.yamlToJson.f3')]}
              linkUrl="/yaml-to-json"
              openText={t('tools.yamlToJson.open')}
            />
          </div>
          <section style={{ textAlign: 'center', marginTop: '3rem' }}>
            <h2>{t('home.howItWorksTitle')}</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '1rem auto' }}>
              {t('home.howItWorksDesc')}
            </p>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
