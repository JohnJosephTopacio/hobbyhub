CREATE TABLE IF NOT EXISTS hobby_tags (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tag VARCHAR(30) NOT NULL,
  category_id INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_tags_category FOREIGN KEY(category_id) 
  REFERENCES hobby_categories(id),
  CONSTRAINT unique_tag_in_category UNIQUE(tag, category_id)
);