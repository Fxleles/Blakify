import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const pixels = await sql`
      SELECT id, name, platform, pixel_id, status, is_global, events
      FROM pixels
      ORDER BY created_at ASC
    `
    return NextResponse.json({ pixels })
  } catch (error) {
    console.error('[API pixels GET]', error)
    return NextResponse.json({ error: 'Erro ao buscar pixels' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, platform, pixel_id, status, is_global, events } = body

    const [pixel] = await sql`
      INSERT INTO pixels (name, platform, pixel_id, status, is_global, events)
      VALUES (
        ${name}, ${platform}, ${pixel_id},
        ${status ?? true}, ${is_global ?? false},
        ${JSON.stringify(events || { purchase: true, allSales: false })}::jsonb
      )
      RETURNING *
    `
    return NextResponse.json(pixel, { status: 201 })
  } catch (error) {
    console.error('[API pixels POST]', error)
    return NextResponse.json({ error: 'Erro ao criar pixel' }, { status: 500 })
  }
}
