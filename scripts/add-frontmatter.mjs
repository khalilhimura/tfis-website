import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { glob } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// The existing summary data from philosophers.astro
const SUMMARIES = {
  'socrates': 'The unexamined life is not worth living.',
  'aristotle': 'Flourishing through virtuous activity over a complete life.',
  'epicurus': 'Simple pleasures, friendship, freedom from fear.',
  'marcus-aurelius': 'Live according to Nature; accept what comes.',
  'nietzsche': 'Create your own values; love your fate.',
  'kierkegaard': 'Become a self before God through passionate faith.',
  'sartre': 'Invent meaning through committed choice.',
  'camus': 'Revolt against the absurd; live lucidly.',
  'frankl': 'Meaning through attitude toward unavoidable suffering.',
  'wittgenstein': 'Meaning is shown in how we live.',
  'plato': 'Ascent of the soul toward the Form of the Good.',
  'zeno': 'Live in agreement with nature; virtue is the only good.',
  'confucius': 'Cultivate humane goodness; bring harmony through right relationship.',
  'lao-tzu': 'Harmony with the Tao through effortless action.',
  'buddha': 'End suffering through the Noble Eightfold Path.',
  'seneca': 'Perfect reason; achieve calm through virtue.',
  'augustine': 'The restless heart finds rest only in God.',
  'aquinas': 'Union with God through knowledge and love.',
  'descartes': 'Right use of reason through methodical doubt.',
  'spinoza': 'Understand your place in Nature; intellectual love of God.',
  'hume': 'Meaning through passion, social bonds, shared happiness.',
  'kant': 'Highest good through a good will acting from duty.',
  'schopenhauer': 'Deny the will through art, compassion, renunciation.',
  'mill': 'Maximize happiness through higher pleasures.',
  'bentham': 'Greatest happiness of the greatest number.',
  'marx': 'Abolish alienation through collective liberation.',
  'emerson': 'Realize unity with the Over-Soul.',
  'thoreau': 'Live deliberately; simplify; follow conscience.',
  'james': 'Forge meaning through the strenuous moral life.',
  'dewey': 'Growth of meaning through intelligent problem-solving.',
  'jung': 'Individuation: become whole by integrating the unconscious.',
  'beauvoir': 'Exercise freedom in authentic project, in solidarity.',
  'arendt': 'Act in the public realm; begin something new.',
  'russell': 'Pursue knowledge, love, compassionate action.',
  'heidegger': 'Live authentically; face death; own your thrownness.',
  'dennett': 'Become a designer of purposes.',
  'nagel': 'Live with seriousness and irony.',
  'watts': 'Stop seeking; the meaning is to be alive.',
  'thich-nhat-hanh': 'Touch the miracle through mindfulness and compassion.',
  'krishnamurti': 'Live without a center; choiceless awareness.',
  'rand': 'Live as a rational being; pursue your own happiness.',
  'chomsky': 'Pursue freedom and fullest human creative capacity.',
  'nussbaum': 'Cultivate central capabilities for a life of dignity.',
  'zizek': 'Confront the Real of your desire; enact the impossible.',
  'singer': 'Reduce suffering across all sentient beings.',
  'west': 'Live with existential integrity; bear witness to justice.',
  'butler': 'Struggle for recognizability; every life grievable.',
  'harris': 'Pursue well-being through mindfulness and honesty.',
  'peterson': 'Take up the cross of your own becoming.',
  'harari': 'Reduce suffering; craft stories that minimize pain.',
};

const PHILOSOPHERS_DIR = '/Users/khalilhimura/Projects/tfis/tfis-site/src/content/philosophers';
const { readdirSync } = await import('fs');

const files = readdirSync(PHILOSOPHERS_DIR).filter(f => f.endsWith('.md'));

for (const file of files) {
  const slug = file.replace(/\.md$/, '');
  const content = readFileSync(join(PHILOSOPHERS_DIR, file), 'utf-8');
  
  // Extract the name from the first line (# Title)
  const titleMatch = content.match(/^#\s+(.+)/m);
  const name = titleMatch ? titleMatch[1].trim() : slug;
  
  // Extract era/tradition from the **...** line
  const eraMatch = content.match(/^\*\*(.+?)\*\*/m);
  const era = eraMatch ? eraMatch[1].trim() : '';
  
  const summary = SUMMARIES[slug] || '';
  
  const frontmatter = `---
title: "${name}"
philosopher: "${name}"
summary: "${summary}"
era: "${era}"
draft: false
---

`;
  
  // Remove the original "# Title" line and the era line, since frontmatter covers it
  let body = content
    .replace(/^#\s+.+\n*/, '')           // Remove "# Title"
    .replace(/^>.*\n*/, '')              // Remove "> *Edited for clarity..."
    .replace(/^\*\*.+?\*\*\n*/, '')      // Remove "**Era | Tradition**"
    .replace(/^---\n*/, '');             // Remove the separator
  
  writeFileSync(join(PHILOSOPHERS_DIR, file), frontmatter + body.trimStart() + '\n');
  console.log(`✓ ${file}`);
}

console.log(`\nDone. Processed ${files.length} files.`);
