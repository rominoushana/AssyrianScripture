const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials not found in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function importBibleVerses() {
  console.log('Reading CSV file...');

  const csvPath = path.join(__dirname, '../assets/data/New-Testament-Merged-ASY-TRL-ENG.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  const lines = csvContent.split('\n');
  const verses = [];

  let currentBook = '';
  let currentChapter = '';

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const match = line.match(/^([^,]*),([^,]*),([^,]*),("(?:[^"]|"")*"|[^,]*),("(?:[^"]|"")*"|[^,]*),("(?:[^"]|"")*"|[^,]*)$/);

    if (match) {
      const [, book, chapter, verse, asy, trl, eng] = match;

      const cleanField = (field) => {
        return field.replace(/^"|"$/g, '').replace(/""/g, '"').trim();
      };

      if (cleanField(book)) {
        currentBook = cleanField(book);
      }
      if (cleanField(chapter)) {
        currentChapter = cleanField(chapter);
      }

      if (currentBook && currentChapter && cleanField(verse)) {
        verses.push({
          book: currentBook,
          chapter: parseInt(currentChapter),
          verse: parseInt(cleanField(verse)),
          assyrian: cleanField(asy),
          transliteration: cleanField(trl),
          english: cleanField(eng)
        });
      }
    }
  }

  console.log(`Parsed ${verses.length} verses`);
  console.log('Importing verses to Supabase...');

  const batchSize = 500;
  let imported = 0;

  for (let i = 0; i < verses.length; i += batchSize) {
    const batch = verses.slice(i, i + batchSize);

    const { error } = await supabase
      .from('bible_verses')
      .insert(batch);

    if (error) {
      console.error(`Error importing batch ${Math.floor(i / batchSize) + 1}:`, error);
      process.exit(1);
    }

    imported += batch.length;
    console.log(`Imported ${imported} / ${verses.length} verses...`);
  }

  console.log('All verses imported successfully!');
}

