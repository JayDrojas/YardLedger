-- YardLedger Seed Data
-- Run with: docker exec -i $(docker ps --filter "name=supabase_db_YardLedger" -q) psql -U postgres -d postgres < supabase/seed.sql

-- ============================================================
-- Metal Categories
-- ============================================================
INSERT INTO public.metal_categories (name, display_order) VALUES
  ('Copper',          1),
  ('Aluminum',        2),
  ('Stainless Steel', 3),
  ('Steel',           4),
  ('Brass',           5),
  ('Lead',            6),
  ('Zinc',            7),
  ('Nickel',          8),
  ('Titanium',        9),
  ('Motors & Mixed', 10)
ON CONFLICT (name) DO UPDATE SET display_order = EXCLUDED.display_order;

-- ============================================================
-- COPPER grades
-- ============================================================
INSERT INTO public.metals (name, price_per_lb, category_id) VALUES
  ('Bare Bright',           3.80, (SELECT id FROM public.metal_categories WHERE name = 'Copper')),
  ('#1 Copper',             3.50, (SELECT id FROM public.metal_categories WHERE name = 'Copper')),
  ('#2 Copper',             3.20, (SELECT id FROM public.metal_categories WHERE name = 'Copper')),
  ('Copper Tubing / Pipe',  3.30, (SELECT id FROM public.metal_categories WHERE name = 'Copper')),
  ('Insulated Copper Wire', 2.00, (SELECT id FROM public.metal_categories WHERE name = 'Copper')),
  ('Romex Wire',            2.10, (SELECT id FROM public.metal_categories WHERE name = 'Copper')),
  ('THHN Wire',             2.20, (SELECT id FROM public.metal_categories WHERE name = 'Copper')),
  ('Low-Grade Insulated',   1.20, (SELECT id FROM public.metal_categories WHERE name = 'Copper')),
  ('Burnt Copper Wire',     2.80, (SELECT id FROM public.metal_categories WHERE name = 'Copper'))
ON CONFLICT (name) DO UPDATE SET
  price_per_lb = EXCLUDED.price_per_lb,
  category_id = EXCLUDED.category_id,
  is_active = true;

-- ============================================================
-- ALUMINUM grades
-- ============================================================
INSERT INTO public.metals (name, price_per_lb, category_id) VALUES
  ('Aluminum Cans (UBC)',    0.45, (SELECT id FROM public.metal_categories WHERE name = 'Aluminum')),
  ('Aluminum Wheels / Rims', 0.60, (SELECT id FROM public.metal_categories WHERE name = 'Aluminum')),
  ('Clean Aluminum Sheet',   0.50, (SELECT id FROM public.metal_categories WHERE name = 'Aluminum')),
  ('Aluminum Extrusions',    0.55, (SELECT id FROM public.metal_categories WHERE name = 'Aluminum')),
  ('Painted Aluminum Ext.',  0.45, (SELECT id FROM public.metal_categories WHERE name = 'Aluminum')),
  ('Cast Aluminum',          0.40, (SELECT id FROM public.metal_categories WHERE name = 'Aluminum')),
  ('Aluminum Siding',        0.42, (SELECT id FROM public.metal_categories WHERE name = 'Aluminum')),
  ('Aluminum Radiators',     0.35, (SELECT id FROM public.metal_categories WHERE name = 'Aluminum')),
  ('Aluminum Breakage',      0.25, (SELECT id FROM public.metal_categories WHERE name = 'Aluminum')),
  ('Dirty Aluminum',         0.15, (SELECT id FROM public.metal_categories WHERE name = 'Aluminum'))
ON CONFLICT (name) DO UPDATE SET
  price_per_lb = EXCLUDED.price_per_lb,
  category_id = EXCLUDED.category_id,
  is_active = true;

-- ============================================================
-- STAINLESS STEEL grades
-- ============================================================
INSERT INTO public.metals (name, price_per_lb, category_id) VALUES
  ('304 Stainless Steel',   0.45, (SELECT id FROM public.metal_categories WHERE name = 'Stainless Steel')),
  ('316 Stainless Steel',   0.65, (SELECT id FROM public.metal_categories WHERE name = 'Stainless Steel')),
  ('Mixed Stainless Steel', 0.35, (SELECT id FROM public.metal_categories WHERE name = 'Stainless Steel')),
  ('Stainless Turnings',    0.25, (SELECT id FROM public.metal_categories WHERE name = 'Stainless Steel'))
ON CONFLICT (name) DO UPDATE SET
  price_per_lb = EXCLUDED.price_per_lb,
  category_id = EXCLUDED.category_id,
  is_active = true;

-- ============================================================
-- STEEL (Ferrous) grades
-- ============================================================
INSERT INTO public.metals (name, price_per_lb, category_id) VALUES
  ('Light Iron / Sheet Iron', 0.05, (SELECT id FROM public.metal_categories WHERE name = 'Steel')),
  ('HMS #1',                  0.08, (SELECT id FROM public.metal_categories WHERE name = 'Steel')),
  ('HMS #2',                  0.06, (SELECT id FROM public.metal_categories WHERE name = 'Steel')),
  ('Prepared Steel',          0.09, (SELECT id FROM public.metal_categories WHERE name = 'Steel')),
  ('Unprepared Steel',        0.05, (SELECT id FROM public.metal_categories WHERE name = 'Steel')),
  ('Rebar',                   0.07, (SELECT id FROM public.metal_categories WHERE name = 'Steel')),
  ('Auto Bodies',             0.04, (SELECT id FROM public.metal_categories WHERE name = 'Steel')),
  ('Appliance Steel',         0.05, (SELECT id FROM public.metal_categories WHERE name = 'Steel')),
  ('Cast Iron',               0.06, (SELECT id FROM public.metal_categories WHERE name = 'Steel')),
  ('Steel Turnings',          0.03, (SELECT id FROM public.metal_categories WHERE name = 'Steel'))
