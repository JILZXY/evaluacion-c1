import { NextResponse } from "next/server";
import { z } from "zod";
import { pool } from "@/../lib/db";

const querySchema = z.object({
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
      page: Number(url.searchParams.get("page") || 1),
      limit: Number(url.searchParams.get("limit") || 10),
    });

    const offset = (params.page - 1) * params.limit;

    const query = `SELECT customer_id, customer_name, num_orders, total_spent, avg_spent
                   FROM vw_customer_value
                   ORDER BY total_spent DESC
                   LIMIT $1 OFFSET $2`;

    const result = await pool.query(query, [params.limit, offset]);

    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}