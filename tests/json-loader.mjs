import { readFile } from 'node:fs/promises';
export async function load(url, context, nextLoad) {
  if (url.startsWith('file:') && url.endsWith('.json') && !context.importAttributes?.type) {
    const data = JSON.parse(await readFile(new URL(url), 'utf8'));
    return { format: 'module', source: `export default ${JSON.stringify(data)};`, shortCircuit: true };
  }
  return nextLoad(url, context);
}
