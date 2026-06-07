-- Sample catalog data for local development and initial deploy.

insert into public.categories (name, slug) values
  ('Electronics', 'electronics'),
  ('Home & Kitchen', 'home-kitchen'),
  ('Books', 'books'),
  ('Fashion', 'fashion');

insert into public.products (category_id, name, slug, description, price_cents, image_url, stock)
select c.id, p.name, p.slug, p.description, p.price_cents, p.image_url, p.stock
from (
  values
    ('electronics', 'Wireless Noise-Cancelling Headphones', 'wireless-noise-cancelling-headphones', 'Over-ear Bluetooth headphones with 30-hour battery life and active noise cancellation.', 14999, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', 42),
    ('electronics', 'Smart Fitness Watch', 'smart-fitness-watch', 'Tracks heart rate, sleep, and workouts with a 7-day battery and AMOLED display.', 8999, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', 75),
    ('electronics', 'Portable Bluetooth Speaker', 'portable-bluetooth-speaker', 'Compact waterproof speaker with rich bass and 12-hour playtime.', 4999, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600', 120),
    ('home-kitchen', 'Stainless Steel French Press', 'stainless-steel-french-press', '34oz double-walled French press that keeps coffee hot for hours.', 3499, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600', 60),
    ('home-kitchen', 'Non-Stick Ceramic Cookware Set', 'non-stick-ceramic-cookware-set', '10-piece cookware set with PFOA-free ceramic coating, oven safe to 500°F.', 12999, 'https://images.unsplash.com/photo-1584990347449-a5d9f800a783?w=600', 30),
    ('home-kitchen', 'Robot Vacuum Cleaner', 'robot-vacuum-cleaner', 'App-controlled robot vacuum with smart mapping and auto-recharge.', 19999, 'https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?w=600', 18),
    ('books', 'The Pragmatic Programmer', 'the-pragmatic-programmer', 'A classic guide to becoming a more effective and adaptable software developer.', 3999, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600', 200),
    ('books', 'Atomic Habits', 'atomic-habits', 'A practical guide to building good habits and breaking bad ones.', 2799, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600', 250),
    ('fashion', 'Classic Leather Backpack', 'classic-leather-backpack', 'Handcrafted full-grain leather backpack with laptop compartment.', 8999, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', 45),
    ('fashion', 'Minimalist Analog Watch', 'minimalist-analog-watch', 'Slim stainless steel watch with sapphire crystal and leather strap.', 6499, 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600', 55)
) as p(category_slug, name, slug, description, price_cents, image_url, stock)
join public.categories c on c.slug = p.category_slug;
