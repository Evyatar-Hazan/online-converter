
import { Link } from 'react-router-dom';
import { FileJson, FileText, Code2, Database, FileCog, Settings2 } from 'lucide-react';

// Maps string identifiers to Lucide icons
const iconMap = {
  FileText: <FileText size={40} className="tool-icon" />,
  FileJson: <FileJson size={40} className="tool-icon" />,
  Code2: <Code2 size={40} className="tool-icon" />,
  Database: <Database size={40} className="tool-icon" />,
  FileCog: <FileCog size={40} className="tool-icon" />,
  Settings2: <Settings2 size={40} className="tool-icon" />
};

interface ToolCardProps {
  iconType: keyof typeof iconMap;
  title: string;
  description: string;
  features: string[];
  linkUrl: string;
  openText: string;
}

export function ToolCard({ iconType, title, description, features, linkUrl, openText }: ToolCardProps) {
  return (
    <div className="tool-card">
      <div aria-hidden="true">
        {iconMap[iconType]}
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="tool-features">
        {features.map((feature, idx) => (
          <span key={idx} className="feature">✓ {feature}</span>
        ))}
      </div>
      <Link to={linkUrl} className="btn">
        {openText}
      </Link>
    </div>
  );
}
