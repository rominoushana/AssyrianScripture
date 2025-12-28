import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface BibleVerse {
  id: number;
  book: string;
  chapter: number;
  verse: number;
  assyrian: string;
  transliteration: string;
  english: string;
}

export interface LiturgicalEvent {
  id: number;
  date: string;
  year: number;
  feast_name: string;
  lection_1: string;
  lection_2: string;
  epistle: string;
  gospel: string;
}

export async function getLiturgicalEvents(year: number): Promise<LiturgicalEvent[]> {
  const { data, error } = await supabase
    .from('liturgical_calendar')
    .select('*')
    .eq('year', year)
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching liturgical events:', error);
    throw error;
  }

  return data || [];
}

export async function getBibleVerses(book: string, chapter: number, startVerse?: number, endVerse?: number): Promise<BibleVerse[]> {
  let query = supabase
    .from('bible_verses')
    .select('*')
    .eq('book', book)
    .eq('chapter', chapter)
    .order('verse', { ascending: true });

  if (startVerse !== undefined) {
    query = query.gte('verse', startVerse);
  }

  if (endVerse !== undefined) {
    query = query.lte('verse', endVerse);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching bible verses:', error);
    throw error;
  }

  return data || [];
}

const bookAbbreviations: { [key: string]: string } = {
  'Mt': 'Matthew',
  'Matt': 'Matthew',
  'Mk': 'Mark',
  'Mark': 'Mark',
  'Lk': 'Luke',
  'Luke': 'Luke',
  'Jn': 'John',
  'John': 'John',
  'Gen': 'Genesis',
  'Genesis': 'Genesis',
  'Ex': 'Exodus',
  'Exo': 'Exodus',
  'Exodus': 'Exodus',
  'Lev': 'Leviticus',
  'Leviticus': 'Leviticus',
  'Num': 'Numbers',
  'Numbers': 'Numbers',
  'Deu': 'Deuteronomy',
  'Deut': 'Deuteronomy',
  'Deuteronomy': 'Deuteronomy',
  'Jos': 'Joshua',
  'Josh': 'Joshua',
  'Joshua': 'Joshua',
  'Jdg': 'Judges',
  'Judg': 'Judges',
  'Judges': 'Judges',
  '1Sam': '1 Samuel',
  '2Sam': '2 Samuel',
  '1Kgs': '1 Kings',
  '2Kgs': '2 Kings',
  'Isa': 'Isaiah',
  'Isaiah': 'Isaiah',
  'Jer': 'Jeremiah',
  'Jeremiah': 'Jeremiah',
  'Ezek': 'Ezekiel',
  'Ezekiel': 'Ezekiel',
  'Dan': 'Daniel',
  'Daniel': 'Daniel',
  'Joel': 'Joel',
  'Amo': 'Amos',
  'Amos': 'Amos',
  'Jon': 'Jonah',
  'Jonah': 'Jonah',
  'Mic': 'Micah',
  'Micah': 'Micah',
  'Hab': 'Habakkuk',
  'Habakkuk': 'Habakkuk',
  'Zech': 'Zechariah',
  'Zechariah': 'Zechariah',
  'Rom': 'Romans',
  'Romans': 'Romans',
  '1Cor': '1 Corinthians',
  '2Cor': '2 Corinthians',
  'Gal': 'Galatians',
  'Galatians': 'Galatians',
  'Eph': 'Ephesians',
  'Ephesians': 'Ephesians',
  'Phil': 'Philippians',
  'Philippians': 'Philippians',
  'Col': 'Colossians',
  'Colossians': 'Colossians',
  '1Thes': '1 Thessalonians',
  '1Thess': '1 Thessalonians',
  '2Thes': '2 Thessalonians',
  '2Thess': '2 Thessalonians',
  '1Tim': '1 Timothy',
  '2Tim': '2 Timothy',
  'Tit': 'Titus',
  'Titus': 'Titus',
  'Heb': 'Hebrews',
  'Hebrews': 'Hebrews',
};

export function parseReference(reference: string): { book: string; chapter: number; startVerse?: number; endVerse?: number } | null {
  if (!reference || reference.trim() === '') return null;

  // Handle multiple references separated by semicolon - just take the first one for now
  const firstRef = reference.split(';')[0].trim();

  // Match patterns like "Mt 3", "Luke 4:14-30", "John 1:1-28", "Matt 20:1-16"
  const match = firstRef.match(/^(\d?\s*\w+)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/);

  if (!match) return null;

  const [, bookAbbr, chapterStr, startVerseStr, endVerseStr] = match;

  // Normalize book name
  const bookKey = bookAbbr.trim().replace(/\s+/g, '');
  const fullBookName = bookAbbreviations[bookKey];

  if (!fullBookName) {
    console.warn(`Unknown book abbreviation: ${bookAbbr}`);
    return null;
  }

  return {
    book: fullBookName,
    chapter: parseInt(chapterStr),
    startVerse: startVerseStr ? parseInt(startVerseStr) : undefined,
    endVerse: endVerseStr ? parseInt(endVerseStr) : undefined
  };
}
