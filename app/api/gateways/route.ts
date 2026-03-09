import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const gateways = await sql`
      SELECT id, name, status, methods, auth_type, field_defs, fields, docs_url, note
      FROM gateways
      ORDER BY created_at ASC
    `
    return NextResponse.json({ gateways })
  } catch (error) {
    console.error('[API gateways GET]', error)
    return NextResponse.json({ error: 'Erro ao buscar gateways' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, status, methods, auth_type, field_defs, fields, docs_url, note } = body

    const [gw] = await sql`
      INSERT INTO gateways (name, status, methods, auth_type, field_defs, fields, docs_url, note)
      VALUES (
        ${name},
        ${status ?? false},
        ${JSON.stringify(methods || {})}::jsonb,
        ${auth_type || 'header_keys'},
        ${JSON.stringify(field_defs || [])}::jsonb,
        ${JSON.stringify(fields || {})}::jsonb,
        ${docs_url || null},
        ${note || null}
      )
      RETURNING *
    `
    return NextResponse.json(gw, { status: 201 })
  } catch (error) {
    console.error('[API gateways POST]', error)
    return NextResponse.json({ error: 'Erro ao criar gateway' }, { status: 500 })
  }
}
