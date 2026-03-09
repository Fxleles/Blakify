import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    const orders = status && status !== 'todos'
      ? await sql`
          SELECT o.id, o.order_code, o.customer_name, o.customer_email, o.amount, o.status,
                 o.gateway, o.transaction_id, o.utm_source, o.utm_medium,
                 o.created_at, p.name AS product_name
          FROM orders o
          LEFT JOIN products p ON o.product_id = p.id
          WHERE o.status = ANY(${status.split(',')}::text[])
          ORDER BY o.created_at DESC
          LIMIT ${limit}
        `
      : await sql`
          SELECT o.id, o.order_code, o.customer_name, o.customer_email, o.amount, o.status,
                 o.gateway, o.transaction_id, o.utm_source, o.utm_medium,
                 o.created_at, p.name AS product_name
          FROM orders o
          LEFT JOIN products p ON o.product_id = p.id
          ORDER BY o.created_at DESC
          LIMIT ${limit}
        `

    return NextResponse.json({ orders })
  } catch (error) {
    console.error('[API orders GET]', error)
    return NextResponse.json({ error: 'Erro ao buscar pedidos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { product_id, customer_name, customer_email, customer_cpf, amount, status, gateway, transaction_id, utm_source, utm_medium, utm_campaign } = body

    const [order] = await sql`
      INSERT INTO orders (product_id, customer_name, customer_email, customer_cpf, amount, status, gateway, transaction_id, utm_source, utm_medium, utm_campaign)
      VALUES (${product_id || null}, ${customer_name}, ${customer_email}, ${customer_cpf || null}, ${amount}, ${status || 'pending'}, ${gateway || null}, ${transaction_id || null}, ${utm_source || null}, ${utm_medium || null}, ${utm_campaign || null})
      RETURNING *
    `
    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('[API orders POST]', error)
    return NextResponse.json({ error: 'Erro ao criar pedido' }, { status: 500 })
  }
}
