import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status, events } = body
    const { id } = params

    const [webhook] = await sql`
      UPDATE webhooks SET
        status = COALESCE(${status ?? null}, status),
        events = COALESCE(${events ? JSON.stringify(events) : null}::jsonb, events)
      WHERE id = ${id}
      RETURNING *
    `

    if (!webhook) return NextResponse.json({ error: 'Webhook não encontrado' }, { status: 404 })
    return NextResponse.json(webhook)
  } catch (error) {
    console.error('[API webhooks PATCH]', error)
    return NextResponse.json({ error: 'Erro ao atualizar webhook' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await sql`DELETE FROM webhooks WHERE id = ${params.id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API webhooks DELETE]', error)
    return NextResponse.json({ error: 'Erro ao deletar webhook' }, { status: 500 })
  }
}
