-- Add gross/tare weight tracking to line items
-- When tare mode is used, gross_weight and tare_weight are stored;
-- the existing `weight` column holds the net weight (gross - tare).
alter table public.line_items
  add column gross_weight numeric(10,2),
  add column tare_weight numeric(10,2);
