import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não configurada. Adicione no .env.local ou nas variáveis da Vercel.')
}

export const sql = neon(process.env.DATABASE_URL)

// Helper para queries com tipagem
export async function query<T = unknown>(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<T[]> {
  return sql(strings, ...values) as Promise<T[]>
}
