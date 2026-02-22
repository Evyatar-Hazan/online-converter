
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import JsonToCsv from './pages/JsonToCsv';
import CsvToJson from './pages/CsvToJson';
import JsonToXml from './pages/JsonToXml';
import XmlToJson from './pages/XmlToJson';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/json-to-csv" element={<JsonToCsv />} />
      <Route path="/csv-to-json" element={<CsvToJson />} />
      <Route path="/json-to-xml" element={<JsonToXml />} />
      <Route path="/xml-to-json" element={<XmlToJson />} />
    </Routes>
  );
}

export default App;
