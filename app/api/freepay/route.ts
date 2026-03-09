import { NextRequest, NextResponse } from 'next/server'

// FreePay Brasil — autenticação Bearer Token
// Docs: https://freepaybrasil.readme.io/reference/introdução

async function getFreePayToken(): Promise<string> {
  const CLIENT_ID = process.env.FREEPAY_CLIENT_ID!
  const CLIENT_SECRET = process.env.FREEPAY_CLIENT_SECRET!
  const API_URL = process.env.FREEPAY_API_URL || 'https://api.freepaybrasil.com.br/v1'

  const response = await fetch(`${API_URL}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET }),
  })

  const data = await response.json()
  if (!response.ok || !data.access_token) {
    throw new Error('Falha ao obter token FreePay: ' + JSON.stringify(data))
  }

  return data.access_token
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, cpf, amount, quantity, paymentMethod = 'pix', productId } = body

    const cleanCPF = cpf.replace(/\D/g, '')
    const cleanPhone = phone.replace(/\D/g, '')
    const API_URL = process.env.FREEPAY_API_URL || 'https://api.freepaybrasil.com.br/v1'

    const token = await getFreePayToken()

    const payload = {
      amount,
      payment_method: paymentMethod, // 'pix' | 'credit_card'
      customer: {
        name,
        email,
        phone: cleanPhone,
        document: cleanCPF,
        document_type: 'cpf',
      },
      items: [{
        description: 'Produto',
        unit_price: parseFloat((amount / quantity).toFixed(2)),
        quantity,
      }],
      metadata: {
        product_id: productId || '',
        utm_source: body.utm_source || '',
        utm_medium: body.utm_medium || '',
      }
    }

    const response = await fetch(`${API_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.message || 'Erro FreePay' }, { status: response.status })
    }

    // PIX response
    if (paymentMethod === 'pix') {
      const pixCode = data.pix?.qr_code || data.pix?.copy_paste || data.qr_code || null
      return NextResponse.json({
        success: !!pixCode,
        qr_code: pixCode,
        transaction_id: data.id || null,
      })
    }

    // Cartão response
    return NextResponse.json({
      success: data.status === 'approved' || data.status === 'authorized',
      status: data.status,
      transaction_id: data.id || null,
    })

  } catch (error) {
    console.error('[FreePay]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
