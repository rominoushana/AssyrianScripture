const { createClient } = require('@supabase/supabase-js');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase credentials not found in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function importCompleteCalendar() {
  console.log('Importing complete 2025 liturgical calendar...');

  const calendarData = [
    { date: '2025-01-06', year: 2025, feast_name: 'Holy Feast of Epiphany', lection_1: 'Num 24:2-9, 15-end', lection_2: 'Isa 4:2-5; 11:1-5; 12:4-end', epistle: 'Titus 2:11-3:7', gospel: 'Matt 3' },
    { date: '2025-01-07', year: 2025, feast_name: 'First Sunday of Epiphany', lection_1: 'Exo 3:1-15', lection_2: 'Isa 44:21-45:4', epistle: '2 Tim 3:1-15', gospel: 'Luke 4:14-30' },
    { date: '2025-01-14', year: 2025, feast_name: 'Second Sunday of Epiphany', lection_1: 'Num 10:29-11:10', lection_2: 'Isa 45:11-17', epistle: 'Heb 3:1-13', gospel: 'John 1:1-28' },
    { date: '2025-01-19', year: 2025, feast_name: 'Third Sunday of Epiphany', lection_1: 'Num 11:11-20', lection_2: 'Isa 45:18-46:4', epistle: 'Heb 3:14-4:10', gospel: 'John 1:29-42' },
    { date: '2025-01-21', year: 2025, feast_name: 'Fourth Sunday of Epiphany', lection_1: 'Num 11:23-end', lection_2: 'Isa 46:5-end', epistle: 'Heb 7:18-end', gospel: 'John 1:43-2:11' },
    { date: '2025-01-26', year: 2025, feast_name: 'Fifth Sunday of Epiphany', lection_1: 'Deu 18:9-end', lection_2: 'Isa 48:12-20', epistle: 'Heb 6:9-7:3', gospel: 'John 3:1-21' },
    { date: '2025-01-22', year: 2025, feast_name: 'Rogation of Ninevites', lection_1: 'Isa 63:17-64:all', lection_2: 'Amo 5:3-15; Hab 3:all', epistle: '1 Tim 2:1-10', gospel: 'Matt 5:17-37' },
    { date: '2025-01-23', year: 2025, feast_name: 'Rogation of Ninevites', lection_1: '1 Sam 7:3-9', lection_2: 'Isa 59:1-18', epistle: 'Rom 12', gospel: 'Luke 18:1-14' },
    { date: '2025-01-24', year: 2025, feast_name: 'Rogation of Ninevites', lection_1: 'Joel 2:1-27', lection_2: 'Jonah 3', epistle: 'Col 3:1-4:1', gospel: 'Matt 6:1-18' },
    { date: '2025-01-25', year: 2025, feast_name: 'Thursday After Rogation', lection_1: 'Isa 65:16-66:2', lection_2: 'Jer 17:21-26', epistle: 'Rom 10:1-13', gospel: 'John 16:23-end' },
    { date: '2025-01-28', year: 2025, feast_name: 'Sixth Sunday of Epiphany', lection_1: 'Deu 24:9-end', lection_2: 'Isa 63:7-16', epistle: 'Heb 8:1-9:10', gospel: 'John 3:22-4:3' },
    { date: '2025-02-04', year: 2025, feast_name: 'Seventh Sunday of Epiphany', lection_1: 'Deu 14:2-15:4', lection_2: 'Isa 42:5-9, 14-17', epistle: '1 Tim 6:9-end', gospel: 'Matt 7:28-8:13' },
    { date: '2025-02-09', year: 2025, feast_name: 'Eighth Sunday of Epiphany', lection_1: 'Exo 15:22-26', lection_2: 'Isa 44:23-45:7', epistle: 'Eph 1:15-2:7', gospel: 'Mark 1:1-11' },
    { date: '2025-02-11', year: 2025, feast_name: 'Sunday Entering Great Fast', lection_1: 'Exo 34:1-7, 27-end', lection_2: 'Isa 58:1-13', epistle: 'Eph 4:17-5:4, 15-21', gospel: 'Matt 3:16-4:11' },
    { date: '2025-02-18', year: 2025, feast_name: 'Second Sunday of Great Fast', lection_1: 'Gen 5:18-31', lection_2: 'Jos 4:15-end', epistle: 'Rom 5', gospel: 'Matt 7:15-27' },
    { date: '2025-02-25', year: 2025, feast_name: 'Third Sunday of Great Fast', lection_1: 'Gen 7', lection_2: 'Jos 5:13-6:5', epistle: 'Rom 7:14-24', gospel: 'Matt 20:17-28' },
    { date: '2025-03-03', year: 2025, feast_name: 'Fourth Sunday of Great Fast', lection_1: 'Gen 11', lection_2: 'Jos 6:27-7:15', epistle: 'Rom 8:12-27', gospel: 'Matt 21:23-end' },
    { date: '2025-03-06', year: 2025, feast_name: 'Wednesday of Mid-Lent', lection_1: 'Gen 13:8-end', lection_2: 'Jos 8:18-29', epistle: 'Rom 9:30-10:17', gospel: 'John 6:51-69' },
    { date: '2025-03-10', year: 2025, feast_name: 'Fifth Sunday of Great Fast', lection_1: 'Gen 16:1-17:all', lection_2: 'Jos 9:15-end', epistle: 'Rom 12', gospel: 'John 7:37-8:12-20' },
    { date: '2025-03-17', year: 2025, feast_name: 'Sixth Sunday of Great Fast', lection_1: 'Gen 19:1-26', lection_2: 'Jos 21:43-22:9', epistle: 'Rom 14:10-end', gospel: 'John 9:39-10:21' },
    { date: '2025-03-24', year: 2025, feast_name: 'Palm Sunday/Seventh Sunday', lection_1: 'Gen 49:1-12, 22-26', lection_2: 'Zech 3:7-4:6, 11-end; 7:9-10; 8:4-5, 12-19; 9:9-12', epistle: 'Rom 11:13-24', gospel: 'Matt 20:29-21:22' },
    { date: '2025-03-28', year: 2025, feast_name: 'Holy Thursday of Passover', lection_1: 'Exo 12:1-20', lection_2: 'Zech 9:9-12; 11:4-5, 12-13; 12:9-end; 13:7-end', epistle: '1 Cor 5:7-8; 10:15-17; 11:23-end', gospel: 'Matt 26:1-6, 14-30' },
    { date: '2025-03-31', year: 2025, feast_name: 'Easter Sunday', lection_1: 'Isa 60:1-7', lection_2: '1 Sam 2:1-10', epistle: 'Rom 5:20-6:all', gospel: 'John 20:1-18' },
    { date: '2025-04-07', year: 2025, feast_name: 'Second Sunday of Resurrection', lection_1: 'Isa 55:4-end', lection_2: 'Acts 4:32-5:5', epistle: 'Col 1:1-20', gospel: 'John 20:19-end' },
    { date: '2025-04-14', year: 2025, feast_name: 'Third Sunday of Resurrection', lection_1: 'Isa 56:1-7', lection_2: 'Acts 5:34-end', epistle: 'Eph 1:1-14', gospel: 'John 14:1-14' },
    { date: '2025-04-21', year: 2025, feast_name: 'Fourth Sunday of Resurrection', lection_1: 'Isa 49:13-23', lection_2: 'Acts 8:14-25', epistle: 'Eph 1:15-2:5', gospel: 'John 16:16-end' },
    { date: '2025-04-24', year: 2025, feast_name: 'Commemoration of St. George', lection_1: 'Dan 6:6-end', lection_2: 'Acts 12:1-24', epistle: 'Phil 1:12-26', gospel: 'Matt 10:37-end; 19:27-end' },
    { date: '2025-04-28', year: 2025, feast_name: 'Fifth Sunday of Resurrection', lection_1: 'Isa 49:7-13', lection_2: 'Acts 9:1-19', epistle: 'Heb 10:19-36', gospel: 'John 21:1-14' },
    { date: '2025-05-05', year: 2025, feast_name: 'Sixth Sunday of Resurrection', lection_1: 'Isa 51:9-11; 52:7-12', lection_2: 'Acts 10:1-16', epistle: 'Eph 2:4-end', gospel: 'John 17' },
    { date: '2025-05-09', year: 2025, feast_name: 'Holy Feast of Ascension', lection_1: '2 Kgs 2:1-15', lection_2: 'Acts 1:1-14', epistle: '1 Tim 1:18-2:all; 3:14-end', gospel: 'Luke 24:36-end' },
    { date: '2025-05-12', year: 2025, feast_name: 'Sunday After Ascension', lection_1: 'Isa 6', lection_2: 'Acts 1:15-end', epistle: 'Phil 1:27-2:11', gospel: 'Mark 16:2-end' },
    { date: '2025-05-19', year: 2025, feast_name: "Pentecost/Apostles' Fast", lection_1: 'Exo 19:1-9; 20:18-21', lection_2: 'Acts 2:1-21', epistle: '1 Cor 12:1-27', gospel: 'John 14:15-17, 25-26; 15:26-16:15' },
    { date: '2025-05-26', year: 2025, feast_name: 'Second Sunday of Apostles', lection_1: 'Joel 2:15-26', lection_2: 'Acts 4:5-22', epistle: '1 Cor 5:6-6:11', gospel: 'Luke 7:31-end' },
    { date: '2025-06-02', year: 2025, feast_name: 'Third Sunday of Apostles', lection_1: 'Deu 1:3-17', lection_2: 'Isa 1:1-9', epistle: '1 Cor 7:1-7', gospel: 'Luke 10:23-end' },
    { date: '2025-06-09', year: 2025, feast_name: 'Fourth Sunday of Apostles', lection_1: 'Deu 1:16-33', lection_2: 'Isa 1:10-20', epistle: '1 Cor 9:13-end', gospel: 'Luke 6:12-46' },
    { date: '2025-06-16', year: 2025, feast_name: 'Fifth Sunday of Apostles', lection_1: 'Deu 1:33-2:1', lection_2: 'Isa 1:21-end', epistle: '1 Cor 14:1-19', gospel: 'Luke 12:16-34' },
    { date: '2025-06-23', year: 2025, feast_name: 'Sixth Sunday of Apostles', lection_1: 'Deu 4:1-9', lection_2: 'Isa 2:1-21', epistle: '1 Cor 10:14-32', gospel: 'Luke 12:57-13:17' },
    { date: '2025-06-30', year: 2025, feast_name: 'Seventh Sunday of Apostles', lection_1: 'Deu 4:10-24', lection_2: 'Isa 5:8-25', epistle: '1 Cor 15:58-16:all', gospel: 'Luke 13:22-end' },
    { date: '2025-07-07', year: 2025, feast_name: 'First Sunday of Summer', lection_1: '1 Kgs 18:30-39 or Deu 4:25-31', lection_2: 'Acts 5:12-32 or Isa 2:23-3:15', epistle: '2 Cor 1:8-14', gospel: 'Luke 14:1-14' },
    { date: '2025-07-14', year: 2025, feast_name: 'Second Sunday of Summer', lection_1: 'Deu 4:1-40', lection_2: 'Isa 3:16-4:all', epistle: '2 Cor 3:4-end', gospel: 'Luke 15:4-end' },
    { date: '2025-07-21', year: 2025, feast_name: 'Third Sunday of Summer', lection_1: 'Deu 5:1-16', lection_2: 'Isa 5:1-7', epistle: '2 Cor 7:1-11', gospel: 'John 9:1-38' },
    { date: '2025-07-28', year: 2025, feast_name: 'Fourth Sunday of Summer', lection_1: 'Deu 5:16-6:3', lection_2: 'Isa 9:8-end', epistle: '2 Cor 10', gospel: 'Mark 7:1-23' },
    { date: '2025-08-04', year: 2025, feast_name: 'Fifth Sunday of Summer', lection_1: 'Lev 23:9-22', lection_2: 'Isa 28:14-22', epistle: '2 Cor 12:14-13:all', gospel: 'Luke 16:19-17:10' },
    { date: '2025-08-06', year: 2025, feast_name: 'Feast of Transfiguration', lection_1: 'Exo 19:1-9; 20:18-21', lection_2: 'Isa 6', epistle: '1 Tim 1:18-2:all; 3:14-end or Heb 12:18-end', gospel: 'Matt 16:24-17:9' },
    { date: '2025-08-11', year: 2025, feast_name: 'Sixth Sunday of Summer', lection_1: 'Lev 19:1-4; 9-14', lection_2: 'Isa 29:13-end', epistle: '1 Thes 2:1-12', gospel: 'Luke 17:5-19' },
    { date: '2025-08-18', year: 2025, feast_name: 'Seventh Sunday of Summer', lection_1: 'Lev 19:15-18; 20:9-14', lection_2: 'Isa 30:1-14', epistle: '1 Thes 2:14-3:all', gospel: 'Luke 18:2-14' },
    { date: '2025-08-25', year: 2025, feast_name: 'Sunday Entering Fast of Mar Elijah', lection_1: 'Deu 6:20-7:5', lection_2: 'Isa 31', epistle: '2 Thes 1', gospel: 'Luke 18:35-19:10' },
    { date: '2025-09-01', year: 2025, feast_name: 'Second Sunday of Elijah', lection_1: 'Deu 7:7-11', lection_2: 'Isa 30:15-26', epistle: '2 Thes 2:15-3 (all)', gospel: 'Matt 13:1-23' },
    { date: '2025-09-08', year: 2025, feast_name: 'Third Sunday of Elijah', lection_1: 'Deu 7:12-end', lection_2: 'Isa 32:1-33:6', epistle: 'Phil 1:12-25', gospel: 'Matt 13:24-43' },
    { date: '2025-09-13', year: 2025, feast_name: 'Feast of Holy Cross', lection_1: 'Isa 52:13-53:all', lection_2: 'Acts 2:14-36', epistle: '1 Cor 1:18-end', gospel: 'Luke 24:13-35' },
    { date: '2025-09-15', year: 2025, feast_name: 'Fourth Sunday of Elijah/First of Holy Cross', lection_1: 'Deu 8:11-end', lection_2: 'Isa 33:13-end', epistle: 'Phil 1:27-2:11', gospel: 'Matt 4:12-5:16' },
    { date: '2025-09-22', year: 2025, feast_name: 'Fifth Sunday of Elijah/Second of Holy Cross', lection_1: 'Deu 9:1-8', lection_2: 'Isa 25:1-8', epistle: 'Phil 3:1-14', gospel: 'Matt 17:14-end' },
    { date: '2025-09-29', year: 2025, feast_name: 'Sixth Sunday of Elijah/Third of Holy Cross', lection_1: 'Deu 9:13-22', lection_2: 'Isa 26:1-19', epistle: 'Phil 4:4-end', gospel: 'Matt 15:21-38' },
    { date: '2025-10-06', year: 2025, feast_name: 'Seventh Sunday of Elijah/Fourth of Holy Cross', lection_1: 'Deu 10:12-end', lection_2: 'Isa 28:23-29:12', epistle: '1 Cor 14:26-end', gospel: 'Matt 18:1-18' },
    { date: '2025-10-13', year: 2025, feast_name: 'First Sunday of Moses', lection_1: 'Deu 11:1-12', lection_2: 'Isa 40:1-17', epistle: '2 Cor 1:23-2:16', gospel: 'Matt 20:1-16' },
    { date: '2025-10-20', year: 2025, feast_name: 'Second Sunday of Moses', lection_1: 'Deu 11:13-12:1', lection_2: 'Isa 40:18-41:7', epistle: 'Gal 5:16-end', gospel: 'Luke 8:40-end' },
    { date: '2025-10-27', year: 2025, feast_name: 'Third Sunday of Moses', lection_1: 'Deu 12:1-25', lection_2: 'Isa 41:8-20', epistle: 'Gal 6:1-end', gospel: 'John 5:1-18' },
    { date: '2025-11-03', year: 2025, feast_name: 'First Sunday of Hallowing of Church', lection_1: 'Exo 40:17-end', lection_2: 'Isa 6', epistle: '1 Cor 12:28-13:all', gospel: 'Matt 16:13-19; 21:12-13' },
    { date: '2025-11-10', year: 2025, feast_name: 'Second Sunday of Hallowing of Church', lection_1: 'Exo 39:32-40:16', lection_2: '1 Kgs 8:10-28', epistle: 'Heb 8:1-9:4', gospel: 'Matt 12:1-13' },
    { date: '2025-11-17', year: 2025, feast_name: 'Third Sunday of Hallowing of Church', lection_1: 'Num 7:1-10; 9:15-20', lection_2: 'Isa 54:1-15', epistle: 'Heb 9:5-15 or 1 Cor 2:10-3 (all)', gospel: 'John 2:12-22' },
    { date: '2025-11-24', year: 2025, feast_name: 'Fourth Sunday of Hallowing of Church', lection_1: '1 Kgs 6:1-19', lection_2: 'Ezek 43:1-6; 44:1-5', epistle: 'Heb 9:16-end', gospel: 'Matt 22:41-23:22' },
    { date: '2025-12-01', year: 2025, feast_name: 'First Sunday of Annunciation', lection_1: 'Gen 17', lection_2: 'Isa 42:18-43:13', epistle: 'Eph 5:21-6:9', gospel: 'Luke 1:1-25' },
    { date: '2025-12-08', year: 2025, feast_name: 'Second Sunday of Annunciation', lection_1: 'Num 22:9-23:1', lection_2: 'Isa 43:14-44:5', epistle: 'Col 4:2-end', gospel: 'Luke 1:26-56' },
    { date: '2025-12-15', year: 2025, feast_name: 'Third Sunday of Annunciation', lection_1: 'Gen 18:1-19', lection_2: 'Jdg 13:2-24', epistle: 'Eph 3', gospel: 'Luke 1:57-end' },
    { date: '2025-12-22', year: 2025, feast_name: 'Fourth Sunday of Annunciation', lection_1: 'Gen 24:50-end', lection_2: '1 Sam 1:1-18', epistle: 'Eph 5:5-20', gospel: 'Matt 1:18-end' },
    { date: '2025-12-25', year: 2025, feast_name: 'Holy Feast of Nativity', lection_1: 'Isa 7:10-15; 9:1-3,6-7', lection_2: 'Mic 4:1-3; 5:2-4,7-9', epistle: 'Gal 3:15-4:6', gospel: 'Luke 2:1-20' },
    { date: '2025-12-29', year: 2025, feast_name: 'First Sunday After Nativity', lection_1: 'Gen 21:1-21', lection_2: '1 Sam 1:19-end', epistle: 'Gal 4:18-5:1', gospel: 'Matt 2' },
  ];

  const { error } = await supabase
    .from('liturgical_calendar')
    .insert(calendarData);

  if (error) {
    console.error('Error importing liturgical calendar:', error);
    process.exit(1);
  }

  console.log(`✅ Imported ${calendarData.length} liturgical events successfully!`);
}

importCompleteCalendar();