ON CONFLICT (name) DO UPDATE SET
  price_per_lb = EXCLUDED.price_per_lb,
  category_id = EXCLUDED.category_id,
  is_active = true;

-- ============================================================
-- BRASS grades
-- ============================================================
INSERT INTO public.metals (name, price_per_lb, category_id) VALUES
  ('Yellow Brass',             1.75, (SELECT id FROM public.metal_categories WHERE name = 'Brass')),
  ('Red Brass',                2.10, (SELECT id FROM public.metal_categories WHERE name = 'Brass')),
  ('Mixed Brass',              1.50, (SELECT id FROM public.metal_categories WHERE name = 'Brass')),
  ('Brass Shell Casings',      1.60, (SELECT id FROM public.metal_categories WHERE name = 'Brass')),
  ('Brass Radiators',          1.30, (SELECT id FROM public.metal_categories WHERE name = 'Brass')),
  ('Brass Faucets / Plumbing', 1.40, (SELECT id FROM public.metal_categories WHERE name = 'Brass'))
ON CONFLICT (name) DO UPDATE SET
  price_per_lb = EXCLUDED.price_per_lb,
  category_id = EXCLUDED.category_id,
  is_active = true;

-- ============================================================
-- LEAD grades
-- ============================================================
INSERT INTO public.metals (name, price_per_lb, category_id) VALUES
  ('Lead Acid Batteries', 0.20, (SELECT id FROM public.metal_categories WHERE name = 'Lead')),
  ('Soft Lead',           0.50, (SELECT id FROM public.metal_categories WHERE name = 'Lead')),
  ('Wheel Weights',       0.25, (SELECT id FROM public.metal_categories WHERE name = 'Lead')),
  ('Roofing Lead',        0.45, (SELECT id FROM public.metal_categories WHERE name = 'Lead')),
  ('Lead Pipe',           0.40, (SELECT id FROM public.metal_categories WHERE name = 'Lead'))
ON CONFLICT (name) DO UPDATE SET
  price_per_lb = EXCLUDED.price_per_lb,
  category_id = EXCLUDED.category_id,
  is_active = true;

-- ============================================================
-- ZINC grades
-- ============================================================
INSERT INTO public.metals (name, price_per_lb, category_id) VALUES
  ('Die-Cast Zinc', 0.55, (SELECT id FROM public.metal_categories WHERE name = 'Zinc')),
  ('Zinc Sheet',    0.50, (SELECT id FROM public.metal_categories WHERE name = 'Zinc'))
ON CONFLICT (name) DO UPDATE SET
  price_per_lb = EXCLUDED.price_per_lb,
  category_id = EXCLUDED.category_id,
  is_active = true;

-- ============================================================
-- NICKEL grades
-- ============================================================
INSERT INTO public.metals (name, price_per_lb, category_id) VALUES
  ('High-Nickel Alloys', 3.00, (SELECT id FROM public.metal_categories WHERE name = 'Nickel')),
  ('Monel Scrap',        4.50, (SELECT id FROM public.metal_categories WHERE name = 'Nickel'))
ON CONFLICT (name) DO UPDATE SET
  price_per_lb = EXCLUDED.price_per_lb,
  category_id = EXCLUDED.category_id,
  is_active = true;

-- ============================================================
-- TITANIUM grades
-- ============================================================
INSERT INTO public.metals (name, price_per_lb, category_id) VALUES
  ('Titanium Solids',   2.00, (SELECT id FROM public.metal_categories WHERE name = 'Titanium')),
  ('Titanium Turnings', 1.50, (SELECT id FROM public.metal_categories WHERE name = 'Titanium'))
ON CONFLICT (name) DO UPDATE SET
  price_per_lb = EXCLUDED.price_per_lb,
  category_id = EXCLUDED.category_id,
  is_active = true;

-- ============================================================
-- MOTORS & MIXED items
-- ============================================================
INSERT INTO public.metals (name, price_per_lb, category_id) VALUES
  ('Electric Motors',   0.15, (SELECT id FROM public.metal_categories WHERE name = 'Motors & Mixed')),
  ('Sealed Units (AC)', 0.12, (SELECT id FROM public.metal_categories WHERE name = 'Motors & Mixed')),
  ('Ballasts',          0.08, (SELECT id FROM public.metal_categories WHERE name = 'Motors & Mixed')),
  ('Transformers',      0.10, (SELECT id FROM public.metal_categories WHERE name = 'Motors & Mixed'))
ON CONFLICT (name) DO UPDATE SET
  price_per_lb = EXCLUDED.price_per_lb,
  category_id = EXCLUDED.category_id,
  is_active = true;
