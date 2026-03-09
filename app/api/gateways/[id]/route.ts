import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { id } = params

    // Build update fields dynamically
    const updates: string[] = []

    if (body.status !== undefined) {
      await sql`UPDATE gateways SET status = ${body.status} WHERE id = ${id}`
    }
    if (body.methods !== undefined) {
      await sql`UPDATE gateways SET methods = ${JSON.stringify(body.methods)}::jsonb WHERE id = ${id}`
    }
    if (body.fields !== undefined) {
      await sql`UPDATE gateways SET fields = ${JSON.stringify(body.fields)}::jsonb WHERE id = ${id}`
    }

    const [gw] = await sql`
      SELECT id, name, status, methods, auth_type, field_defs, fields, docs_url, note
      FROM gateways WHERE id = ${id}
    `
    if (!gw) return NextResponse.json({ error: 'Gateway não encontrado' }, { status: 404 })
    return NextResponse.json(gw)
  } catch (error) {
    console.error('[API gateways PATCH]', error)
    return NextResponse.json({ error: 'Erro ao atualizar gateway' }, { status: 500 })
  }
}
