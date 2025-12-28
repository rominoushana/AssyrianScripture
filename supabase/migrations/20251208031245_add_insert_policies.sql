/*
  # Add Insert Policies for Initial Data Import

  ## Changes
  - Add INSERT policies to allow initial data population
  - These can be removed later if needed
  
  ## Security
  - Temporarily allow public inserts for data population
  - Can be restricted after initial import
*/

-- Allow public inserts for bible_verses (for initial import)
CREATE POLICY "Allow public inserts for bible verses"
  ON bible_verses
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow public inserts for liturgical_calendar (for initial import)
CREATE POLICY "Allow public inserts for liturgical calendar"
  ON liturgical_calendar
  FOR INSERT
  TO public
  WITH CHECK (true);
