INSERT INTO hobby_categories (category, slug) VALUES
  ('CREATIVES AND ARTS', 'creatives-and-arts'),
  ('SPORTS AND FITNESS', 'sports-and-fitness'),
  ('OUTDOOR AND NATURE', 'outdoor-and-nature'),
  ('GAMES', 'games'),
  ('MEDIA AND LITERATURE', 'media-and-literature'),
  ('COLLECTIBLES', 'collectibles'),
  ('FOOD AND BEVERAGES', 'food-and-beverages'),
  ('SCIENCE AND TECH', 'science-and-tech');

INSERT INTO hobby_tags (tag, category_id) VALUES 
  ('Book Reading', 5),
  ('Basketball', 2),
  ('Programming', 8),
  ('Hiking', 3),
  ('Digital Art', 1);

INSERT INTO user_tags (user_id, tag_id) VALUES
  (20, 2),
  (22, 4),
  (23, 3),
  (20, 1),
  (22, 5);
    
