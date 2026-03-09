import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

export async function GET() {
  try {
    // Stats gerais
    const [stats] = await sql`
      SELECT
        COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0) AS total_vendas,
        COALESCE(SUM(CASE WHEN status = 'paid' THEN amount * 0.85 ELSE 0 END), 0) AS lucro_liquido,
        COUNT(*)::int AS total_pedidos,
        COUNT(CASE WHEN status = 'paid' THEN 1 END)::int AS pedidos_pagos,
        COUNT(CASE WHEN status = 'pending' THEN 1 END)::int AS pedidos_pendentes,
        CASE WHEN COUNT(*) > 0
          THEN ROUND((COUNT(CASE WHEN status = 'paid' THEN 1 END)::numeric / COUNT(*)) * 100, 2)
          ELSE 0
        END AS taxa_conversao,
        CASE WHEN COUNT(CASE WHEN status = 'paid' THEN 1 END) > 0
          THEN ROUND(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) / COUNT(CASE WHEN status = 'paid' THEN 1 END), 2)
          ELSE 0
        END AS ticket_medio
      FROM orders
      WHERE created_at >= NOW() - INTERVAL '30 days'
    `

    // Pedidos recentes
    const recentOrders = await sql`
      SELECT o.id, o.customer_name, o.amount, o.status, o.gateway, o.created_at,
             p.name AS produto
      FROM orders o
      LEFT JOIN products p ON o.product_id = p.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `

    // Dados do gráfico (últimos 9 dias)
    const chartData = await sql`
      SELECT
        TO_CHAR(DATE_TRUNC('day', created_at), 'DD/MM') AS day,
        COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0)::float AS v,
        COALESCE(SUM(CASE WHEN status = 'paid' THEN amount * 0.5 ELSE 0 END), 0)::float AS l
      FROM orders
      WHERE created_at >= NOW() - INTERVAL '9 days'
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY DATE_TRUNC('day', created_at)
    `

    // UTM stats
    const utmStats = await sql`
      SELECT
        COALESCE(utm_source, 'Direto') AS source,
        COALESCE(utm_medium, '-') AS medium,
        COUNT(*)::int AS clicks,
        COUNT(CASE WHEN status = 'paid' THEN 1 END)::int AS conv,
        COALESCE(SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END), 0)::float AS revenue
      FROM orders
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY utm_source, utm_medium
      ORDER BY conv DESC
      LIMIT 5
    `

    return NextResponse.json({ stats, recentOrders, chartData, utmStats })
  } catch (error) {
    console.error('[API dashboard/stats]', error)
    return NextResponse.json({ error: 'Erro ao buscar stats' }, { status: 500 })
  }
}
