"use client";

import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// ─── ICONS ──────────────────────────────────────────────────────────────────
const Ic = ({ d, size = 16, stroke = "currentColor", fill = "none", sw = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const I = {
  dash: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  orders: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  links: "M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71 M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71",
  gw: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
  pixel: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  wh: "M4 14a1 1 0 01-.78-1.63l9.9-10.2a.5.5 0 01.86.46l-1.92 6.02A1 1 0 0013 10h7a1 1 0 01.78 1.63l-9.9 10.2a.5.5 0 01-.86-.46l1.92-6.02A1 1 0 0011 14H4z",
  settings: "M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  plus: "M12 5v14M5 12h14",
  copy: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  check: "M20 6L9 17l-5-5",
  close: "M18 6L6 18M6 6l12 12",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z",
  eyeOff: "M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94 M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24 M1 1l22 22",
  key: "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4",
  search: "M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35",
  bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",
  chart: "M18 20V10M12 20V4M6 20v-6",
  funnel: "M22 3H2l8 9.46V19l4 2V12.46L22 3z",
  user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  lock: "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4",
  cc: "M1 4h22v16H1zM1 10h22",
  pix: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  boleto: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  chevDown: "M6 9l6 6 6-6",
  chevRight: "M9 18l6-6-6-6",
  db: "M12 2C6.48 2 2 4.69 2 8v8c0 3.31 4.48 6 10 6s10-2.69 10-6V8c0-3.31-4.48-6-10-6z M2 12c0 3.31 4.48 6 10 6s10-2.69 10-6 M2 8c0 3.31 4.48 6 10 6s10-2.69 10-6",
  deploy: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8",
  refresh: "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15",
};

// ─── SOCIAL ICONS (SVG inline) ────────────────────────────────────────────
const SocialIcon = ({ platform, size = 20 }) => {
  const icons = {
    "Meta": (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" fill="#E1306C"/>
      </svg>
    ),
    "Google": (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
    "TikTok": (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.72a8.18 8.18 0 004.78 1.52V6.78a4.85 4.85 0 01-1.01-.09z" fill="#fff"/>
      </svg>
    ),
    "Kwai": (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#FF6900"/>
        <path d="M7 6v12l5-4 5 4V6z" fill="white"/>
      </svg>
    ),
    "Pinterest": (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" fill="#E60023"/>
      </svg>
    ),
    "Taboola": (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#0F68FF"/>
        <text x="5" y="17" fontSize="12" fontWeight="bold" fill="white">T</text>
      </svg>
    ),
    "Custom": (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="rgba(240,240,248,0.4)" strokeWidth="1.5">
        <path d="M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    ),
  };
  return icons[platform] || icons["Custom"];
};

// ─── DATA ───────────────────────────────────────────────────────────────────
const salesData = [
  { day: "01/03", v: 320, l: 180 }, { day: "02/03", v: 480, l: 240 },
  { day: "03/03", v: 290, l: 145 }, { day: "04/03", v: 610, l: 310 },
  { day: "05/03", v: 520, l: 260 }, { day: "06/03", v: 780, l: 390 },
  { day: "07/03", v: 930, l: 460 }, { day: "08/03", v: 870, l: 430 },
  { day: "09/03", v: 1020, l: 510 },
];

const funnelData = [
  { name: "Visitantes", value: 1000, pct: 100 },
  { name: "Dados pessoais", value: 740, pct: 74 },
  { name: "Entrega", value: 580, pct: 58 },
  { name: "Pagamento", value: 380, pct: 38 },
  { name: "Confirmados", value: 280, pct: 28 },
];

const utmData = [
  { source: "Instagram", medium: "ads", clicks: 450, conv: 82, revenue: "R$ 3.280", color: "#E1306C" },
  { source: "Google", medium: "cpc", clicks: 320, conv: 64, revenue: "R$ 2.560", color: "#4285F4" },
  { source: "Facebook", medium: "ads", clicks: 280, conv: 51, revenue: "R$ 2.040", color: "#1877F2" },
  { source: "TikTok", medium: "organic", clicks: 190, conv: 28, revenue: "R$ 1.120", color: "#fff" },
  { source: "WhatsApp", medium: "direct", clicks: 120, conv: 44, revenue: "R$ 1.760", color: "#25D366" },
];

const mockOrders = [
  { id: "#FP-10291", produto: "Kit Premium 3x", valor: "R$ 119,70", status: "pago", gateway: "Masterpag", data: "09/03 14:32", cliente: "Maria Silva" },
  { id: "#FP-10290", produto: "Produto Único", valor: "R$ 39,90", status: "pago", gateway: "Masterpag", data: "09/03 13:18", cliente: "João Santos" },
  { id: "#FP-10289", produto: "Kit 2x", valor: "R$ 79,80", status: "aguardando", gateway: "Masterpag", data: "09/03 12:55", cliente: "Ana Pereira" },
  { id: "#FP-10288", produto: "Kit Premium 3x", valor: "R$ 119,70", status: "pago", gateway: "Masterpag", data: "09/03 11:40", cliente: "Carlos Lima" },
  { id: "#FP-10287", produto: "Produto Único", valor: "R$ 39,90", status: "expirado", gateway: "Masterpag", data: "09/03 10:22", cliente: "Fernanda Costa" },
];

const initGateways = [
  {
    id: 1, name: "Masterpag", status: true,
    methods: { pix: true, cartao: false, boleto: false },
    authType: "header_keys",
    fieldDefs: [
      { key: "pk", label: "x-public-key", placeholder: "pk_live_..." },
      { key: "sk", label: "x-secret-key", placeholder: "sk_live_..." },
      { key: "apiUrl", label: "API URL", placeholder: "https://...", full: true },
    ],
    fields: {
      pk: "pk_live_FmYLBVwrssF7SnbRpJlavOQsh94A6iJk",
      sk: "sk_live_ssYibIsx5sRjwWSXdXzZFNfHNU3pkB9BH0IuzAoTmapSEkjE",
      apiUrl: "https://dcnmsoaogkbgkbwpldrp.supabase.co/functions/v1/pix-receive",
    },
    docs: "https://masterpag.com.br",
  },
  {
    id: 2, name: "FreePay Brasil", status: false,
    methods: { pix: true, cartao: true, boleto: false },
    authType: "bearer_token",
    note: "Autenticação Bearer Token — token gerado automaticamente via Client ID + Client Secret.",
    fieldDefs: [
      { key: "client_id", label: "Client ID", placeholder: "Seu Client ID da FreePay" },
      { key: "client_secret", label: "Client Secret", placeholder: "Seu Client Secret da FreePay" },
      { key: "apiUrl", label: "API URL", placeholder: "https://api.freepaybrasil.com.br/v1", full: true },
    ],
    fields: { client_id: "", client_secret: "", apiUrl: "https://api.freepaybrasil.com.br/v1" },
    docs: "https://freepaybrasil.readme.io/reference/introdução",
  },
  {
    id: 3, name: "Mercado Pago", status: false,
    methods: { pix: true, cartao: true, boleto: true },
    authType: "bearer_token",
    fieldDefs: [
      { key: "client_id", label: "Access Token", placeholder: "APP_USR-..." },
      { key: "client_secret", label: "Public Key", placeholder: "APP_USR-..." },
      { key: "apiUrl", label: "API URL", placeholder: "https://api.mercadopago.com", full: true },
    ],
    fields: { client_id: "", client_secret: "", apiUrl: "https://api.mercadopago.com" },
    docs: "https://www.mercadopago.com.br/developers",
  },
  {
    id: 4, name: "PagHiper", status: false,
    methods: { pix: true, cartao: false, boleto: true },
    authType: "header_keys",
    fieldDefs: [
      { key: "pk", label: "API Key", placeholder: "apk_..." },
      { key: "sk", label: "API Token", placeholder: "Token de acesso" },
      { key: "apiUrl", label: "API URL", placeholder: "https://api.paghiper.com", full: true },
    ],
    fields: { pk: "", sk: "", apiUrl: "https://api.paghiper.com" },
    docs: "https://dev.paghiper.com",
  },
  {
    id: 5, name: "PagSeguro", status: false,
    methods: { pix: true, cartao: true, boleto: true },
    authType: "bearer_token",
    fieldDefs: [
      { key: "client_id", label: "Client ID", placeholder: "Seu Client ID" },
      { key: "client_secret", label: "Client Secret", placeholder: "Seu Client Secret" },
      { key: "apiUrl", label: "API URL", placeholder: "https://api.pagseguro.com", full: true },
    ],
    fields: { client_id: "", client_secret: "", apiUrl: "https://api.pagseguro.com" },
    docs: "https://dev.pagseguro.uol.com.br",
  },
];

const initPixels = [
  { id: 1, name: "Meta Principal", platform: "Meta", pixelId: "1234567890123456", status: true, global: true, events: { purchase: true, allSales: false } },
  { id: 2, name: "Google Analytics 4", platform: "Google", pixelId: "G-XXXX123456", status: true, global: true, events: { purchase: true, allSales: true } },
  { id: 3, name: "TikTok Pixel", platform: "TikTok", pixelId: "CXXXXXXXXXXXXXX", status: false, global: false, events: { purchase: true, allSales: false } },
];

const initWebhooks = [
  {
    id: 1, name: "Push Notificação", url: "https://webhookreceiver-ps6nryst2a-ey.a.run.app?key=k20z7dhq1wf2ka7g3qclxbmfbzwku5or",
    status: true, tentativas: 142, sucesso: 140,
    events: { payment_confirmed: true, payment_pending: false, payment_expired: false, checkout_started: false, refund: false },
  },
  {
    id: 2, name: "CRM Integração", url: "https://meu-crm.com/webhook/blakify",
    status: false, tentativas: 0, sucesso: 0,
    events: { payment_confirmed: true, payment_pending: true, payment_expired: true, checkout_started: true, refund: true },
  },
];

const mockProducts = [
  { id: 1, name: "Kit Premium 3x", price: 119.70, slug: "kit-premium-3x", status: true, vendas: 48, color: "#6366f1" },
  { id: 2, name: "Produto Único", price: 39.90, slug: "produto-unico", status: true, vendas: 127, color: "#8b5cf6" },
  { id: 3, name: "Kit 2x Especial", price: 79.80, slug: "kit-2x-especial", status: false, vendas: 12, color: "#06b6d4" },
];

// ─── STYLES ─────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

*{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:#0a0608;--s1:rgba(255,255,255,.025);--s2:rgba(255,255,255,.05);--s3:rgba(255,255,255,.08);
  --b1:rgba(255,255,255,.07);--b2:rgba(255,255,255,.13);
  --t1:#f5eef0;--t2:rgba(245,238,240,.55);--t3:rgba(245,238,240,.3);
  --acc:#e0173a;--acc2:#ff3b5c;
  --green:#0dbb7c;--red:#ff6b6b;--yellow:#f5a623;--blue:#3b82f6;
  --r:13px;--rs:8px;--font:'Inter',-apple-system,sans-serif;--sw:220px
}
body{background:var(--bg);color:var(--t1);font-family:var(--font);-webkit-font-smoothing:antialiased;background-image:radial-gradient(ellipse at 15% 0%,rgba(224,23,58,.06) 0%,transparent 45%),radial-gradient(ellipse at 85% 100%,rgba(180,10,35,.04) 0%,transparent 40%)}

/* APP */
.app{display:flex;height:100vh;overflow:hidden}

/* SIDEBAR */
.sb{width:var(--sw);min-width:var(--sw);background:rgba(10,4,6,.97);border-right:1px solid var(--b1);display:flex;flex-direction:column}
.sb-logo{padding:18px 16px 14px;border-bottom:1px solid var(--b1)}
.logo{display:flex;align-items:center;gap:10px}
.logo-mark{width:34px;height:34px;background:linear-gradient(135deg,var(--acc),var(--acc2));border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 0 18px rgba(224,23,58,.3)}
.logo-mark svg{width:18px;height:18px}
.logo-name{font-size:15px;font-weight:800;letter-spacing:-.4px;color:var(--t1)}
.logo-tag{font-size:9.5px;font-weight:500;color:var(--t3);letter-spacing:.6px;text-transform:uppercase;margin-top:1px}
.sb-nav{flex:1;padding:10px 8px;overflow-y:auto}
.nav-sec{margin-bottom:18px}
.nav-lbl{font-size:9.5px;font-weight:700;color:var(--t3);letter-spacing:.9px;text-transform:uppercase;padding:0 8px;margin-bottom:3px}
.ni{display:flex;align-items:center;gap:9px;padding:7px 8px;border-radius:var(--rs);cursor:pointer;transition:all .14s;color:var(--t2);font-size:12.5px;font-weight:500;position:relative;user-select:none}
.ni:hover{background:var(--s2);color:var(--t1)}
.ni.on{background:rgba(224,23,58,.13);color:var(--acc)}
.ni.on::before{content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);width:2.5px;height:14px;background:var(--acc);border-radius:0 2px 2px 0}
.nb{margin-left:auto;background:var(--acc);color:#fff;font-size:9.5px;font-weight:700;padding:1.5px 5px;border-radius:20px;box-shadow:0 0 8px rgba(224,23,58,.4)}
.sb-foot{padding:10px 8px;border-top:1px solid var(--b1)}
.ua{display:flex;align-items:center;gap:9px;padding:7px 8px;border-radius:var(--rs);cursor:pointer}
.uav{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--acc),var(--acc2));display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#fff;flex-shrink:0;box-shadow:0 0 10px rgba(224,23,58,.3)}
.un{font-size:12px;font-weight:600}
.up{font-size:10px;color:var(--t3)}

/* MAIN */
.main{flex:1;display:flex;flex-direction:column;overflow:hidden}
.tb{height:52px;min-height:52px;background:rgba(10,4,6,.9);border-bottom:1px solid var(--b1);display:flex;align-items:center;padding:0 22px;gap:14px;backdrop-filter:blur(20px)}
.tb-title{font-size:14px;font-weight:700;flex:1}
.tb-search{display:flex;align-items:center;gap:7px;background:var(--s2);border:1px solid var(--b1);border-radius:7px;padding:5px 11px;color:var(--t3);font-size:12px;cursor:text;width:190px}
.tb-btn{display:flex;align-items:center;gap:5px;padding:6px 13px;border-radius:7px;background:linear-gradient(135deg,var(--acc),var(--acc2));color:#fff;font-size:12px;font-weight:600;cursor:pointer;border:none;transition:all .14s;box-shadow:0 4px 16px rgba(224,23,58,.35)}
.tb-btn:hover{opacity:.88;transform:translateY(-1px)}
.content{flex:1;overflow-y:auto;padding:22px}

/* CARDS */
.card{background:var(--s1);border:1px solid var(--b1);border-radius:var(--r);transition:border-color .14s}
.card:hover{border-color:var(--b2)}
.stat{padding:18px;position:relative;overflow:hidden}
.stat-glow{position:absolute;top:-24px;right:-24px;width:80px;height:80px;border-radius:50%;opacity:.1;filter:blur(22px)}
.stat-lbl{font-size:10.5px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.6px;margin-bottom:7px}
.stat-val{font-size:24px;font-weight:800;letter-spacing:-.5px;line-height:1;margin-bottom:5px}
.stat-sub{font-size:11px;color:var(--t2);display:flex;align-items:center;gap:3px}

/* GRID */
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.g2{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
.ga{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:14px}

/* BADGES */
.badge{display:inline-flex;align-items:center;gap:3px;padding:2.5px 7px;border-radius:20px;font-size:10.5px;font-weight:700}
.bg{background:rgba(13,187,124,.12);color:var(--green)}
.br{background:rgba(240,62,90,.12);color:var(--red)}
.by{background:rgba(245,166,35,.12);color:var(--yellow)}
.bb{background:rgba(59,130,246,.12);color:var(--blue)}
.bp{background:rgba(224,23,58,.12);color:var(--acc)}
.bgray{background:var(--s3);color:var(--t3)}

/* TABLE */
.tw{overflow-x:auto}
table{width:100%;border-collapse:collapse}
th{font-size:10px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:.5px;padding:7px 11px;text-align:left;border-bottom:1px solid var(--b1)}
td{padding:11px 11px;font-size:12.5px;border-bottom:1px solid rgba(255,255,255,.025);vertical-align:middle}
tr:hover td{background:var(--s2)}
tr:last-child td{border-bottom:none}

/* INPUTS */
.inp{width:100%;background:var(--s2);border:1px solid var(--b2);border-radius:var(--rs);color:var(--t1);font-size:12.5px;font-family:var(--font);padding:8px 11px;outline:none;transition:all .14s}
.inp:focus{border-color:var(--acc);background:var(--s3)}
.inp::placeholder{color:var(--t3)}
.lbl{font-size:10px;font-weight:700;color:var(--t2);text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px;display:block}
.sel{width:100%;background:var(--s2);border:1px solid var(--b2);border-radius:var(--rs);color:var(--t1);font-size:12.5px;font-family:var(--font);padding:8px 11px;outline:none;cursor:pointer;appearance:none}

/* BUTTONS */
.btn{display:inline-flex;align-items:center;gap:5px;padding:7px 14px;border-radius:var(--rs);font-size:12px;font-weight:600;font-family:var(--font);cursor:pointer;border:none;outline:none;transition:all .14s}
.btn-p{background:linear-gradient(135deg,var(--acc),var(--acc2));color:#fff;box-shadow:0 4px 16px rgba(224,23,58,.35)}
.btn-p:hover{opacity:.88;transform:translateY(-1px)}
.btn-g{background:var(--s2);color:var(--t2);border:1px solid var(--b1)}
.btn-g:hover{background:var(--s3);color:var(--t1)}
.btn-d{background:rgba(240,62,90,.1);color:var(--red);border:1px solid rgba(240,62,90,.18)}
.btn-d:hover{background:rgba(240,62,90,.2)}
.btn-sm{padding:4px 9px;font-size:11px}
.btn-ico{padding:5px;width:28px;height:28px;justify-content:center}

/* TOGGLE */
.tgl{display:flex;align-items:center;gap:7px;cursor:pointer}
.tgl-tr{width:34px;height:18px;border-radius:9px;background:var(--s3);border:1px solid var(--b1);position:relative;transition:all .18s;flex-shrink:0}
.tgl-tr.on{background:var(--acc);border-color:var(--acc)}
.tgl-th{position:absolute;top:2px;left:2px;width:12px;height:12px;border-radius:50%;background:#fff;transition:all .18px;transition:left .18s}
.tgl-tr.on .tgl-th{left:18px}

/* FUNNEL */
.fn-row{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--b1)}
.fn-row:last-child{border-bottom:none}
.fn-bar-w{flex:1;height:5px;background:var(--s3);border-radius:3px;overflow:hidden}
.fn-bar{height:100%;border-radius:3px}

/* MISC */
.row{display:flex;align-items:center}
.jb{justify-content:space-between}
.gap6{gap:6px}
.gap10{gap:10px}
.gap14{gap:14px}
.gap18{gap:18px}
.col{display:flex;flex-direction:column}
.col-gap{display:flex;flex-direction:column;gap:10px}
.mb4{margin-bottom:4px}
.mb8{margin-bottom:8px}
.mb14{margin-bottom:14px}
.mb18{margin-bottom:18px}
.mb22{margin-bottom:22px}
.mt10{margin-top:10px}
.mt14{margin-top:14px}
.ml-a{margin-left:auto}
.w-full{width:100%}
.frow{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.sec-t{font-size:14px;font-weight:700;margin-bottom:3px}
.sec-s{font-size:11.5px;color:var(--t3);margin-bottom:18px}
.divider{border:none;border-top:1px solid var(--b1);margin:14px 0}

.copy-link{display:flex;align-items:center;gap:7px;background:var(--s2);border:1px solid var(--b1);border-radius:7px;padding:7px 10px;font-size:11px;color:var(--t3);cursor:pointer;transition:all .14s}
.copy-link:hover{border-color:var(--acc);color:var(--t1)}
.copy-link span{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sdot{width:5px;height:5px;border-radius:50%;flex-shrink:0}
.sdot.g{background:var(--green);box-shadow:0 0 5px var(--green)}
.sdot.r{background:var(--red)}
.sdot.y{background:var(--yellow)}
.pbar{height:3px;background:var(--s3);border-radius:2px;overflow:hidden;margin-top:6px}
.pfill{height:100%;border-radius:2px;background:linear-gradient(90deg,var(--acc),var(--acc2))}

/* MODAL */
.overlay{position:fixed;inset:0;z-index:100;background:rgba(0,0,0,.72);backdrop-filter:blur(5px);display:flex;align-items:center;justify-content:center;padding:20px}
.modal{background:#130608;border:1px solid var(--b2);border-radius:18px;padding:26px;width:100%;max-width:480px;max-height:90vh;overflow-y:auto;box-shadow:0 40px 80px rgba(0,0,0,.8)}
.modal-t{font-size:15px;font-weight:800;margin-bottom:3px}
.modal-s{font-size:11.5px;color:var(--t3);margin-bottom:22px}

/* GW ROW */
.gw-row{padding:16px 18px;border-bottom:1px solid var(--b1)}
.gw-row:last-child{border-bottom:none}
.gw-name{font-size:13px;font-weight:700;margin-bottom:2px}
.gw-tag{font-size:10.5px;color:var(--t3)}
.gw-methods{display:flex;gap:6px;margin-top:8px}
.meth-btn{display:flex;align-items:center;gap:4px;padding:3px 9px;border-radius:5px;font-size:10.5px;font-weight:600;cursor:pointer;border:1px solid var(--b2);background:var(--s2);color:var(--t3);transition:all .14s;user-select:none}
.meth-btn.on{background:rgba(224,23,58,.12);border-color:var(--acc);color:var(--acc)}
.gw-keys{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px;padding:10px;background:var(--s2);border-radius:var(--rs);border:1px solid var(--b1)}

/* KEY INPUT */
.key-wrap{position:relative}
.key-wrap .inp{padding-right:34px;font-size:10.5px;font-family:monospace}
.key-eye{position:absolute;right:9px;top:50%;transform:translateY(-50%);cursor:pointer;color:var(--t3)}

/* PIXEL CARD */
.px-card{padding:16px 18px}
.px-ico{width:36px;height:36px;border-radius:9px;display:flex;align-items:center;justify-content:center;background:var(--s2);flex-shrink:0}

/* WH CARD */
.wh-card{padding:16px 18px}
.wh-url{font-size:10px;color:var(--t3);font-family:monospace;background:var(--s2);padding:5px 9px;border-radius:6px;margin-top:5px;word-break:break-all}
.ev-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:5px;font-size:10px;font-weight:600;cursor:pointer;border:1px solid var(--b1);background:var(--s1);color:var(--t3);margin:3px;transition:all .14s;user-select:none}
.ev-chip.on{background:rgba(224,23,58,.12);border-color:var(--acc);color:var(--acc)}

/* TABS */
.tabs{display:flex;gap:3px;background:var(--s2);border-radius:var(--rs);padding:3px;margin-bottom:18px}
.tab{padding:5px 12px;border-radius:6px;font-size:11.5px;font-weight:600;cursor:pointer;color:var(--t3);transition:all .14s}
.tab.on{background:var(--s3);color:var(--t1)}

/* PRODUCT CARD */
.pc{padding:16px;position:relative}
.pc-bar{position:absolute;top:0;left:0;right:0;height:2.5px;border-radius:13px 13px 0 0}

/* LOGIN */
.login-wrap{min-height:100vh;background:var(--bg);display:flex;align-items:center;justify-content:center;padding:20px;position:relative;overflow:hidden}
.login-glow{position:absolute;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(224,23,58,.12) 0%,rgba(255,59,92,.04) 40%,transparent 70%);top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none}
.login-card{background:#130608;border:1px solid var(--b2);border-radius:22px;padding:40px;width:100%;max-width:380px;position:relative;z-index:1;box-shadow:0 40px 80px rgba(0,0,0,.6)}
.login-logo{display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:28px}
.login-title{font-size:20px;font-weight:800;text-align:center;margin-bottom:6px}
.login-sub{font-size:12.5px;color:var(--t3);text-align:center;margin-bottom:28px}

/* DB/DEPLOY */
.code-block{background:rgba(0,0,0,.4);border:1px solid var(--b1);border-radius:var(--rs);padding:12px 14px;font-family:monospace;font-size:11px;color:#a8ff78;line-height:1.6;overflow-x:auto}
.db-schema{background:rgba(0,0,0,.4);border:1px solid var(--b1);border-radius:var(--rs);padding:14px;font-family:monospace;font-size:10.5px;color:var(--t2);line-height:1.7;overflow-x:auto;white-space:pre}

/* SCROLLBAR */
::-webkit-scrollbar{width:3px;height:3px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--s3);border-radius:2px}

/* ANIMS */
@keyframes fi{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.fi{animation:fi .25s ease}
@keyframes pu{0%,100%{opacity:1}50%{opacity:.4}}
.pu{animation:pu 2s infinite}
@keyframes toast-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
.toast{animation:toast-in .3s ease}
`;

// ─── TOOLTIP ─────────────────────────────────────────────────────────────────
const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#160810", border: "1px solid rgba(255,255,255,.1)", borderRadius: 10, padding: "8px 13px" }}>
      <div style={{ fontSize: 10, color: "rgba(238,238,248,.4)", marginBottom: 5 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 12, fontWeight: 700, color: p.color }}>
          {p.name === "v" ? "Vendas" : "Lucro"}: R$ {p.value.toLocaleString("pt-BR")}
        </div>
      ))}
    </div>
  );
};

// ─── TOGGLE COMPONENT ────────────────────────────────────────────────────────
const Toggle = ({ on, onChange }) => (
  <div className="tgl" onClick={onChange}>
    <div className={`tgl-tr ${on ? "on" : ""}`}><div className="tgl-th" /></div>
  </div>
);

// ─── VIEWS ───────────────────────────────────────────────────────────────────

function Dashboard() {
  return (
    <div className="fi">
      <div className="mb22">
        <div className="sec-t">Dashboard</div>
        <div className="sec-s">Desempenho em tempo real</div>
      </div>

      <div className="g4 mb14">
        {[
          { lbl: "Vendas Totais", val: "R$ 929,60", sub: "↑ 190.86% hoje", note: "11 pedidos", c: "#0dbb7c" },
          { lbl: "Lucro Líquido", val: "R$ 433,30", sub: "↑ 442.3% hoje", note: "5 pagos", c: "#e0173a" },
          { lbl: "Ticket Médio", val: "R$ 84,51", sub: "↑ 12.4% semana", note: "por pedido", c: "#f5a623" },
          { lbl: "Conversão PIX", val: "45.45%", sub: "11 gerados", note: "5 pagos", c: "#3b82f6" },
        ].map((s, i) => (
          <div key={i} className="card stat">
            <div className="stat-glow" style={{ background: s.c }} />
            <div className="stat-lbl">{s.lbl}</div>
            <div className="stat-val">{s.val}</div>
            <div className="stat-sub"><span style={{ color: s.c, fontWeight: 700 }}>{s.sub}</span></div>
            <div style={{ fontSize: 10, color: "var(--t3)", marginTop: 2 }}>{s.note}</div>
          </div>
        ))}
      </div>

      <div className="g2 mb14">
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 14 }}>Vendas & Lucro</div>
          <ResponsiveContainer width="100%" height={170}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="gv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e0173a" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#e0173a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gl" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0dbb7c" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="#0dbb7c" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: "rgba(238,238,248,.3)", fontSize: 9.5 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<Tip />} />
              <Area type="monotone" dataKey="v" name="v" stroke="#e0173a" strokeWidth={1.8} fill="url(#gv)" />
              <Area type="monotone" dataKey="l" name="l" stroke="#0dbb7c" strokeWidth={1.8} fill="url(#gl)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 14 }}>Funil de Conversão</div>
          {funnelData.map((f, i) => (
            <div key={i} className="fn-row">
              <div style={{ fontSize: 11, color: "var(--t2)", width: 105, flexShrink: 0 }}>{f.name}</div>
              <div className="fn-bar-w">
                <div className="fn-bar" style={{ width: `${f.pct}%`, background: `rgba(224,23,58,${0.25 + (f.pct / 100) * 0.65})` }} />
              </div>
              <div style={{ fontSize: 11.5, fontWeight: 700, width: 36, textAlign: "right", flexShrink: 0 }}>{f.value}</div>
              <div style={{ fontSize: 10, color: "var(--t3)", width: 36, textAlign: "right", flexShrink: 0 }}>{f.pct}%</div>
            </div>
          ))}
        </div>
      </div>

      <div className="g2 mb14">
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 4 }}>UTM / Origem das Vendas</div>
          <div style={{ fontSize: 10.5, color: "var(--t3)", marginBottom: 14 }}>Conversões por fonte de tráfego</div>
          <table>
            <thead><tr><th>Fonte</th><th>Cliques</th><th>Conv.</th><th>Receita</th></tr></thead>
            <tbody>
              {utmData.map((u, i) => (
                <tr key={i}>
                  <td>
                    <div className="row gap6">
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: u.color, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 11.5, fontWeight: 600 }}>{u.source}</div>
                        <div style={{ fontSize: 10, color: "var(--t3)" }}>{u.medium}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 11.5 }}>{u.clicks}</td>
                  <td><span className="badge bg">{u.conv}</span></td>
                  <td style={{ fontSize: 11.5, fontWeight: 700, color: "var(--green)" }}>{u.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card" style={{ padding: 18 }}>
          <div className="row jb mb14">
            <div style={{ fontSize: 12.5, fontWeight: 700 }}>Pedidos Recentes</div>
            <span className="badge bp pu">AO VIVO</span>
          </div>
          <div className="col-gap">
            {mockOrders.map((o, i) => (
              <div key={i} className="row gap10" style={{ padding: "9px 11px", background: "var(--s1)", borderRadius: 9, border: "1px solid var(--b1)" }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700 }}>{o.cliente}</div>
                  <div style={{ fontSize: 10.5, color: "var(--t3)" }}>{o.produto}</div>
                </div>
                <div className="ml-a" style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: "var(--green)" }}>{o.valor}</div>
                  <span className={`badge ${o.status === "pago" ? "bg" : o.status === "aguardando" ? "by" : "br"}`}>{o.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Products({ onNew }) {
  const [copied, setCopied] = useState(null);
  return (
    <div className="fi">
      <div className="row jb mb22">
        <div><div className="sec-t">Produtos & Links</div><div className="sec-s">Gerencie produtos e links de checkout</div></div>
        <button className="btn btn-p" onClick={onNew}><Ic d={I.plus} size={13} /> Novo Produto</button>
      </div>
      <div className="ga">
        {mockProducts.map((p, i) => (
          <div key={p.id} className="card pc">
            <div className="pc-bar" style={{ background: p.color }} />
            <div className="row jb mb14" style={{ paddingTop: 6 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 1 }}>{p.name}</div>
                <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -.5 }}>R$ {p.price.toFixed(2).replace(".", ",")}</div>
              </div>
              <Toggle on={p.status} onChange={() => {}} />
            </div>
            <div style={{ display: "flex", gap: 7, marginBottom: 12 }}>
              {[["Vendas", p.vendas], ["Gateway", "Masterpag"]].map(([lbl, val], j) => (
                <div key={j} style={{ flex: 1, background: "var(--s2)", borderRadius: 7, padding: "7px 9px", textAlign: "center" }}>
                  <div style={{ fontSize: 13.5, fontWeight: 800 }}>{val}</div>
                  <div style={{ fontSize: 9.5, color: "var(--t3)" }}>{lbl}</div>
                </div>
              ))}
            </div>
            <div className="copy-link" onClick={() => { setCopied(i); setTimeout(() => setCopied(null), 1400); }}>
              <span>blakify.io/c/{p.slug}</span>
              <Ic d={copied === i ? I.check : I.copy} size={12} />
            </div>
            <div className="row gap6 mt10">
              <button className="btn btn-g btn-sm" style={{ flex: 1 }}><Ic d={I.edit} size={11} /> Editar</button>
              <button className="btn btn-g btn-sm btn-ico"><Ic d={I.chart} size={12} /></button>
            </div>
          </div>
        ))}
        <div className="card" style={{ padding: 18, border: "1px dashed var(--b2)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, minHeight: 160, color: "var(--t3)" }} onClick={onNew}>
          <Ic d={I.plus} size={22} />
          <div style={{ fontSize: 12.5 }}>Novo produto</div>
        </div>
      </div>
    </div>
  );
}

function Orders() {
  const [filter, setFilter] = useState("todos");
  const filtered = filter === "todos" ? mockOrders : filter === "pago" ? mockOrders.filter(o => o.status === "pago") : mockOrders.filter(o => o.status !== "pago");
  return (
    <div className="fi">
      <div className="mb22"><div className="sec-t">Pedidos</div><div className="sec-s">Histórico completo de transações</div></div>
      <div className="card" style={{ overflow: "hidden", padding: 0 }}>
        <div style={{ padding: "13px 16px", borderBottom: "1px solid var(--b1)", display: "flex", gap: 8, alignItems: "center" }}>
          <div className="tabs" style={{ marginBottom: 0 }}>
            {["todos", "pago", "outros"].map(t => (
              <div key={t} className={`tab ${filter === t ? "on" : ""}`} onClick={() => setFilter(t)}>
                {t === "todos" ? "Todos" : t === "pago" ? "✓ Pagos" : "Pendentes / Expirados"}
              </div>
            ))}
          </div>
          <div className="tb-search" style={{ width: "auto", flex: 1 }}>
            <Ic d={I.search} size={12} /><span>Buscar...</span>
          </div>
        </div>
        <div className="tw">
          <table>
            <thead><tr><th>ID</th><th>Cliente</th><th>Produto</th><th>Valor</th><th>Gateway</th><th>Status</th><th>Data</th><th></th></tr></thead>
            <tbody>
              {filtered.map((o, i) => (
                <tr key={i}>
                  <td><span style={{ fontFamily: "monospace", fontSize: 11, color: "var(--acc)" }}>{o.id}</span></td>
                  <td style={{ fontWeight: 600 }}>{o.cliente}</td>
                  <td style={{ fontSize: 11.5, color: "var(--t2)" }}>{o.produto}</td>
                  <td style={{ fontWeight: 800, color: "var(--green)" }}>{o.valor}</td>
                  <td><span className="badge bb">{o.gateway}</span></td>
                  <td><span className={`badge ${o.status === "pago" ? "bg" : o.status === "aguardando" ? "by" : "br"}`}>{o.status}</span></td>
                  <td style={{ fontSize: 10.5, color: "var(--t3)" }}>{o.data}</td>
                  <td><button className="btn btn-g btn-sm btn-ico"><Ic d={I.eye} size={11} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Gateways() {
  const [gws, setGws] = useState(initGateways);
  const [editing, setEditing] = useState(null);
  const [showKey, setShowKey] = useState({});

  const toggleGw = (id) => setGws(g => g.map(gw => gw.id === id ? { ...gw, status: !gw.status } : gw));
  const toggleMethod = (id, m) => setGws(g => g.map(gw => gw.id === id ? { ...gw, methods: { ...gw.methods, [m]: !gw.methods[m] } } : gw));
  const updateField = (id, key, val) => setGws(g => g.map(gw => gw.id === id ? { ...gw, fields: { ...gw.fields, [key]: val } } : gw));

  const authBadge = (type) => type === "bearer_token"
    ? <span className="badge bb" style={{ fontSize: 9.5 }}>Bearer Token</span>
    : <span className="badge bgray" style={{ fontSize: 9.5 }}>Header Keys</span>;

  return (
    <div className="fi">
      <div className="row jb mb22">
        <div><div className="sec-t">Gateways de Pagamento</div><div className="sec-s">Gerencie provedores — o gateway ativo padrão é aplicado a todos os produtos</div></div>
        <button className="btn btn-p"><Ic d={I.plus} size={13} /> Adicionar</button>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {gws.map((gw) => (
          <div key={gw.id} className="gw-row">
            <div className="row jb">
              <div style={{ flex: 1 }}>
                <div className="row gap6 mb4" style={{ flexWrap: "wrap" }}>
                  <div className="gw-name">{gw.name}</div>
                  <div className={`sdot ${gw.status ? "g" : "r"}`} />
                  {authBadge(gw.authType)}
                  {gw.docs && (
                    <a href={gw.docs} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, color: "var(--acc)", textDecoration: "none" }}>
                      Ver docs ↗
                    </a>
                  )}
                </div>
                <div className="gw-methods">
                  {Object.entries(gw.methods).map(([m, on]) => (
                    <div key={m} className={`meth-btn ${on ? "on" : ""}`} onClick={() => toggleMethod(gw.id, m)}>
                      <Ic d={m === "pix" ? I.pix : m === "cartao" ? I.cc : I.boleto} size={11} />
                      {m === "pix" ? "PIX" : m === "cartao" ? "Cartão" : "Boleto"}
                    </div>
                  ))}
                </div>
              </div>
              <div className="row gap10">
                <button className="btn btn-g btn-sm" onClick={() => setEditing(editing === gw.id ? null : gw.id)}>
                  <Ic d={I.key} size={11} /> {editing === gw.id ? "Fechar" : "Chaves"}
                </button>
                <Toggle on={gw.status} onChange={() => toggleGw(gw.id)} />
              </div>
            </div>

            {editing === gw.id && (
              <div className="mt10" style={{ padding: "12px", background: "var(--s2)", borderRadius: "var(--rs)", border: "1px solid var(--b1)" }}>
                {gw.note && (
                  <div style={{ fontSize: 11, color: "var(--t2)", background: "rgba(224,23,58,.06)", border: "1px solid rgba(224,23,58,.15)", borderRadius: 7, padding: "7px 10px", marginBottom: 10 }}>
                    ℹ️ {gw.note}
                  </div>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {gw.fieldDefs.map(fd => (
                    <div key={fd.key} style={{ gridColumn: fd.full ? "span 2" : "span 1" }}>
                      <div className="lbl" style={{ marginBottom: 4 }}>{fd.label}</div>
                      <div className="key-wrap">
                        <input
                          className="inp"
                          type={fd.full ? "text" : (showKey[`${fd.key}${gw.id}`] ? "text" : "password")}
                          value={gw.fields[fd.key] || ""}
                          onChange={e => updateField(gw.id, fd.key, e.target.value)}
                          placeholder={fd.placeholder}
                        />
                        {!fd.full && (
                          <div className="key-eye" onClick={() => setShowKey(s => ({ ...s, [`${fd.key}${gw.id}`]: !s[`${fd.key}${gw.id}`] }))}>
                            <Ic d={showKey[`${fd.key}${gw.id}`] ? I.eyeOff : I.eye} size={12} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div style={{ gridColumn: "span 2" }}>
                    <button className="btn btn-p btn-sm w-full" style={{ justifyContent: "center" }} onClick={() => setEditing(null)}>
                      <Ic d={I.check} size={11} /> Salvar chaves
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Pixels() {
  const [pixels, setPixels] = useState(initPixels);

  const toggle = (id, field) => setPixels(p => p.map(px => px.id === id ? { ...px, [field]: !px[field] } : px));
  const toggleEvent = (id, ev) => setPixels(p => p.map(px => px.id === id ? { ...px, events: { ...px.events, [ev]: !px.events[ev] } } : px));

  return (
    <div className="fi">
      <div className="row jb mb22">
        <div><div className="sec-t">Pixels & Rastreamento</div><div className="sec-s">Pixels globais são disparados em todos os checkouts automaticamente</div></div>
        <button className="btn btn-p"><Ic d={I.plus} size={13} /> Novo Pixel</button>
      </div>

      <div className="col-gap mb22">
        {pixels.map(px => (
          <div key={px.id} className="card px-card">
            <div className="row jb">
              <div className="row gap10">
                <div className="px-ico">
                  <SocialIcon platform={px.platform} size={20} />
                </div>
                <div>
                  <div className="row gap6 mb4">
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{px.name}</div>
                    <span className={`badge ${px.status ? "bg" : "bgray"}`}>{px.status ? "ativo" : "inativo"}</span>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--t3)" }}>{px.platform} · <span style={{ fontFamily: "monospace" }}>{px.pixelId}</span></div>
                </div>
              </div>
              <div className="row gap10">
                <button className="btn btn-d btn-sm btn-ico"><Ic d={I.trash} size={11} /></button>
                <Toggle on={px.status} onChange={() => toggle(px.id, "status")} />
              </div>
            </div>

            <div style={{ marginTop: 12, padding: "10px 12px", background: "var(--s2)", borderRadius: 9, border: "1px solid var(--b1)" }}>
              <div className="row jb mb8">
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: ".5px" }}>Eventos disparados</div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 0 }}>
                {[
                  { key: "purchase", label: "✓ Venda paga" },
                  { key: "allSales", label: "Todas as tentativas" },
                ].map(ev => (
                  <div key={ev.key} className={`ev-chip ${px.events[ev.key] ? "on" : ""}`} onClick={() => toggleEvent(px.id, ev.key)}>
                    {ev.label}
                  </div>
                ))}
                {["InitiateCheckout", "AddPaymentInfo", "PageView"].map(ev => (
                  <div key={ev} className="ev-chip on">{ev}</div>
                ))}
              </div>
              <div className="row gap10 mt10">
                <div style={{ fontSize: 10.5, color: "var(--t2)" }}>Aplicar em todos os produtos</div>
                <div className="ml-a"><Toggle on={px.global} onChange={() => toggle(px.id, "global")} /></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 12 }}>Adicionar plataforma</div>
      <div className="g4">
        {["Meta", "Google", "TikTok", "Kwai", "Pinterest", "Taboola", "Custom"].map((p, i) => (
          <div key={i} className="card" style={{ padding: "11px 14px", display: "flex", alignItems: "center", gap: 9 }}>
            <SocialIcon platform={p} size={18} />
            <div style={{ fontSize: 12, fontWeight: 600, flex: 1 }}>{p}</div>
            <button className="btn btn-g btn-sm" style={{ fontSize: 10 }}>+</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Webhooks() {
  const [whs, setWhs] = useState(initWebhooks);
  const [tab, setTab] = useState("webhooks");

  const toggleWh = (id) => setWhs(w => w.map(wh => wh.id === id ? { ...wh, status: !wh.status } : wh));
  const toggleEv = (id, ev) => setWhs(w => w.map(wh => wh.id === id ? { ...wh, events: { ...wh.events, [ev]: !wh.events[ev] } } : wh));

  const evLabels = {
    payment_confirmed: "✓ Venda paga",
    payment_pending: "Venda pendente",
    payment_expired: "PIX expirado",
    checkout_started: "Checkout iniciado",
    refund: "Reembolso",
  };

  return (
    <div className="fi">
      <div className="row jb mb22">
        <div><div className="sec-t">Webhooks & Notificações</div><div className="sec-s">Configure integrações e alertas automáticos por evento</div></div>
        <button className="btn btn-p"><Ic d={I.plus} size={13} /> Novo Webhook</button>
      </div>

      <div className="tabs">
        {["webhooks", "push", "logs"].map(t => (
          <div key={t} className={`tab ${tab === t ? "on" : ""}`} onClick={() => setTab(t)}>
            {t === "webhooks" ? "Webhooks" : t === "push" ? "Notificações Push" : "Logs"}
          </div>
        ))}
      </div>

      {tab === "webhooks" && (
        <div className="col-gap">
          {whs.map(wh => (
            <div key={wh.id} className="card wh-card">
              <div className="row jb mb8">
                <div>
                  <div className="row gap6 mb4">
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{wh.name}</div>
                    <span className={`badge ${wh.status ? "bg" : "bgray"}`}>{wh.status ? "ativo" : "inativo"}</span>
                  </div>
                  <div className="wh-url">{wh.url}</div>
                </div>
                <div className="row gap8" style={{ marginLeft: 14 }}>
                  <button className="btn btn-g btn-sm">Testar</button>
                  <Toggle on={wh.status} onChange={() => toggleWh(wh.id)} />
                </div>
              </div>

              <div style={{ marginTop: 12, padding: "10px 12px", background: "var(--s2)", borderRadius: 9, border: "1px solid var(--b1)" }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--t3)", textTransform: "uppercase", letterSpacing: ".5px", marginBottom: 7 }}>Disparar nos eventos</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 0 }}>
                  {Object.entries(wh.events).map(([ev, on]) => (
                    <div key={ev} className={`ev-chip ${on ? "on" : ""}`} onClick={() => toggleEv(wh.id, ev)}>
                      {evLabels[ev]}
                    </div>
                  ))}
                </div>
              </div>

              {wh.tentativas > 0 && (
                <div className="row gap10 mt10">
                  <div style={{ background: "var(--s2)", borderRadius: 8, padding: "6px 12px", textAlign: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 800 }}>{wh.tentativas}</div>
                    <div style={{ fontSize: 9.5, color: "var(--t3)" }}>Tentativas</div>
                  </div>
                  <div style={{ background: "var(--s2)", borderRadius: 8, padding: "6px 12px", textAlign: "center" }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "var(--green)" }}>{wh.sucesso}</div>
                    <div style={{ fontSize: 9.5, color: "var(--t3)" }}>Sucesso</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="row jb mb4">
                      <span style={{ fontSize: 10, color: "var(--t3)" }}>Taxa</span>
                      <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--green)" }}>{Math.round((wh.sucesso / wh.tentativas) * 100)}%</span>
                    </div>
                    <div className="pbar"><div className="pfill" style={{ width: `${(wh.sucesso / wh.tentativas) * 100}%` }} /></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === "push" && (
        <div className="card" style={{ padding: 18 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 4 }}>Notificações Push</div>
          <div style={{ fontSize: 11, color: "var(--t3)", marginBottom: 16 }}>Escolha quais eventos geram uma notificação push para você</div>
          {[
            { lbl: "Venda paga / confirmada", desc: "Notificação a cada pagamento aprovado", on: true },
            { lbl: "Venda pendente (PIX gerado)", desc: "Alerta quando um PIX é gerado mas ainda não pago", on: false },
            { lbl: "PIX expirado", desc: "Quando um PIX não é pago no prazo de 15 min", on: false },
            { lbl: "Novo acesso ao checkout", desc: "Quando alguém abre seu link de produto", on: true },
            { lbl: "Reembolso solicitado", desc: "Quando uma venda é estornada", on: true },
            { lbl: "Relatório diário", desc: "Resumo de vendas enviado às 20h", on: true },
          ].map((n, i, arr) => (
            <div key={i} className="row jb" style={{ padding: "11px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--b1)" : "none" }}>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 2 }}>{n.lbl}</div>
                <div style={{ fontSize: 11, color: "var(--t3)" }}>{n.desc}</div>
              </div>
              <Toggle on={n.on} onChange={() => {}} />
            </div>
          ))}
        </div>
      )}

      {tab === "logs" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <table>
            <thead><tr><th>Evento</th><th>Webhook</th><th>Status</th><th>Resposta</th><th>Horário</th></tr></thead>
            <tbody>
              {[
                { ev: "payment.confirmed", wh: "Push Notificação", st: "200", resp: "OK", hora: "14:32:18" },
                { ev: "payment.confirmed", wh: "Push Notificação", st: "200", resp: "OK", hora: "13:18:44" },
                { ev: "checkout.started", wh: "Push Notificação", st: "200", resp: "OK", hora: "12:55:01" },
                { ev: "payment.expired", wh: "Push Notificação", st: "500", resp: "Timeout", hora: "11:40:33" },
              ].map((l, i) => (
                <tr key={i}>
                  <td><span className="badge bp">{l.ev}</span></td>
                  <td style={{ fontSize: 11.5, color: "var(--t2)" }}>{l.wh}</td>
                  <td><span className={`badge ${l.st === "200" ? "bg" : "br"}`}>{l.st}</span></td>
                  <td style={{ fontSize: 11.5 }}>{l.resp}</td>
                  <td style={{ fontSize: 10.5, color: "var(--t3)", fontFamily: "monospace" }}>{l.hora}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Deploy() {
  return (
    <div className="fi">
      <div className="mb22">
        <div className="sec-t">Configurações & Deploy</div>
        <div className="sec-s">Banco de dados Neon + hospedagem Vercel — tudo pré-configurado</div>
      </div>

      <div className="g2 mb14">
        <div className="card" style={{ padding: 18 }}>
          <div className="row gap10 mb14">
            <Ic d={I.db} size={16} stroke="#e0173a" />
            <div style={{ fontSize: 13, fontWeight: 700 }}>Banco de Dados — Neon PostgreSQL</div>
          </div>
          <div style={{ fontSize: 11.5, color: "var(--t3)", marginBottom: 12, lineHeight: 1.6 }}>
            Adicione a variável <code style={{ background: "var(--s2)", padding: "1px 5px", borderRadius: 4, fontFamily: "monospace", color: "var(--acc)" }}>DATABASE_URL</code> no painel da Vercel com sua connection string do Neon.
          </div>
          <div className="code-block">{`# .env.local
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/blakify?sslmode=require"
NEXTAUTH_SECRET="seu-secret-aqui"
NEXTAUTH_URL="https://seudominio.vercel.app"`}</div>
          <div style={{ fontSize: 11.5, color: "var(--t3)", marginTop: 12, lineHeight: 1.7 }}>
            Schema SQL pré-configurado:
          </div>
          <div className="db-schema">{`CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT, plan TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name TEXT, price NUMERIC(10,2),
  slug TEXT UNIQUE, color TEXT,
  gateway_id UUID, status BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id),
  user_id UUID REFERENCES users(id),
  customer_name TEXT, customer_email TEXT,
  customer_cpf TEXT, amount NUMERIC(10,2),
  status TEXT DEFAULT 'pending',
  transaction_id TEXT, gateway TEXT,
  utm_source TEXT, utm_medium TEXT,
  utm_campaign TEXT, utm_content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE gateways (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name TEXT, public_key TEXT,
  secret_key TEXT ENCRYPTED, api_url TEXT,
  methods JSONB, status BOOLEAN DEFAULT false
);

CREATE TABLE pixels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name TEXT, platform TEXT,
  pixel_id TEXT, status BOOLEAN DEFAULT true,
  global BOOLEAN DEFAULT false, events JSONB
);

CREATE TABLE webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  name TEXT, url TEXT,
  status BOOLEAN DEFAULT false, events JSONB
);`}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card" style={{ padding: 18 }}>
            <div className="row gap10 mb14">
              <Ic d={I.deploy} size={16} stroke="#0dbb7c" />
              <div style={{ fontSize: 13, fontWeight: 700 }}>Deploy na Vercel</div>
            </div>
            <div className="code-block">{`# 1. Instalar dependências
npm install

# 2. Gerar cliente Prisma
npx prisma generate
npx prisma db push

# 3. Build + Deploy
vercel --prod`}</div>
            <div style={{ marginTop: 12, padding: "10px 12px", background: "rgba(13,187,124,.06)", borderRadius: 8, border: "1px solid rgba(13,187,124,.15)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--green)", marginBottom: 4 }}>✓ Variáveis de ambiente necessárias</div>
              {["DATABASE_URL", "NEXTAUTH_SECRET", "NEXTAUTH_URL", "MASTERPAG_PUBLIC_KEY", "MASTERPAG_SECRET_KEY"].map(v => (
                <div key={v} style={{ fontSize: 10.5, fontFamily: "monospace", color: "var(--t2)", lineHeight: 1.8 }}>{v}</div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Conta & Personalização</div>
            <div className="col-gap">
              <div><label className="lbl">Nome da loja no checkout</label><input className="inp" defaultValue="Minha Loja" /></div>
              <div><label className="lbl">Domínio personalizado</label><input className="inp" placeholder="checkout.seusite.com.br" /></div>
              <div><label className="lbl">Cor primária do checkout</label>
                <div className="row gap8">
                  <input type="color" className="inp" style={{ width: 48, padding: 3, height: 36, cursor: "pointer" }} defaultValue="#e0173a" />
                  <input className="inp" defaultValue="#e0173a" style={{ flex: 1 }} />
                </div>
              </div>
              <button className="btn btn-p" style={{ justifyContent: "center" }}>Salvar configurações</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NewProductModal({ onClose }) {
  const [form, setForm] = useState({ name: "", price: "", slug: "", color: "#e0173a" });
  const [saved, setSaved] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const handleSave = () => { setSaved(true); setTimeout(() => { setSaved(false); onClose(); }, 900); };
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal fi" onClick={e => e.stopPropagation()}>
        <div className="row jb mb14">
          <div><div className="modal-t">Novo Produto</div><div className="modal-s">Produto, gateway e pixels em uma tela</div></div>
          <button className="btn btn-g btn-ico" onClick={onClose}><Ic d={I.close} size={13} /></button>
        </div>
        <div className="col-gap">
          <div><label className="lbl">Nome do Produto</label><input className="inp" placeholder="Ex: Kit Premium 3x" value={form.name} onChange={e => set("name", e.target.value)} /></div>
          <div className="frow">
            <div><label className="lbl">Preço (R$)</label><input className="inp" placeholder="0,00" value={form.price} onChange={e => set("price", e.target.value)} /></div>
            <div><label className="lbl">Slug / URL</label><input className="inp" placeholder="meu-produto" value={form.slug} onChange={e => set("slug", e.target.value)} /></div>
          </div>
          <div className="frow">
            <div><label className="lbl">Cor</label><input type="color" className="inp" style={{ height: 38, padding: 3, cursor: "pointer" }} value={form.color} onChange={e => set("color", e.target.value)} /></div>
            <div><label className="lbl">Gateway</label><select className="sel"><option>Masterpag (ativo)</option><option>Mercado Pago</option></select></div>
          </div>
          <div>
            <label className="lbl">Pixels aplicados</label>
            <div style={{ padding: "10px 12px", background: "var(--s2)", borderRadius: 9, border: "1px solid var(--b1)", display: "flex", gap: 14, flexWrap: "wrap" }}>
              {initPixels.map(px => (
                <label key={px.id} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 12 }}>
                  <input type="checkbox" defaultChecked style={{ accentColor: "var(--acc)" }} />
                  <SocialIcon platform={px.platform} size={14} /> {px.name}
                </label>
              ))}
            </div>
          </div>
          {form.name && (
            <div style={{ background: "rgba(224,23,58,.06)", border: "1px solid rgba(224,23,58,.18)", borderRadius: 9, padding: "10px 13px" }}>
              <div style={{ fontSize: 9.5, color: "var(--t3)", marginBottom: 3, textTransform: "uppercase", letterSpacing: ".5px" }}>Link do checkout</div>
              <div style={{ fontSize: 12, fontFamily: "monospace", color: "var(--acc)" }}>blakify.io/c/{form.slug || form.name.toLowerCase().replace(/\s+/g, "-")}</div>
            </div>
          )}
          <button className="btn btn-p w-full" style={{ justifyContent: "center" }} onClick={handleSave}>
            {saved ? <><Ic d={I.check} size={13} /> Produto criado!</> : "Criar Produto"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handle = () => {
    if (!email || !pass) { setErr("Preencha todos os campos."); return; }
    setLoading(true); setErr("");
    setTimeout(() => { setLoading(false); onLogin(); }, 1100);
  };

  return (
    <div className="login-wrap">
      <div className="login-glow" />
      <div className="login-card fi">
        <div className="login-logo">
          <div style={{ width: 44, height: 44, background: "linear-gradient(135deg,var(--acc),var(--acc2))", boxShadow: "0 0 24px rgba(224,23,58,.35)", borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 14a1 1 0 01-.78-1.63l9.9-10.2a.5.5 0 01.86.46l-1.92 6.02A1 1 0 0013 10h7a1 1 0 01.78 1.63l-9.9 10.2a.5.5 0 01-.86-.46l1.92-6.02A1 1 0 0011 14H4z" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: -.4 }}>Blakify</div>
            <div style={{ fontSize: 9.5, color: "var(--t3)", letterSpacing: .6, textTransform: "uppercase" }}>SaaS de Checkout</div>
          </div>
        </div>
        <div className="login-title">Bem-vindo de volta</div>
        <div className="login-sub">Entre para acessar seu painel de vendas</div>
        <div className="col-gap">
          <div>
            <label className="lbl">E-mail</label>
            <input className="inp" type="email" placeholder="voce@email.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handle()} />
          </div>
          <div>
            <label className="lbl">Senha</label>
            <div className="key-wrap">
              <input className="inp" type={showPass ? "text" : "password"} placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && handle()} style={{ paddingRight: 36 }} />
              <div className="key-eye" onClick={() => setShowPass(s => !s)}><Ic d={showPass ? I.eyeOff : I.eye} size={13} /></div>
            </div>
          </div>
          {err && <div style={{ fontSize: 11.5, color: "var(--red)", textAlign: "center" }}>{err}</div>}
          <button className="btn btn-p w-full" style={{ justifyContent: "center", padding: "10px 0", marginTop: 4 }} onClick={handle}>
            {loading ? <span className="pu">Entrando...</span> : "Entrar"}
          </button>
          <div style={{ textAlign: "center", fontSize: 11.5, color: "var(--t3)" }}>
            Não tem conta? <span style={{ color: "var(--acc)", cursor: "pointer", fontWeight: 600 }}>Criar conta grátis</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function BlakifyDashboard() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [view, setView] = useState("dashboard");
  const [showNew, setShowNew] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!loggedIn) return;
    const t = setTimeout(() => {
      setToast({ msg: "Maria Silva · R$ 119,70", id: Date.now() });
      setTimeout(() => setToast(null), 4500);
    }, 3500);
    return () => clearTimeout(t);
  }, [loggedIn]);

  if (!loggedIn) return <><style>{css}</style><Login onLogin={() => setLoggedIn(true)} /></>;

  const nav = [
    { id: "dashboard", lbl: "Dashboard", ic: I.dash },
    { id: "orders", lbl: "Pedidos", ic: I.orders, badge: "5" },
    { id: "products", lbl: "Produtos & Links", ic: I.links },
    { id: "gateways", lbl: "Gateways", ic: I.gw },
    { id: "pixels", lbl: "Pixels", ic: I.pixel },
    { id: "webhooks", lbl: "Webhooks", ic: I.wh },
    { id: "settings", lbl: "Deploy & Config.", ic: I.deploy },
  ];

  const titles = { dashboard: "Dashboard", orders: "Pedidos", products: "Produtos & Links", gateways: "Gateways", pixels: "Pixels", webhooks: "Webhooks", settings: "Deploy & Configurações" };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <aside className="sb">
          <div className="sb-logo">
            <div className="logo">
              <div className="logo-mark">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 14a1 1 0 01-.78-1.63l9.9-10.2a.5.5 0 01.86.46l-1.92 6.02A1 1 0 0013 10h7a1 1 0 01.78 1.63l-9.9 10.2a.5.5 0 01-.86-.46l1.92-6.02A1 1 0 0011 14H4z"/>
                </svg>
              </div>
              <div>
                <div className="logo-name">Blakify</div>
                <div className="logo-tag">SaaS de Checkout</div>
              </div>
            </div>
          </div>

          <nav className="sb-nav">
            <div className="nav-sec">
              <div className="nav-lbl">Principal</div>
              {nav.slice(0, 3).map(n => (
                <div key={n.id} className={`ni ${view === n.id ? "on" : ""}`} onClick={() => setView(n.id)}>
                  <Ic d={n.ic} size={14} />{n.lbl}
                  {n.badge && <span className="nb">{n.badge}</span>}
                </div>
              ))}
            </div>
            <div className="nav-sec">
              <div className="nav-lbl">Integrações</div>
              {nav.slice(3, 6).map(n => (
                <div key={n.id} className={`ni ${view === n.id ? "on" : ""}`} onClick={() => setView(n.id)}>
                  <Ic d={n.ic} size={14} />{n.lbl}
                </div>
              ))}
            </div>
            <div className="nav-sec">
              <div className="nav-lbl">Sistema</div>
              {nav.slice(6).map(n => (
                <div key={n.id} className={`ni ${view === n.id ? "on" : ""}`} onClick={() => setView(n.id)}>
                  <Ic d={n.ic} size={14} />{n.lbl}
                </div>
              ))}
            </div>
          </nav>

          <div className="sb-foot">
            <div className="ua">
              <div className="uav">N</div>
              <div>
                <div className="un">Natania Santos</div>
                <div className="up">Plano Pro · blakify.io</div>
              </div>
              <button className="btn btn-g btn-ico ml-a" style={{ flexShrink: 0 }} onClick={() => setLoggedIn(false)}>
                <Ic d={I.close} size={11} />
              </button>
            </div>
          </div>
        </aside>

        <main className="main">
          <div className="tb">
            <div className="tb-title">{titles[view]}</div>
            <div className="tb-search"><Ic d={I.search} size={12} /><span>Buscar...</span></div>
            <div className="row gap6">
              <button className="btn btn-g btn-ico" style={{ position: "relative" }}>
                <Ic d={I.bell} size={14} />
                <div style={{ position: "absolute", top: 4, right: 4, width: 5, height: 5, background: "var(--red)", borderRadius: "50%" }} />
              </button>
              {view === "products" && (
                <button className="tb-btn" onClick={() => setShowNew(true)}>
                  <Ic d={I.plus} size={12} /> Novo Produto
                </button>
              )}
            </div>
          </div>

          <div className="content">
            {view === "dashboard" && <Dashboard />}
            {view === "products" && <Products onNew={() => setShowNew(true)} />}
            {view === "orders" && <Orders />}
            {view === "gateways" && <Gateways />}
            {view === "pixels" && <Pixels />}
            {view === "webhooks" && <Webhooks />}
            {view === "settings" && <Deploy />}
          </div>
        </main>
      </div>

      {showNew && <NewProductModal onClose={() => setShowNew(false)} />}

      {toast && (
        <div className="toast" style={{
          position: "fixed", bottom: 22, right: 22, zIndex: 200,
          background: "#0e0e1a", border: "1px solid rgba(224,23,58,.25)",
          borderRadius: 13, padding: "12px 16px",
          boxShadow: "0 20px 40px rgba(0,0,0,.7)",
          display: "flex", alignItems: "center", gap: 11, maxWidth: 280,
        }}>
          <div style={{ width: 34, height: 34, background: "rgba(13,187,124,.12)", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>💸</div>
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 800, color: "var(--green)" }}>Venda aprovada!</div>
            <div style={{ fontSize: 11.5, color: "var(--t2)" }}>{toast.msg}</div>
          </div>
        </div>
      )}
    </>
  );
}
