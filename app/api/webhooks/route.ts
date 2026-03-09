import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const webhooks = await sql`
      SELECT
        w.id, w.name, w.url, w.status, w.events,
        COUNT(wl.id)::int AS tentativas,
        COUNT(CASE WHEN wl.status_code = 200 THEN 1 END)::int AS sucesso
      FROM webhooks w
      LEFT JOIN webhook_logs wl ON wl.webhook_id = w.id
      GROUP BY w.id
      ORDER BY w.created_at ASC
    `
    return NextResponse.json(webhooks)
  } catch (error) {
    console.error('[API webhooks GET]', error)
    return NextResponse.json({ error: 'Erro ao buscar webhooks' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, url, status, events } = body

    const [webhook] = await sql`
      INSERT INTO webhooks (name, url, status, events)
      VALUES (
        ${name}, ${url},
        ${status ?? false},
        ${JSON.stringify(events || { payment_confirmed: true, payment_pending: false, payment_expired: false, checkout_started: false, refund: false })}::jsonb
      )
      RETURNING *
    `
    return NextResponse.json(webhook, { status: 201 })
  } catch (error) {
    console.error('[API webhooks POST]', error)
    return NextResponse.json({ error: 'Erro ao criar webhook' }, { status: 500 })
  }
}
