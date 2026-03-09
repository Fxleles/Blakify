import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    const [agg] = await sql`
      SELECT
        COALESCE(SUM(amount), 0)::float                                       AS total_revenue,
        COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0)::float AS paid_revenue,
        COUNT(*)::int                                                          AS total_orders,
        COUNT(CASE WHEN status = 'paid' THEN 1 END)::int                      AS paid_count,
        CASE WHEN COUNT(*) > 0
          THEN ROUND((COUNT(CASE WHEN status = 'paid' THEN 1 END)::numeric / COUNT(*)) * 100, 1)
          ELSE 0
        END::float                                                             AS conversion,
        CASE WHEN COUNT(CASE WHEN status = 'paid' THEN 1 END) > 0
          THEN ROUND(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) /
               COUNT(CASE WHEN status = 'paid' THEN 1 END), 2)
          ELSE 0
        END::float                                                             AS avg_ticket
      FROM orders
    `

    const daily = await sql`
      SELECT
        TO_CHAR(DATE_TRUNC('day', created_at), 'DD/MM') AS day,
        COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0)::float AS v,
        COALESCE(SUM(CASE WHEN status = 'paid' THEN amount * 0.5 ELSE 0 END), 0)::float AS l
      FROM orders
      WHERE created_at >= NOW() - INTERVAL '9 days'
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY DATE_TRUNC('day', created_at)
    `

    const utm_stats = await sql`
      SELECT
        COALESCE(utm_source, 'direto')  AS source,
        COALESCE(utm_medium, '-')       AS medium,
        COUNT(CASE WHEN status = 'paid' THEN 1 END)::int AS conversions,
        COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0)::float AS revenue
      FROM orders
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY utm_source, utm_medium
      ORDER BY conversions DESC
      LIMIT 5
    `

    return NextResponse.json({
      ...agg,
      visits: 0,
      daily,
      utm_stats,
    })
  } catch (error) {
    console.error('[API dashboard/stats]', error)
    return NextResponse.json({ error: 'Erro ao buscar stats' }, { status: 500 })
  }
}
