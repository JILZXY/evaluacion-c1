import { NextResponse } from "next/server";
import { z } from "zod";
import { pool } from "@/../lib/db";

// Validación de filtros
const querySchema = z.object({
  date_from: z.string().optional(),
  date_to: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const params = querySchema.parse({
      date_from: url.searchParams.get("date_from"),
      date_to: url.searchParams.get("date_to"),
    });

    let query = `SELECT day, total_ventas, tickets, ticket_promedio 
                 FROM vw_sales_daily WHERE 1=1`;
    const values: any[] = [];

    if (params.date_from) {
      values.push(params.date_from);
      query += ` AND day >= $${values.length}`;
    }
    if (params.date_to) {
      values.push(params.date_to);
      query += ` AND day <= $${values.length}`;
    }

    query += ` ORDER BY day ASC`;

    const result = await pool.query(query, values);

    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}