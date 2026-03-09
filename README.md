# ⚡ Blakify — SaaS de Checkout

Plataforma de checkout com múltiplos gateways, pixels, webhooks e dashboard completo de vendas.

## Stack

- **Next.js 14** (App Router)
- **Neon PostgreSQL** (banco serverless)
- **Vercel** (hospedagem)
- **Masterpag + FreePay Brasil** (gateways integrados)

---

## 🚀 Deploy rápido

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/blakify.git
cd blakify
npm install
```

### 2. Configure o banco de dados (Neon)
1. Crie uma conta em [neon.tech](https://neon.tech)
2. Crie um novo projeto chamado `blakify`
3. Copie a **Connection String**
4. Abra o **SQL Editor** do Neon e cole o conteúdo de `schema.sql` → Execute

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env.local
# Edite .env.local com suas credenciais
```

### 4. Rode localmente
```bash
npm run dev
# Acesse http://localhost:3000
```

### 5. Deploy na Vercel
1. Suba o projeto no GitHub
2. Acesse [vercel.com](https://vercel.com) → **Import Project**
3. Selecione o repositório `blakify`
4. Em **Environment Variables**, adicione todas as variáveis do `.env.example`
5. Clique em **Deploy** ✅

---

## 📁 Estrutura

```
blakify/
├── app/
│   ├── api/
│   │   ├── create-pix/route.ts    # API Masterpag PIX
│   │   └── freepay/route.ts       # API FreePay Brasil
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   └── BlakifyDashboard.tsx       # Dashboard principal
├── lib/
│   └── db.ts                      # Conexão Neon
├── schema.sql                     # Schema do banco de dados
├── .env.example                   # Template de variáveis
└── README.md
```

---

## 🔑 Variáveis de ambiente necessárias

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | Connection string do Neon |
| `NEXTAUTH_SECRET` | Secret para autenticação |
| `MASTERPAG_PUBLIC_KEY` | Chave pública Masterpag |
| `MASTERPAG_SECRET_KEY` | Chave secreta Masterpag |
| `FREEPAY_CLIENT_ID` | Client ID FreePay Brasil |
| `FREEPAY_CLIENT_SECRET` | Client Secret FreePay Brasil |

---

## 💳 Gateways suportados

- ✅ **Masterpag** — PIX
- ✅ **FreePay Brasil** — PIX + Cartão
- 🔜 Mercado Pago
- 🔜 PagHiper
- 🔜 PagSeguro
