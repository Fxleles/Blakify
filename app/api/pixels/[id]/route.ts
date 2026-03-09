import { NextRequest, NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { status, global: isGlobal, events } = body
    const { id } = params

    const [pixel] = await sql`
      UPDATE pixels SET
        status = COALESCE(${status ?? null}, status),
        global = COALESCE(${isGlobal ?? null}, global),
        events = COALESCE(${events ? JSON.stringify(events) : null}::jsonb, events)
      WHERE id = ${id}
      RETURNING *
    `

    if (!pixel) return NextResponse.json({ error: 'Pixel não encontrado' }, { status: 404 })
    return NextResponse.json(pixel)
  } catch (error) {
    console.error('[API pixels PATCH]', error)
    return NextResponse.json({ error: 'Erro ao atualizar pixel' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await sql`DELETE FROM pixels WHERE id = ${params.id}`
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[API pixels DELETE]', error)
    return NextResponse.json({ error: 'Erro ao deletar pixel' }, { status: 500 })
  }
}
