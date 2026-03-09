-- Blakify Database Schema
-- Migration 001: Create all tables

-- Produtos
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  status BOOLEAN DEFAULT true,
  color VARCHAR(20) DEFAULT '#6366f1',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pedidos/Transações
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_code VARCHAR(50) UNIQUE NOT NULL,
  product_id INTEGER REFERENCES products(id),
  product_name VARCHAR(255),
  quantity INTEGER DEFAULT 1,
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, paid, expired, refunded
  gateway VARCHAR(100),
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(50),
  customer_cpf VARCHAR(20),
  transaction_id VARCHAR(255),
  pix_code TEXT,
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  paid_at TIMESTAMP
);

-- Gateways de pagamento
CREATE TABLE IF NOT EXISTS gateways (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  status BOOLEAN DEFAULT false,
  auth_type VARCHAR(50), -- header_keys, bearer_token
  methods JSONB DEFAULT '{"pix": false, "cartao": false, "boleto": false}',
  fields JSONB DEFAULT '{}',
  field_defs JSONB DEFAULT '[]',
  docs_url VARCHAR(500),
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pixels de rastreamento
CREATE TABLE IF NOT EXISTS pixels (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  platform VARCHAR(50) NOT NULL, -- Meta, Google, TikTok, etc
  pixel_id VARCHAR(255) NOT NULL,
  status BOOLEAN DEFAULT true,
  is_global BOOLEAN DEFAULT false,
  events JSONB DEFAULT '{"purchase": true, "allSales": false}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Webhooks
CREATE TABLE IF NOT EXISTS webhooks (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  status BOOLEAN DEFAULT true,
  attempts INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  events JSONB DEFAULT '{"payment_confirmed": true, "payment_pending": false, "payment_expired": false, "checkout_started": false, "refund": false}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Logs de webhook
CREATE TABLE IF NOT EXISTS webhook_logs (
  id SERIAL PRIMARY KEY,
  webhook_id INTEGER REFERENCES webhooks(id),
  order_id INTEGER REFERENCES orders(id),
  event_type VARCHAR(50),
  request_body JSONB,
  response_status INTEGER,
  response_body TEXT,
  success BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Estatísticas diárias (para dashboard)
CREATE TABLE IF NOT EXISTS daily_stats (
  id SERIAL PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  visits INTEGER DEFAULT 0,
  leads INTEGER DEFAULT 0,
  orders_count INTEGER DEFAULT 0,
  revenue DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- UTM Analytics
CREATE TABLE IF NOT EXISTS utm_stats (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  source VARCHAR(100),
  medium VARCHAR(100),
  campaign VARCHAR(255),
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  revenue DECIMAL(12, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(date, source, medium, campaign)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats(date);
CREATE INDEX IF NOT EXISTS idx_utm_stats_date ON utm_stats(date);
