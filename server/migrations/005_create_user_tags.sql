CREATE TABLE IF NOT EXISTS user_tags (
  id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INT NOT NULL,
  tag_id INT NOT NULL, 
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_user_tags_user_id FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_tags_tag_id FOREIGN KEY(tag_id) REFERENCES hobby_tags(id) ON DELETE RESTRICT,
  CONSTRAINT unique_user_to_tag UNIQUE(user_id, tag_id)
);

