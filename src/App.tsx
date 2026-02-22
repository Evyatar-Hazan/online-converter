
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import JsonToCsv from './pages/JsonToCsv';
import CsvToJson from './pages/CsvToJson';
import JsonToXml from './pages/JsonToXml';
import XmlToJson from './pages/XmlToJson';
import { JsonToYaml } from './pages/tools/JsonToYaml';
import { YamlToJson } from './pages/tools/YamlToJson';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/json-to-csv" element={<JsonToCsv />} />
      <Route path="/csv-to-json" element={<CsvToJson />} />
      <Route path="/json-to-xml" element={<JsonToXml />} />
      <Route path="/xml-to-json" element={<XmlToJson />} />
      <Route path="/json-to-yaml" element={<JsonToYaml />} />
      <Route path="/yaml-to-json" element={<YamlToJson />} />
    </Routes>
  );
}

export default App;
