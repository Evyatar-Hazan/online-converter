import yaml from 'js-yaml';

/**
 * Parses a JSON string and converts it to a formatted YAML string.
 * @param jsonString The input JSON string.
 * @returns A formatted YAML string.
 * @throws An error if the JSON is invalid.
 */
export function jsonToYaml(jsonString: string): string {
  if (!jsonString.trim()) return '';
  const jsonObj = JSON.parse(jsonString);
  return yaml.dump(jsonObj, { indent: 2 });
}

/**
 * Parses a YAML string and converts it to a formatted JSON string.
 * @param yamlString The input YAML string.
 * @returns A formatted JSON string.
 * @throws An error if the YAML is invalid.
 */
export function yamlToJson(yamlString: string): string {
  if (!yamlString.trim()) return '';
  const jsonObj = yaml.load(yamlString);
  return JSON.stringify(jsonObj, null, 2);
}
