import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const products = await sql`
      SELECT id, name, price, slug, color, status,
             COALESCE((SELECT COUNT(*) FROM orders WHERE product_id = products.id AND status = 'paid'), 0)::int AS vendas
      FROM products
      ORDER BY created_at DESC
    `
    return NextResponse.json(products)
  } catch (error) {
    console.error('[API products GET]', error)
    return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, price, slug, color } = body

    if (!name || !price || !slug) {
      return NextResponse.json({ error: 'Campos obrigatórios: name, price, slug' }, { status: 400 })
    }

    const [product] = await sql`
      INSERT INTO products (name, price, slug, color, status)
      VALUES (${name}, ${parseFloat(price)}, ${slug}, ${color || '#6366f1'}, true)
      RETURNING *
    `
    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error('[API products POST]', error)
    if (error.message?.includes('unique')) {
      return NextResponse.json({ error: 'Slug já existe' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Erro ao criar produto' }, { status: 500 })
  }
}
