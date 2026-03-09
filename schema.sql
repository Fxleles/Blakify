-- ============================================================
-- BLAKIFY — Schema SQL para Neon PostgreSQL
-- Execute este arquivo no SQL Editor do neon.tech
-- ============================================================

-- Extensão para UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── USUÁRIOS ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,           -- bcrypt hash
  name        TEXT,
  plan        TEXT DEFAULT 'free',     -- 'free' | 'pro' | 'enterprise'
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── GATEWAYS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gateways (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  auth_type    TEXT NOT NULL,          -- 'header_keys' | 'bearer_token'
  public_key   TEXT,
  secret_key   TEXT,                   -- armazene encriptado em produção
  client_id    TEXT,
  client_secret TEXT,
  api_url      TEXT,
  methods      JSONB DEFAULT '{"pix":true,"cartao":false,"boleto":false}',
  status       BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PRODUTOS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  gateway_id  UUID REFERENCES gateways(id),
  name        TEXT NOT NULL,
  price       NUMERIC(10,2) NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  color       TEXT DEFAULT '#e0173a',
  status      BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PIXELS ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pixels (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  platform   TEXT NOT NULL,           -- 'Meta' | 'Google' | 'TikTok' etc.
  pixel_id   TEXT NOT NULL,
  status     BOOLEAN DEFAULT true,
  global     BOOLEAN DEFAULT false,   -- aplica em todos os produtos
  events     JSONB DEFAULT '{"purchase":true,"allSales":false}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PIXELS POR PRODUTO ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS product_pixels (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  pixel_id   UUID REFERENCES pixels(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, pixel_id)
);

-- ─── WEBHOOKS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS webhooks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  url         TEXT NOT NULL,
  status      BOOLEAN DEFAULT false,
  events      JSONB DEFAULT '{"payment_confirmed":true,"payment_pending":false,"payment_expired":false,"checkout_started":false,"refund":false}',
  total_calls INT DEFAULT 0,
  success_calls INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PEDIDOS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID REFERENCES users(id) ON DELETE SET NULL,
  product_id       UUID REFERENCES products(id) ON DELETE SET NULL,
  gateway_id       UUID REFERENCES gateways(id) ON DELETE SET NULL,
  transaction_id   TEXT,
  customer_name    TEXT,
  customer_email   TEXT,
  customer_phone   TEXT,
  customer_cpf     TEXT,
  amount           NUMERIC(10,2),
  quantity         INT DEFAULT 1,
  status           TEXT DEFAULT 'pending',  -- 'pending' | 'paid' | 'expired' | 'refunded'
  payment_method   TEXT DEFAULT 'pix',
  -- UTM Tracking
  utm_source       TEXT,
  utm_medium       TEXT,
  utm_campaign     TEXT,
  utm_content      TEXT,
  utm_term         TEXT,
  -- Endereço
  address_cep      TEXT,
  address_street   TEXT,
  address_number   TEXT,
  address_district TEXT,
  address_city     TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  paid_at          TIMESTAMPTZ
);

-- ─── ÍNDICES ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_orders_user_id    ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_product_id ON orders(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_status     ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_slug     ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_user_id  ON products(user_id);
