import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status, methods, fields } = body
    const { id } = params

    const [gw] = await sql`
      UPDATE gateways SET
        status  = COALESCE(${status ?? null}, status),
        methods = COALESCE(${methods ? JSON.stringify(methods) + '::jsonb' : null}, methods),
        fields  = COALESCE(${fields ? JSON.stringify(fields) : null}::jsonb, fields)
      WHERE id = ${id}
      RETURNING *
    `

    if (!gw) return NextResponse.json({ error: 'Gateway não encontrado' }, { status: 404 })
    return NextResponse.json(gw)
  } catch (error) {
    console.error('[API gateways PATCH]', error)
    return NextResponse.json({ error: 'Erro ao atualizar gateway' }, { status: 500 })
  }
}
