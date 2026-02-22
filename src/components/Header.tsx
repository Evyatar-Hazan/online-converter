
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  showBack?: boolean;
}

export function Header({ showBack = false }: HeaderProps) {
  return (
    <header>
      {showBack && (
        <Link to="/" className="back-link">
          <ArrowLeft size={16} /> Back to Tools
        </Link>
      )}
      <h1>Universal Data Converter</h1>
      <p className="description">
        Convert between JSON, CSV, and XML formats. All tools run 100% in your browser for privacy and speed.
      </p>
    </header>
  );
}
