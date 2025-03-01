-- 1) Create a tsvector column for full-text search on alternatives
ALTER TABLE alternatives ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- 2) Create a function to update the search_vector column
CREATE OR REPLACE FUNCTION alternatives_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector = 
    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.summary, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'C');
    
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3) Create a trigger to invoke that function before insert/update
DROP TRIGGER IF EXISTS alternatives_search_vector_update ON alternatives;
CREATE TRIGGER alternatives_search_vector_update
BEFORE INSERT OR UPDATE ON alternatives
FOR EACH ROW
EXECUTE FUNCTION alternatives_search_vector_update();

-- 4) Update existing records to set search_vector
UPDATE alternatives
SET search_vector =
  setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(summary, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(description, '')), 'C');

-- 5) Create a GIN index for search_vector
CREATE INDEX IF NOT EXISTS alternatives_search_vector_idx
  ON alternatives USING GIN(search_vector);
