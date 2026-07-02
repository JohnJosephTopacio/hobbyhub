CREATE INDEX IF NOT EXISTS category_id_hobby_tags ON hobby_tags (category_id);
CREATE INDEX IF NOT EXISTS tag_hobby_tags ON hobby_tags(LOWER(tag));