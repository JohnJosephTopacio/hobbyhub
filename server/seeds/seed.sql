TRUNCATE TABLE user_tags, profiles, users, hobby_tags, hobby_categories RESTART IDENTITY CASCADE;

INSERT INTO users (username, email, password) VALUES
('DrShephard', 'jackshephard@email.com', '$2b$10$9a8mYapQfnWUtWqExXQ/7OxZ7jQZidmrDpE9FbzHQ0kphv/cHc8HC'),
('Sawyer', 'jamesford@email.com', '$2b$10$9a8mYapQfnWUtWqExXQ/7OxZ7jQZidmrDpE9FbzHQ0kphv/cHc8HC'),
('ManOfFaith', 'johnlocke@email.com', '$2b$10$9a8mYapQfnWUtWqExXQ/7OxZ7jQZidmrDpE9FbzHQ0kphv/cHc8HC'),
('HenryGale', 'benjaminlinus@email.com', '$2b$10$9a8mYapQfnWUtWqExXQ/7OxZ7jQZidmrDpE9FbzHQ0kphv/cHc8HC'),
('MyNameIsSayidJarrah', 'sayidjarrah@email.com', '$2b$10$9a8mYapQfnWUtWqExXQ/7OxZ7jQZidmrDpE9FbzHQ0kphv/cHc8HC');

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
  ('Digital Art', 5),
  ('RPG Games', 4),
  ('MMA', 2),
  ('Football', 2),
  ('Roguelite Video Games', 3);


INSERT INTO user_tags (user_id, tag_id) VALUES
  (2, 1),
  (1, 2),
  (3, 3),
  (3, 4),
  (4, 5),
  (3, 6),
  (1, 7),
  (1, 8),
  (3, 9);
    
