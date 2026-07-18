CREATE INDEX IF NOT EXISTS hobby_tags_category_idx ON hobby_tags(category_id);
CREATE INDEX IF NOT EXISTS hobby_tags_tag_idx ON hobby_tags(LOWER(tag));
