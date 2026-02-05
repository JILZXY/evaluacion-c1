import { NextResponse } from "next/server";
import { z } from "zod";
import { pool } from "@/../lib/db";

const querySchema = z.object({
  search: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(10),
});

export async function GET(req: Request) {
  try {
    const role = req.headers.get("x-role");
    if (role !== process.env.ROLE_ADMIN && role !== process.env.ROLE_USER) {
       return NextResponse.json({ error: "Acceso no autorizado" }, { status: 401 });
    }
    const url = new URL(req.url);
    const params = querySchema.parse({
      search: url.searchParams.get("search") || undefined,
      page: Number(url.searchParams.get("page") || 1),
      limit: Number(url.searchParams.get("limit") || 10),
    });

    const offset = (params.page - 1) * params.limit;

    let query = `SELECT product_id, product_name, total_units, total_revenue, rank_revenue, rank_units 
                 FROM vw_top_products_ranked WHERE 1=1`;
    const values: any[] = [];

    if (params.search) {
      values.push(`%${params.search}%`);
      query += ` AND product_name ILIKE $${values.length}`;
    }

    values.push(params.limit);
    values.push(offset);
    query += ` ORDER BY rank_revenue ASC LIMIT $${values.length - 1} OFFSET $${values.length}`;

    const result = await pool.query(query, values);

    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}