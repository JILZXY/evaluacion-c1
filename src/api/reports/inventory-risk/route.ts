import { NextResponse } from "next/server";
import { z } from "zod";
import { pool } from "@/../lib/db";

// Validación de filtros
const querySchema = z.object({
  category: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const params = querySchema.parse({
      category: url.searchParams.get("category") || undefined,
    });

    let query = `SELECT product_id, product_name, category_name, stock, risk_percent 
                 FROM vw_inventory_risk WHERE 1=1`;
    const values: any[] = [];

    if (params.category) {
      values.push(params.category);
      query += ` AND category_name = $${values.length}`;
    }

    query += ` ORDER BY stock ASC`;

    const result = await pool.query(query, values);

    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}