CREATE INDEX IF NOT EXISTS user_tags_user_id_idx ON user_tags(user_id);
CREATE INDEX IF NOT EXISTS user_tags_tag_id_idx ON user_tags(tag_id);