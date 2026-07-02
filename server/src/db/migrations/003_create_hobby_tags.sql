CREATE TABLE IF NOT EXISTS hobby_tags (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tag VARCHAR(30) NOT NULL,
  category_id INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT fk_hobby_tags_category FOREIGN KEY(category_id) 
  REFERENCES hobby_categories(id) ON DELETE RESTRICT,
  CONSTRAINT unique_tag_in_category UNIQUE(tag, category_id)
);