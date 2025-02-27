-- Create a tsvector column for full-text search
ALTER TABLE projects ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create a function to update the search_vector column
CREATE OR REPLACE FUNCTION projects_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector = 
    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.summary, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.long_description, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to update the search_vector column
DROP TRIGGER IF EXISTS projects_search_vector_update ON projects;
CREATE TRIGGER projects_search_vector_update
BEFORE INSERT OR UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION projects_search_vector_update();

-- Update existing records
UPDATE projects SET search_vector = 
  setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
  setweight(to_tsvector('english', COALESCE(summary, '')), 'B') ||
  setweight(to_tsvector('english', COALESCE(long_description, '')), 'C');

-- Create a GIN index for the search_vector column
CREATE INDEX IF NOT EXISTS projects_search_vector_idx ON projects USING GIN(search_vector); 