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
  ('Book Reading', 13),
  ('Basketball', 10),
  ('Programming', 16),
  ('Hiking', 11),
  ('Digital Art', 9);

INSERT INTO user_tags (user_id, tag_id) VALUES
  (20, 1),
  (22, 2),
  (23, 3),
  (20, 4),
  (22, 5);
    
