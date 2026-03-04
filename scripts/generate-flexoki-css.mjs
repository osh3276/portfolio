import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const rootDir = process.cwd();
const sourcePath = resolve(rootDir, 'src/styles/flexoki.ts');
const outputPath = resolve(rootDir, 'src/styles/generated/flexoki.css');

const source = readFileSync(sourcePath, 'utf8');
const match = source.match(/const\s+colors\s*=\s*(\{[\s\S]*?\});/);

if (!match) {
	throw new Error('Could not find `const colors = {...}` in src/styles/flexoki.ts');
}

const colors = Function(`"use strict"; return (${match[1]});`)();

const lines = [];
lines.push('/* Auto-generated from src/styles/flexoki.ts. Do not edit manually. */');
lines.push(':root {');

for (const [name, value] of Object.entries(colors.base)) {
	lines.push(`\t--flexoki-base-${String(name)}: ${String(value).toLowerCase()};`);
}

for (const [family, tokens] of Object.entries(colors)) {
	if (family === 'base') {
		continue;
	}

	for (const [tokenName, tokenValue] of Object.entries(tokens)) {
		const cssName = tokenName === 'DEFAULT'
			? `--flexoki-${family}`
			: `--flexoki-${family}-${String(tokenName).toLowerCase()}`;
		lines.push(`\t${cssName}: ${String(tokenValue).toLowerCase()};`);
	}
}

lines.push('}');
lines.push('');

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, lines.join('\n'));
