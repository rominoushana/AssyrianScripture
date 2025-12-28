/*
  # Create Bible Verses and Liturgical Calendar Tables

  ## New Tables
  
  ### `bible_verses`
  - `id` (bigint, primary key) - Auto-incrementing ID
  - `book` (text) - Book name (e.g., "Matthew", "John")
  - `chapter` (smallint) - Chapter number
  - `verse` (smallint) - Verse number
  - `assyrian` (text) - Assyrian text
  - `transliteration` (text) - Transliterated text
  - `english` (text) - English translation
  - `created_at` (timestamptz) - Record creation timestamp
  - Indexes on (book, chapter, verse) for fast lookups
  
  ### `liturgical_calendar`
  - `id` (bigint, primary key) - Auto-incrementing ID
  - `date` (date) - Date of the liturgical event
  - `year` (smallint) - Year for easier filtering
  - `feast_name` (text) - Name of the feast/occasion
  - `lection_1` (text) - First lection reference (e.g., "Num 24:2-9, 15-end")
  - `lection_2` (text) - Second lection reference
  - `epistle` (text) - Epistle reference
  - `gospel` (text) - Gospel reference
  - `created_at` (timestamptz) - Record creation timestamp
  - Index on date for fast lookups
  
  ## Security
  - Enable RLS on both tables
  - Allow public read access (authenticated and anonymous users can read)
  - Only authenticated users with admin role can write (for future admin panel)
*/

-- Create bible_verses table
CREATE TABLE IF NOT EXISTS bible_verses (
  id bigserial PRIMARY KEY,
  book text NOT NULL,
  chapter smallint NOT NULL,
  verse smallint NOT NULL,
  assyrian text NOT NULL DEFAULT '',
  transliteration text NOT NULL DEFAULT '',
  english text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create index for fast verse lookups
CREATE INDEX IF NOT EXISTS idx_bible_verses_book_chapter_verse 
  ON bible_verses(book, chapter, verse);

-- Create index for book lookups
CREATE INDEX IF NOT EXISTS idx_bible_verses_book 
  ON bible_verses(book);

-- Enable RLS
ALTER TABLE bible_verses ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read bible verses
CREATE POLICY "Anyone can read bible verses"
  ON bible_verses
  FOR SELECT
  TO public
  USING (true);

-- Create liturgical_calendar table
CREATE TABLE IF NOT EXISTS liturgical_calendar (
  id bigserial PRIMARY KEY,
  date date NOT NULL,
  year smallint NOT NULL,
  feast_name text NOT NULL,
  lection_1 text DEFAULT '',
  lection_2 text DEFAULT '',
  epistle text DEFAULT '',
  gospel text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create index for fast date lookups
CREATE INDEX IF NOT EXISTS idx_liturgical_calendar_date 
  ON liturgical_calendar(date);

-- Create index for year lookups
CREATE INDEX IF NOT EXISTS idx_liturgical_calendar_year 
  ON liturgical_calendar(year);

-- Enable RLS
ALTER TABLE liturgical_calendar ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read calendar
CREATE POLICY "Anyone can read liturgical calendar"
  ON liturgical_calendar
  FOR SELECT
  TO public
  USING (true);
