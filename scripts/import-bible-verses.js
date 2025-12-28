const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../assets/data/New-Testament-Merged-ASY-TRL-ENG.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

const lines = csvContent.split('\n');
const verses = [];

console.log('Parsing CSV file...');

let currentBook = '';
let currentChapter = '';

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  const match = line.match(/^([^,]*),([^,]*),([^,]*),("(?:[^"]|"")*"|[^,]*),("(?:[^"]|"")*"|[^,]*),("(?:[^"]|"")*"|[^,]*)$/);

  if (match) {
    const [, book, chapter, verse, asy, trl, eng] = match;

    const cleanField = (field) => {
      return field.replace(/^"|"$/g, '').replace(/""/g, '"').trim().replace(/'/g, "''");
    };

    // If book or chapter is empty, use the previous values
    if (cleanField(book)) {
      currentBook = cleanField(book);
    }
    if (cleanField(chapter)) {
      currentChapter = cleanField(chapter);
    }

    if (currentBook && currentChapter && cleanField(verse)) {
      verses.push({
        book: currentBook,
        chapter: currentChapter,
        verse: cleanField(verse),
        assyrian: cleanField(asy),
        transliteration: cleanField(trl),
        english: cleanField(eng)
      });
    }
  }
}

console.log(`Parsed ${verses.length} verses`);
console.log('Generating SQL INSERT statements...');

let sql = '';
const batchSize = 500;

for (let i = 0; i < verses.length; i += batchSize) {
  const batch = verses.slice(i, i + batchSize);

  sql += 'INSERT INTO bible_verses (book, chapter, verse, assyrian, transliteration, english) VALUES\n';

  const values = batch.map(v =>
    `('${v.book}', ${v.chapter}, ${v.verse}, '${v.assyrian}', '${v.transliteration}', '${v.english}')`
  ).join(',\n');

  sql += values + ';\n\n';
}

const outputPath = path.join(__dirname, 'bible-verses-import.sql');
fs.writeFileSync(outputPath, sql);

console.log(`SQL file generated: ${outputPath}`);
console.log(`Total verses: ${verses.length}`);
console.log('Now importing to database...');
