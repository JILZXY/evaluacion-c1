import { NextResponse } from "next/server";
import { pool } from "@/../lib/db";

export async function GET(req: Request) {
  try {
    const role = req.headers.get("x-role");
    if (role !== process.env.ROLE_ADMIN && role !== process.env.ROLE_USER) {
       return NextResponse.json({ error: "Acceso no autorizado" }, { status: 401 });
    }
    const query = `SELECT method, total_amount, percent_of_total
                   FROM vw_payment_mix
                   ORDER BY percent_of_total DESC`;

    const result = await pool.query(query);

    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}