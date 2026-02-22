
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ToolCard } from '../components/ToolCard';

export default function Home() {
  return (
    <div className="app-wrapper">
      <div className="container">
        <Header showBack={false} />
        <main>
          <div className="tools-grid">
            <ToolCard
              iconType="FileText"
              title="JSON to CSV"
              description="Transform JSON objects/arrays into clean CSV files for spreadsheets and analysis."
              features={['Instant', 'Handles Arrays', 'Privacy First']}
              linkUrl="/json-to-csv"
            />
            <ToolCard
              iconType="Database"
              title="CSV to JSON"
              description="Parse CSV headers and rows into structured JSON for APIs and data workflows."
              features={['Instant', 'Handles Quotes', 'Privacy First']}
              linkUrl="/csv-to-json"
            />
            <ToolCard
              iconType="Code2"
              title="JSON to XML"
              description="Convert JSON objects/arrays into well-formed XML for integrations and documentation."
              features={['Instant', 'Escapes Special Chars', 'Privacy First']}
              linkUrl="/json-to-xml"
            />
            <ToolCard
              iconType="FileJson"
              title="XML to JSON"
              description="Convert XML elements and attributes into structured JSON for APIs and data analysis."
              features={['Instant', 'Handles Attributes', 'Privacy First']}
              linkUrl="/xml-to-json"
            />
          </div>
          <section style={{ textAlign: 'center', marginTop: '3rem' }}>
            <h2>How It Works</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '1rem auto' }}>
              All tools process your data locally in your browser. No uploads, no tracking, no limits. Choose a
              tool above to get started.
            </p>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
