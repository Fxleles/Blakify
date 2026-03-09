import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, cpf, amount, quantity, productId } = body

    const cleanCPF = cpf.replace(/\D/g, '')
    const cleanPhone = phone.replace(/\D/g, '')

    if (!cleanCPF || cleanCPF.length !== 11) {
      return NextResponse.json({ error: 'CPF inválido' }, { status: 400 })
    }

    // Busca o gateway configurado para este produto no banco
    // Por ora usa as variáveis de ambiente do Masterpag
    const PUBLIC_KEY = process.env.MASTERPAG_PUBLIC_KEY!
    const SECRET_KEY = process.env.MASTERPAG_SECRET_KEY!
    const API_URL = process.env.MASTERPAG_API_URL!

    const expirationDate = new Date(Date.now() + 15 * 60 * 1000).toISOString()

    const payload = {
      amount,
      paymentMethod: 'pix',
      customer: {
        name,
        email,
        phone: cleanPhone,
        document: { number: cleanCPF, type: 'cpf' }
      },
      items: [{
        title: 'Produto',
        unitPrice: parseFloat((amount / quantity).toFixed(2)),
        quantity,
        tangible: true
      }],
      pix: { expirationDate },
      // UTM tracking
      metadata: {
        utm_source: body.utm_source || '',
        utm_medium: body.utm_medium || '',
        utm_campaign: body.utm_campaign || '',
        product_id: productId || '',
      }
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-public-key': PUBLIC_KEY,
        'x-secret-key': SECRET_KEY,
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json({ error: data.message || 'Erro no gateway' }, { status: response.status })
    }

    const pixCode = data.pix?.qrCode || data.pix?.qrCodeUrl || null

    return NextResponse.json({
      success: !!pixCode,
      qr_code: pixCode,
      transaction_id: data.id || data.shortId || null,
    })

  } catch (error) {
    console.error('[Masterpag PIX]', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
