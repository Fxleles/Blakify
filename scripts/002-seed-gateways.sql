-- Seed dos gateways padrão do Blakify
INSERT INTO gateways (name, status, methods, auth_type, field_defs, fields, docs_url, note) VALUES
(
  'Masterpag',
  true,
  '{"pix": true, "cartao": false, "boleto": false}'::jsonb,
  'header_keys',
  '[{"key":"pk","label":"x-public-key","placeholder":"pk_live_..."},{"key":"sk","label":"x-secret-key","placeholder":"sk_live_..."},{"key":"apiUrl","label":"API URL","placeholder":"https://...","full":true}]'::jsonb,
  '{"pk":"","sk":"","apiUrl":""}'::jsonb,
  'https://masterpag.com.br',
  null
),
(
  'FreePay Brasil',
  false,
  '{"pix": true, "cartao": true, "boleto": false}'::jsonb,
  'bearer_token',
  '[{"key":"client_id","label":"Client ID","placeholder":"Seu Client ID da FreePay"},{"key":"client_secret","label":"Client Secret","placeholder":"Seu Client Secret da FreePay"},{"key":"apiUrl","label":"API URL","placeholder":"https://api.freepaybrasil.com.br/v1","full":true}]'::jsonb,
  '{"client_id":"","client_secret":"","apiUrl":"https://api.freepaybrasil.com.br/v1"}'::jsonb,
  'https://freepaybrasil.readme.io/reference/introdução',
  'Autenticação Bearer Token — token gerado automaticamente via Client ID + Client Secret.'
),
(
  'Mercado Pago',
  false,
  '{"pix": true, "cartao": true, "boleto": true}'::jsonb,
  'bearer_token',
  '[{"key":"client_id","label":"Access Token","placeholder":"APP_USR-..."},{"key":"client_secret","label":"Public Key","placeholder":"APP_USR-..."},{"key":"apiUrl","label":"API URL","placeholder":"https://api.mercadopago.com","full":true}]'::jsonb,
  '{"client_id":"","client_secret":"","apiUrl":"https://api.mercadopago.com"}'::jsonb,
  'https://www.mercadopago.com.br/developers',
  null
),
(
  'PagHiper',
  false,
  '{"pix": true, "cartao": false, "boleto": true}'::jsonb,
  'header_keys',
  '[{"key":"pk","label":"API Key","placeholder":"apk_..."},{"key":"sk","label":"API Token","placeholder":"Token de acesso"},{"key":"apiUrl","label":"API URL","placeholder":"https://api.paghiper.com","full":true}]'::jsonb,
  '{"pk":"","sk":"","apiUrl":"https://api.paghiper.com"}'::jsonb,
  'https://dev.paghiper.com',
  null
),
(
  'PagSeguro',
  false,
  '{"pix": true, "cartao": true, "boleto": true}'::jsonb,
  'bearer_token',
  '[{"key":"client_id","label":"Client ID","placeholder":"Seu Client ID"},{"key":"client_secret","label":"Client Secret","placeholder":"Seu Client Secret"},{"key":"apiUrl","label":"API URL","placeholder":"https://api.pagseguro.com","full":true}]'::jsonb,
  '{"client_id":"","client_secret":"","apiUrl":"https://api.pagseguro.com"}'::jsonb,
  'https://dev.pagseguro.uol.com.br',
  null
)
ON CONFLICT DO NOTHING;
