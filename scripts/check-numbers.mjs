// Checks that every number in the source NIR page's tables reached the built
// board, and that the board's tables add none. Run after `npm run build`.
// Usage: node scripts/check-numbers.mjs [built-page]
import { readFileSync } from 'node:fs';

const SOURCE = 'reference/nir-showcase.dc.html';
const BUILT = process.argv[2] ?? 'dist/posts/nir-automl-benchmark/index.html';

// Numbers as written: 0.435, 2,714, 172, 1100 (ranges split on the dash).
const NUMBER = /\d[\d,]*(?:\.\d+)?/g;
const TABLE = /<table[\s\S]*?<\/table>/g;

function tableNumbers(file) {
  const html = readFileSync(file, 'utf8');
  const tables = html.match(TABLE) ?? [];
  const text = tables.join(' ').replace(/<[^>]+>/g, ' ').replace(/&#?\w+;/g, ' ');
  return text.match(NUMBER) ?? [];
}

function counts(list) {
  const m = new Map();
  for (const n of list) {
    m.set(n, (m.get(n) ?? 0) + 1);
  }
  return m;
}

// Report numbers whose count differs between the two files.
function diff(a, b) {
  const out = [];
  for (const key of new Set([...a.keys(), ...b.keys()])) {
    const ca = a.get(key) ?? 0;
    const cb = b.get(key) ?? 0;
    if (ca !== cb) {
      out.push(`${key}: source ${ca}, built ${cb}`);
    }
  }
  return out;
}

const source = tableNumbers(SOURCE);
const built = tableNumbers(BUILT);
const problems = diff(counts(source), counts(built));

if (source.length === 0) {
  console.error(`No table numbers found in ${SOURCE}`);
  process.exit(1);
}

if (problems.length > 0) {
  console.error(`Table numbers differ (${problems.length}):\n` + problems.join('\n'));
  process.exit(1);
}

console.log(`OK: ${source.length} table numbers match between ${SOURCE} and ${BUILT}`);