async function importLiturgicalCalendar() {
  console.log('\nImporting liturgical calendar...');

  const calendarData = [
    { date: '2025-01-06', year: 2025, feast_name: 'Holy Feast Of The Epiphany', lection_1: 'Num 24:2-9, 15-end', lection_2: 'Isa 4:2-5; 11:1-5; 12:4-end', epistle: 'Tit 2:11-3:7', gospel: 'Mt 3' },
    { date: '2025-01-12', year: 2025, feast_name: 'First Sunday Of Epiphany', lection_1: 'Ex 3:1-15', lection_2: 'Isa 44:21-45:4', epistle: '2 Tim 3:1-15', gospel: 'Lk 4:14-30' },
    { date: '2025-01-19', year: 2025, feast_name: 'Second Sunday Of Epiphany', lection_1: 'Num 10:29-11:10', lection_2: 'Isa 45:11-17', epistle: 'Heb 3:1-13', gospel: 'Jn 1:1-28' },
    { date: '2025-01-26', year: 2025, feast_name: 'Third Sunday Of Epiphany', lection_1: 'Num 11:11-20', lection_2: 'Isa 45:18-46:4', epistle: 'Heb 3:14-4:10', gospel: 'Jn 1:29-42' },
    { date: '2025-02-02', year: 2025, feast_name: 'Fourth Sunday Of Epiphany', lection_1: 'Num 11:23-end', lection_2: 'Isa 46:5-end', epistle: 'Heb 7:18-end', gospel: 'Jn 1:43-2:11' },
    { date: '2025-02-09', year: 2025, feast_name: 'Fifth Sunday Of Epiphany', lection_1: 'Deu 18:9-end', lection_2: 'Isa 48:12-20', epistle: 'Heb 6:9-7:3', gospel: 'Jn 3:1-21' },
    { date: '2025-02-12', year: 2025, feast_name: 'Rogation Of The Ninevites', lection_1: 'Isa 63:17-64:all', lection_2: 'Amo 5:3-15; Hab 3:all', epistle: '1 Tim 2:1-10', gospel: 'Mt 5:17-37' },
    { date: '2025-02-13', year: 2025, feast_name: 'Rogation Of The Ninevites', lection_1: '1 Sam 7:3-9', lection_2: 'Isa 59:1-18', epistle: 'Rom 12', gospel: 'Lk 18:1-14' },
    { date: '2025-02-14', year: 2025, feast_name: 'Rogation Of The Ninevites', lection_1: 'Jol 2:1-27', lection_2: 'Jon 3', epistle: 'Col 3:1-4:1', gospel: 'Mt 6:1-18' },
    { date: '2025-02-15', year: 2025, feast_name: 'Thursday Following Rogation - Thanksgiving', lection_1: 'Isa 65:16-66:2', lection_2: 'Jer 17:21-26', epistle: 'Rom 10:1-13', gospel: 'Jn 16:23-end' },
    { date: '2025-02-16', year: 2025, feast_name: 'Sixth Sunday Of Epiphany', lection_1: 'Deu 24:9-end', lection_2: 'Isa 63:7-16', epistle: 'Heb 8:1-9:10', gospel: 'Jn 3:22-4:3' },
    { date: '2025-02-23', year: 2025, feast_name: 'Seventh Sunday Of Epiphany', lection_1: 'Deu 14:2-15:4', lection_2: 'Isa 42:5-9, 14-17', epistle: '1 Tim 6:9-end', gospel: 'Mt 7:28-8:13' },
    { date: '2025-03-02', year: 2025, feast_name: 'Eighth Sunday Of Epiphany', lection_1: 'Ex 15:22-26', lection_2: 'Isa 44:23-45:7', epistle: 'Eph 1:15-2:7', gospel: 'Mk 1:1-11' },
    { date: '2025-03-03', year: 2025, feast_name: 'Sunday Entering The Great Fast', lection_1: 'Ex 34:1-7, 27-end', lection_2: 'Isa 58:1-13', epistle: 'Eph 4:17-5:4, 15-21', gospel: 'Mt 3:16-4:11' },
    { date: '2025-03-10', year: 2025, feast_name: 'Second Sunday Of The Great Fast', lection_1: 'Gen 5:18-31', lection_2: 'Jos 4:15-end', epistle: 'Rom 5', gospel: 'Mt 7:15-27' },
    { date: '2025-03-17', year: 2025, feast_name: 'Third Sunday Of The Great Fast', lection_1: 'Gen 7', lection_2: 'Jos 5:13-6:5', epistle: 'Rom 7:14-24', gospel: 'Mt 20:17-28' },
    { date: '2025-03-24', year: 2025, feast_name: 'Fourth Sunday Of The Great Fast', lection_1: 'Gen 11', lection_2: 'Jos 6:27-7:15', epistle: 'Rom 8:12-27', gospel: 'Mt 21:23-end' },
    { date: '2025-03-27', year: 2025, feast_name: 'Wednesday Of Mid-Lent', lection_1: 'Gen 13:8-end', lection_2: 'Jos 8:18-29', epistle: 'Rom 9:30-10:17', gospel: 'Jn 6:51-69' },
    { date: '2025-03-31', year: 2025, feast_name: 'Fifth Sunday Of The Great Fast', lection_1: 'Gen 16:1-17:all', lection_2: 'Jos 9:15-end', epistle: 'Rom 12', gospel: 'Jn 7:37-8:12-20' },
    { date: '2025-04-07', year: 2025, feast_name: 'Sixth Sunday Of Great Fast', lection_1: 'Gen 19:1-26', lection_2: 'Jos 21:43-22:9', epistle: 'Rom 14:10-end', gospel: 'Jn 9:39-10:21' },
    { date: '2025-04-14', year: 2025, feast_name: 'Palm Sunday (Hosannas)', lection_1: 'Gen 49:1-12, 22-26', lection_2: 'Zec 3:7-4:6, 11-end; 7:9-10; 8:4-5, 12-19; 9:9-12', epistle: 'Rom 11:13-24', gospel: 'Mt 20:29-21:22' },
    { date: '2025-04-18', year: 2025, feast_name: 'Holy Thursday Of The Passover', lection_1: 'Ex 12:1-20', lection_2: 'Zac 9:9-12; 11:4-5, 12-13; 12:9-end; 13:7-end', epistle: '1 Cor 5:7-8; 10:15-17; 11:23-end', gospel: 'Mt 26:1-6, 14-30' },
    { date: '2025-04-21', year: 2025, feast_name: 'Easter Sunday', lection_1: 'Isa 60:1-7', lection_2: '1 Sam 2:1-10', epistle: 'Rom 5:20-6:all', gospel: 'Jn 20:1-18' },
    { date: '2025-04-28', year: 2025, feast_name: 'Second Sunday Of Resurrection', lection_1: 'Isa 55:4-end', lection_2: 'Acts 4:32-5:5', epistle: 'Col 1:1-20', gospel: 'Jn 20:19-end' },
    { date: '2025-05-05', year: 2025, feast_name: 'Third Sunday Of Resurrection', lection_1: 'Isa 56:1-7', lection_2: 'Acts 5:34-end', epistle: 'Eph 1:1-14', gospel: 'Jn 14:1-14' },
    { date: '2025-05-12', year: 2025, feast_name: 'Fourth Sunday Of Resurrection', lection_1: 'Isa 49:13-23', lection_2: 'Acts 8:14-25', epistle: 'Eph 1:15-2:5', gospel: 'Jn 16:16-end' },
    { date: '2025-05-15', year: 2025, feast_name: 'Commemoration Of St. George', lection_1: 'Dan 6:6-end', lection_2: 'Acts 12:1-24', epistle: 'Php 1:12-26', gospel: 'Mt 10:37-end; 19:27-end' },
    { date: '2025-05-19', year: 2025, feast_name: 'Fifth Sunday Of Resurrection', lection_1: 'Isa 49:7-13', lection_2: 'Acts 9:1-19', epistle: 'Heb 10:19-36', gospel: 'Jn 21:1-14' },
    { date: '2025-05-26', year: 2025, feast_name: 'Sixth Sunday Of Resurrection', lection_1: 'Isa 51:9-11; 52:7-12', lection_2: 'Acts 10:1-16', epistle: 'Eph 2:4-end', gospel: 'Jn 17' },
    { date: '2025-05-30', year: 2025, feast_name: 'The Holy Feast Of The Ascension', lection_1: '2 Kgs 2:1-15', lection_2: 'Acts 1:1-14', epistle: '1 Tim 1:18-2:all; 3:14-end', gospel: 'Lk 24:36-end' },
    { date: '2025-10-26', year: 2025, feast_name: 'First Sunday Of Moses', lection_1: '', lection_2: '', epistle: '', gospel: 'Mt 20:1-16' },
    { date: '2025-11-02', year: 2025, feast_name: 'Second Sunday Of Moses', lection_1: '', lection_2: '', epistle: '', gospel: 'Mt 1:1-17' },
    { date: '2025-11-09', year: 2025, feast_name: 'Third Sunday Of Moses', lection_1: '', lection_2: '', epistle: '', gospel: 'Mt 1:18-25' },
  ];

  const { error } = await supabase
    .from('liturgical_calendar')
    .insert(calendarData);

  if (error) {
    console.error('Error importing liturgical calendar:', error);
    process.exit(1);
  }

  console.log(`Imported ${calendarData.length} liturgical events successfully!`);
}

async function main() {
  try {
    await importBibleVerses();
    await importLiturgicalCalendar();
    console.log('\n✅ All data imported successfully!');
  } catch (error) {
    console.error('Error during import:', error);
    process.exit(1);
  }
}

main();
