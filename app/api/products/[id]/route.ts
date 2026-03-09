import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, price, slug, color, status } = body
    const { id } = params

    const [product] = await sql`
      UPDATE products SET
        name    = COALESCE(${name ?? null}, name),
        price   = COALESCE(${price != null ? parseFloat(price) : null}, price),
        slug    = COALESCE(${slug ?? null}, slug),
        color   = COALESCE(${color ?? null}, color),
        status  = COALESCE(${status ?? null}, status)
      WHERE id = ${id}
      RETURNING *
    `

    if (!product) return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })
    return NextResponse.json(product)
  } catch (error) {
    console.error('[API products PATCH]', error)
    return NextResponse.json({ error: 'Erro ao atualizar produto' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await sql`DELETE FROM products WHERE id = ${params.id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API products DELETE]', error)
    return NextResponse.json({ error: 'Erro ao deletar produto' }, { status: 500 })
  }
}
